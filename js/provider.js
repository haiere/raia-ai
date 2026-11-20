/* ═══════════════════════════════════════════════════════
   RAIA · Reflecting Tomorrow · v1.2.6
   js/provider.js: logika request, parsing respons, daftar
   model, pesan error, dan stream dari proxy.
   ═══════════════════════════════════════════════════════ */

'use strict';

import {
  clamp, t, tx, state, DEFAULT_PROVIDER, PROVIDERS, CORS_BLOCKED, BUILTIN_PROXY_URL,
  OPENROUTER_REFERER, SYSTEM_PROMPT, getProviderInfo, usesFreeProxy
} from './settings.js';

export class ApiError extends Error {
    constructor(status, message, code) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code || '';
    }
}

export function normalizeModels(list, provider) {
    const seen = new Set();
    return list
        .filter((m) => m && typeof m.id === 'string' && m.id.trim())
        .map((m) => ({
            id: m.id.trim(),
            name: String(m.name || m.id).slice(0, 120),
            provider,
            capabilities: Array.isArray(m.capabilities) ? m.capabilities : ['chat'],
            active: true
        }))
        .filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}

/* ─── Model list adapters: one per wire format ─── */
export const OPENAI_CHAT_ID = /^(gpt-|o\d|chatgpt-)/i;
export const OPENAI_NOT_CHAT = /(embed|tts|whisper|dall-e|image|audio|realtime|moderation|transcribe|search)/i;

export function parseOpenAIModels(data, provider) {
    return (Array.isArray(data.data) ? data.data : []).map((m) => ({
        id: m.id,
        name: m.name || m.id,
        capabilities: ['chat']
    })).filter((m) => {
        if (provider !== 'OpenAI') return true;
        return OPENAI_CHAT_ID.test(m.id) && !OPENAI_NOT_CHAT.test(m.id);
    });
}

export function parseOpenRouterModels(data) {
    return (Array.isArray(data.data) ? data.data : [])
        .filter((m) => !m.architecture || (m.architecture.output_modalities || ['text']).includes('text'))
        .map((m) => {
            const input = (m.architecture && m.architecture.input_modalities) || ['text'];
            return {
                id: m.id,
                name: m.name || m.id,
                capabilities: input.includes('image') ? ['chat', 'vision'] : ['chat']
            };
        });
}

export function parseMistralModels(data) {
    return (Array.isArray(data.data) ? data.data : [])
        .filter((m) => m.capabilities && m.capabilities.completion_chat)
        .map((m) => ({ id: m.id, name: m.name || m.id, capabilities: ['chat'] }));
}

export function parseAnthropicModels(data) {
    return (Array.isArray(data.data) ? data.data : []).map((m) => ({
        id: m.id,
        name: m.display_name || m.id,
        capabilities: ['chat']
    }));
}

export function parseGeminiModels(data) {
    return (Array.isArray(data.models) ? data.models : [])
        .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
        .map((m) => {
            const id = String(m.name || '').replace(/^models\//, '');
            return { id, name: m.displayName || id, capabilities: ['chat'] };
        });
}

/* Returns { url, headers, parse } for listing a provider's models, or null if it cannot list */
export function listRequest(cfg) {
    const info = getProviderInfo(cfg.provider);
    if (!info || info.noList) return null;
    const base = (cfg.baseUrl || info.baseUrl).replace(/\/+$/, '');
    const key = cfg.apiKey;
    if (!key) return null;

    if (info.compat === 'gemini') {
        return {
            url: `${base}/models?pageSize=1000`,
            headers: { 'x-goog-api-key': key },
            parse: parseGeminiModels
        };
    }
    if (info.compat === 'anthropic') {
        return {
            url: `${base}/models?limit=100`,
            headers: {
                'x-api-key': key,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            parse: parseAnthropicModels
        };
    }

    const headers = { Authorization: `Bearer ${key}` };
    let parse = (data) => parseOpenAIModels(data, cfg.provider);
    if (cfg.provider === 'OpenRouter') {
        headers['HTTP-Referer'] = OPENROUTER_REFERER;
        headers['X-Title'] = 'Raia AI';
        parse = parseOpenRouterModels;
    } else if (cfg.provider === 'Mistral') {
        parse = parseMistralModels;
    }
    return { url: `${base}/models`, headers, parse };
}

export function readQuota(headers) {
    const rem = headers.get('X-RateLimit-Remaining');
    if (rem === null || !/^\d+$/.test(rem.trim())) return null;
    const remaining = Number(rem);
    if (!Number.isFinite(remaining) || remaining < 0) return null;
    const limit = Number(headers.get('X-RateLimit-Limit'));
    const reset = Number(headers.get('X-RateLimit-Reset'));
    return {
        limit: Number.isFinite(limit) && limit > 0 ? limit : null,
        remaining,
        reset: Number.isFinite(reset) && reset > 0 ? reset : null
    };
}

export function isReasoningModel(model) {
    return /gpt-5|^o\d/i.test(model);
}

export function clampTemp(provider, temp) {
    const info = getProviderInfo(provider);
    const max = info && info.compat === 'anthropic' ? 1 : provider === 'Mistral' ? 1.5 : 2;
    return clamp(temp, 0, max);
}

/* Routes the request through the CORS proxy for providers that block browsers */
export function applyProxy(provider, proxyUrl, url, headers) {
    if (CORS_BLOCKED.includes(provider) && proxyUrl) {
        headers['X-Target-Url'] = url;
        return { url: proxyUrl.replace(/\/+$/, ''), headers };
    }
    return { url, headers };
}

export function buildRequest(cfg, history) {
    const provider = cfg.provider;
    const info = getProviderInfo(provider) || PROVIDERS[DEFAULT_PROVIDER];
    const compat = info.compat;
    const model = cfg.model;
    const apiKey = cfg.apiKey;
    const base = (cfg.baseUrl || info.baseUrl).replace(/\/+$/, '');
    const temp = clampTemp(provider, cfg.temp);
    const tokens = cfg.maxTokens;
    let url;
    let headers;
    let body;

    if (compat === 'gemini') {
        if (usesFreeProxy(provider, apiKey)) {
            url = BUILTIN_PROXY_URL;
            headers = { 'Content-Type': 'application/json' };
        } else {
            url = `${base}/models/${encodeURIComponent(model)}:generateContent`;
            headers = { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey };
        }
        body = {
            contents: history.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: temp, maxOutputTokens: tokens }
        };
        if (usesFreeProxy(provider, apiKey)) body.model = model;
    } else if (compat === 'anthropic') {
        url = `${base}/messages`;
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        };
        body = {
            model,
            system: SYSTEM_PROMPT,
            max_tokens: tokens,
            temperature: temp,
            messages: history
        };
    } else {
        url = `${base}/chat/completions`;
        headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        };
        if (provider === 'OpenRouter') {
            headers['HTTP-Referer'] = OPENROUTER_REFERER;
            headers['X-Title'] = 'Raia AI';
        }

        let messages;
        if (provider === 'Perplexity') {
            messages = history.map((m, i) =>
                i === 0 && m.role === 'user'
                    ? { role: 'user', content: `${SYSTEM_PROMPT}\n\n${m.content}` }
                    : m
            );
        } else {
            messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history];
        }

        body = { model, messages };
        const reasoning = isReasoningModel(model);
        if (!reasoning) body.temperature = temp;
        if (provider === 'OpenAI' && reasoning) body.max_completion_tokens = tokens;
        else body.max_tokens = tokens;
    }

    const routed = applyProxy(provider, cfg.proxyUrl, url, headers);
    return { url: routed.url, headers: routed.headers, body: JSON.stringify(body) };
}

/* Metadata for the provider line. Free-proxy responses use the Worker's own metadata. */
export function buildMeta(cfg, data) {
    const raia = data && data.raia;
    if (raia && typeof raia === 'object' && usesFreeProxy(cfg.provider, cfg.apiKey)) {
        return {
            provider: raia.provider === 'openrouter' ? 'OpenRouter' : 'Gemini',
            providerType: raia.providerType === 'backup' ? 'backup' : 'primary',
            model: String(raia.model || cfg.model),
            requested: cfg.model,
            fallbackUsed: raia.fallbackUsed === true
        };
    }
    const info = getProviderInfo(cfg.provider);
    return {
        provider: info ? info.label : cfg.provider,
        providerType: 'primary',
        model: cfg.model,
        requested: cfg.model,
        fallbackUsed: false
    };
}

export function parseReply(provider, data) {
    const info = getProviderInfo(provider);
    if (info && info.compat === 'gemini') {
        return ((data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [])
            .map((p) => p.text || '')
            .join('');
    }
    if (info && info.compat === 'anthropic') {
        return ((data && data.content) || [])
            .filter((b) => typeof b.text === 'string')
            .map((b) => b.text)
            .join('');
    }
    const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.map((p) => (p && p.text) || '').join('');
    return '';
}

/* Reads the error body into a short, safe message and a machine-readable code. Never returns raw HTML or keys. */
export async function readError(resp) {
    let message = '';
    let code = '';
    try {
        const text = await resp.text();
        try {
            const json = JSON.parse(text);
            const e = json.error;
            if (e && typeof e === 'object') {
                message = e.message || '';
                code = typeof e.code === 'string' ? e.code : '';
            } else {
                message = (typeof e === 'string' ? e : '') || json.message || '';
            }
            if (!message) message = text;
        } catch (_) {
            message = text;
        }
    } catch (_) { /* body unreadable */ }
    return {
        message: String(message || resp.statusText || resp.status).slice(0, 240),
        code
    };
}

export function describeError(err, provider) {
    const providerName = (getProviderInfo(provider) && getProviderInfo(provider).label) || provider;

    if (err instanceof ApiError) {
        if (err.code === 'rate_limited') {
            return {
                title: tx('errRateLimitTitle', 'Terlalu cepat'),
                body: tx('errRateLimitBody', 'Terlalu banyak permintaan dalam waktu singkat. Tunggu sebentar lalu coba lagi.')
            };
        }
        if (err.status === 429 || err.code === 'quota') {
            if (usesFreeProxy(provider, state.apiKey)) {
                return {
                    title: t('errRateTitle'),
                    body: tx('errQuotaBody', 'Kuota API gratis hari ini sudah habis.'),
                    action: { label: tx('useOwnKey', 'Pakai API key sendiri') }
                };
            }
            return { title: t('errRateTitle'), body: t('errRateBody') };
        }
        if (err.status === 401 || err.status === 403) {
            return { title: t('errAuthTitle'), body: t('errAuthBody', { provider: providerName }) };
        }
        if (err.status === 404 || err.code === 'model_unavailable') {
            return { title: t('errModelTitle'), body: t('errModelBody', { model: state.model, provider: providerName }) };
        }
        return { title: t('errGenericTitle'), body: `${t('errGenericBody')} (${err.status}) ${err.message}` };
    }

    if (err instanceof TypeError) {
        if (CORS_BLOCKED.includes(provider) && !state.proxyUrl) {
            return { title: t('errNetTitle'), body: t('errCorsBody', { provider: providerName }) };
        }
        return { title: t('errNetTitle'), body: t('errNetBody') };
    }

    return { title: t('errGenericTitle'), body: err.message || t('errGenericBody') };
}


/* ═══════════════════════════════════════
   STREAM DARI PROXY GRATIS
   Membaca text/event-stream dari Worker v1.2.6.
   Event: meta (raia), default (potongan Gemini), done, error.
   Hanya dipakai untuk provider bawaan saat memakai proxy gratis.
   ═══════════════════════════════════════ */
export async function streamFreeProxy(cfg, history, { signal, onMeta, onText, onQuota, fallbackEnabled = true, turnstileToken = '' } = {}) {
  const req = buildRequest(cfg, history);
  const body = JSON.parse(req.body);
  body.stream = true;

  const headers = { ...req.headers, Accept: 'text/event-stream' };
  if (!fallbackEnabled) headers['X-Raia-Fallback'] = 'off';
  if (turnstileToken) headers['X-Turnstile-Token'] = turnstileToken;

  const resp = await fetch(req.url, { method: 'POST', headers, body: JSON.stringify(body), signal });
  const quota = readQuota(resp.headers);
  if (onQuota) onQuota(quota);
  if (!resp.ok) {
    const info = await readError(resp);
    throw new ApiError(resp.status, info.message, info.code);
  }
  if (!resp.body) throw new ApiError(502, '', 'server');

  const reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = '';
  let finished = false;

  // Mengembalikan 'done' jika event selesai diterima.
  const handle = (block) => {
    let event = 'message';
    const dataLines = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
    }
    if (!dataLines.length) return null;
    const data = JSON.parse(dataLines.join('\n'));
    if (event === 'meta') {
      if (onMeta) onMeta(data.raia || {});
      return null;
    }
    if (event === 'error') {
      const e = data.error || {};
      throw new ApiError(502, String(e.message || ''), typeof e.code === 'string' ? e.code : 'server');
    }
    if (event === 'done') return 'done';
    const text = parseReply(DEFAULT_PROVIDER, data);
    if (text && onText) onText(text);
    return null;
  };

  try {
    while (!finished) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      let idx;
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        const block = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (handle(block) === 'done') { finished = true; break; }
      }
    }
  } finally {
    if (!finished) reader.cancel().catch(() => {});
  }

  if (!finished) throw new ApiError(502, '', 'server'); // stream putus sebelum selesai
  return { quota };
}
