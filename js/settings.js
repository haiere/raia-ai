/* ═══════════════════════════════════════════════════════
   RAIA · Reflecting Tomorrow · v1.2.6
   js/settings.js: konstanta, konfigurasi, state, dan persistensi
   (localStorage / sessionStorage). Tanpa akses DOM.
   ═══════════════════════════════════════════════════════ */

'use strict';

export const APP_VERSION = '1.2.6';
export const SETTINGS_KEY = 'raia_settings_v122';
export const SESSIONS_KEY = 'raia_sessions_v122';
export const CUSTOM_KEY = 'raia_custom_v124';
export const CUSTOM_KEY_PREFIX = 'raia_custom_key_';
export const MODELS_CACHE_KEY = 'raia_models_v124';
export const THEME_KEY = 'raia_theme';
export const KEY_STORE = 'raia_api_key';
export const REQUEST_TIMEOUT_MS = 120000;
export const TEST_TIMEOUT_MS = 20000;
export const CONTEXT_LIMIT = 20;
export const MAX_SESSIONS = 30;
export const MAX_CUSTOM = 20;
export const DEFAULT_PROVIDER = 'Gemini (Google)';
export const CUSTOM_PREFIX = 'custom:';
export const CUSTOM_COMPAT = ['openai', 'gemini', 'anthropic'];
export const OPENROUTER_REFERER = 'https://hajir.is-a.dev/raia-ai';

export const SYSTEM_PROMPT = [
    'You are Raia, a friendly, honest, and helpful AI assistant.',
    'Talk like a smart friend: warm and relaxed, but still clear and to the point.',
    'Reply in the same language the user writes in. If the user mixes languages, follow their mix.',
    'Match the length of your answer to the question. Short questions get short answers. Complex questions are explained step by step.',
    'If you are not sure, say so honestly. Do not make up facts, numbers, or sources.',
    'Use Markdown only when it helps readability: small headings, lists, or tables when useful.',
    'For tables, keep the number of columns small and the cell text concise so they are easy to read on small screens.',
    'Write math with LaTeX: $...$ for inline formulas and $$...$$ for display formulas.',
    'Put code in fenced code blocks and name the language.'
].join(' ');

/* compat: which wire format a provider speaks (openai | gemini | anthropic) */
export const PROVIDERS = {
    OpenRouter: {
        label: 'OpenRouter',
        compat: 'openai',
        models: ['anthropic/claude-sonnet-5', 'openai/gpt-5.6', 'google/gemini-3.5-flash', 'meta-llama/llama-4-maverick', 'mistralai/mistral-large-3', 'deepseek/deepseek-v4'],
        baseUrl: 'https://openrouter.ai/api/v1',
        keyUrl: 'https://openrouter.ai/settings/keys'
    },
    OpenAI: {
        label: 'OpenAI',
        compat: 'openai',
        models: ['gpt-5.6', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-4o', 'gpt-4o-mini'],
        baseUrl: 'https://api.openai.com/v1',
        keyUrl: 'https://platform.openai.com/api-keys'
    },
    Perplexity: {
        label: 'Perplexity',
        compat: 'openai',
        noList: true,
        models: ['sonar', 'sonar-pro', 'sonar-reasoning-pro', 'sonar-deep-research'],
        baseUrl: 'https://api.perplexity.ai',
        keyUrl: 'https://www.perplexity.ai/settings/api'
    },
    'Claude (Anthropic)': {
        label: 'Claude (Anthropic)',
        compat: 'anthropic',
        models: ['claude-sonnet-5', 'claude-opus-4-8', 'claude-haiku-4-5-20251001', 'claude-fable-5'],
        baseUrl: 'https://api.anthropic.com/v1',
        keyUrl: 'https://console.anthropic.com/settings/keys'
    },
    'Gemini (Google)': {
        label: 'Gemini (Google)',
        compat: 'gemini',
        models: ['gemini-2.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'],
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        keyUrl: 'https://aistudio.google.com/app/apikey'
    },
    Mistral: {
        label: 'Mistral',
        compat: 'openai',
        models: ['mistral-large-latest', 'mistral-small-latest', 'magistral-medium-latest', 'codestral-latest'],
        baseUrl: 'https://api.mistral.ai/v1',
        keyUrl: 'https://console.mistral.ai/api-keys/'
    }
};

/* Providers that block direct browser calls; they need a CORS proxy when one is set */
export const CORS_BLOCKED = ['OpenAI', 'Perplexity', 'Mistral'];
export const BUILTIN_PROXY_URL = 'https://raia-proxy.haiere.workers.dev/';

export const t = (key, vars) => window.I18N.t(key, vars);
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function tx(key, fallback, vars) {
    const value = t(key, vars);
    if (value && value !== key) return value;
    return vars ? fallback.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : '')) : fallback;
}

export function readJSON(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value === null || value === undefined ? fallback : value;
    } catch (_) {
        return fallback;
    }
}

export function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* storage full or blocked */ }
}

/* ─── State ─── */
export const state = {
    provider: DEFAULT_PROVIDER,
    model: PROVIDERS[DEFAULT_PROVIDER].models[0],
    apiKey: '',
    remember: true,
    baseUrl: '',
    proxyUrl: '',
    temp: 0.7,
    maxTokens: 1024,
    messages: [],
    sessions: [],
    sessionId: null,
    loading: false,
    custom: [],        /* { id, label, baseUrl, compat, model, apiKey } */
    catalog: {},       /* provider key -> { fetchedAt, models: [{ id, name, provider, capabilities, active }] } */
    quota: null,       /* { limit, remaining, reset } from X-RateLimit-* headers */
    editingCustomId: null,
    unseen: 0
};

export function findCustom(key) {
    if (typeof key !== 'string' || !key.startsWith(CUSTOM_PREFIX)) return null;
    return state.custom.find((c) => CUSTOM_PREFIX + c.id === key) || null;
}

export function getProviderInfo(key) {
    if (PROVIDERS[key]) return PROVIDERS[key];
    const c = findCustom(key);
    if (!c) return null;
    return {
        label: c.label,
        compat: c.compat,
        custom: true,
        models: [c.model],
        baseUrl: c.baseUrl,
        keyUrl: ''
    };
}

export function resolveKey(provider) {
    const c = findCustom(provider);
    return c ? c.apiKey : state.apiKey;
}

/* Model metadata is kept separately from provider config:
   a provider's models come from its own API when fetched, otherwise from the built-in list. */
export function modelsFor(provider) {
    const cached = state.catalog[provider];
    if (cached && Array.isArray(cached.models) && cached.models.length) {
        return cached.models.filter((m) => m.active !== false);
    }
    const info = getProviderInfo(provider);
    if (!info) return [];
    return info.models.map((id) => ({ id, name: id, provider, capabilities: ['chat'], active: true }));
}

export function readKey() {
    try {
        return localStorage.getItem(KEY_STORE) || sessionStorage.getItem(KEY_STORE) || '';
    } catch (_) {
        return '';
    }
}

export function customKeyFor(id) {
    try {
        return localStorage.getItem(CUSTOM_KEY_PREFIX + id) || sessionStorage.getItem(CUSTOM_KEY_PREFIX + id) || '';
    } catch (_) {
        return '';
    }
}

export function storeCustomKey(id, key) {
    try {
        localStorage.removeItem(CUSTOM_KEY_PREFIX + id);
        sessionStorage.removeItem(CUSTOM_KEY_PREFIX + id);
        if (!key) return;
        (state.remember ? localStorage : sessionStorage).setItem(CUSTOM_KEY_PREFIX + id, key);
    } catch (_) { /* storage blocked */ }
}

export function removeCustomKey(id) {
    try {
        localStorage.removeItem(CUSTOM_KEY_PREFIX + id);
        sessionStorage.removeItem(CUSTOM_KEY_PREFIX + id);
    } catch (_) { /* storage blocked */ }
}

export function isValidCustomRecord(c) {
    return Boolean(c) &&
        typeof c.id === 'string' &&
        typeof c.label === 'string' &&
        typeof c.baseUrl === 'string' &&
        typeof c.model === 'string' &&
        CUSTOM_COMPAT.includes(c.compat);
}

export function loadCustomProviders() {
    const list = readJSON(CUSTOM_KEY, []);
    state.custom = (Array.isArray(list) ? list : [])
        .filter(isValidCustomRecord)
        .slice(0, MAX_CUSTOM)
        .map((c) => ({
            id: c.id,
            label: c.label,
            baseUrl: c.baseUrl,
            compat: c.compat,
            model: c.model,
            apiKey: customKeyFor(c.id)
        }));
}

export function persistCustomProviders() {
    writeJSON(CUSTOM_KEY, state.custom.map(({ id, label, baseUrl, compat, model }) => ({
        id, label, baseUrl, compat, model
    })));
}

export function loadCatalog() {
    const saved = readJSON(MODELS_CACHE_KEY, {});
    state.catalog = {};
    if (!saved || typeof saved !== 'object') return;
    Object.keys(saved).forEach((key) => {
        const entry = saved[key];
        if (entry && Array.isArray(entry.models)) {
            state.catalog[key] = { fetchedAt: Number(entry.fetchedAt) || 0, models: entry.models };
        }
    });
}

export function persistCatalog() {
    writeJSON(MODELS_CACHE_KEY, state.catalog);
}

export function loadSettings() {
    const saved = readJSON(SETTINGS_KEY, {});
    if (saved && getProviderInfo(saved.provider)) state.provider = saved.provider;
    state.remember = saved.remember !== false;
    state.baseUrl = typeof saved.baseUrl === 'string' ? saved.baseUrl : '';
    state.proxyUrl = typeof saved.proxyUrl === 'string' ? saved.proxyUrl : '';
    state.temp = typeof saved.temp === 'number' ? clamp(saved.temp, 0, 2) : 0.7;
    state.maxTokens = typeof saved.maxTokens === 'number' ? clamp(Math.round(saved.maxTokens), 256, 8192) : 1024;
    state.model = typeof saved.model === 'string' && saved.model.trim()
        ? saved.model.trim()
        : getProviderInfo(state.provider).models[0];
    state.apiKey = readKey();
}

export function persistSettings() {
    writeJSON(SETTINGS_KEY, {
        provider: state.provider,
        model: state.model,
        remember: state.remember,
        baseUrl: state.baseUrl,
        proxyUrl: state.proxyUrl,
        temp: state.temp,
        maxTokens: state.maxTokens
    });
    try {
        if (state.apiKey && state.remember) {
            localStorage.setItem(KEY_STORE, state.apiKey);
            sessionStorage.removeItem(KEY_STORE);
        } else {
            localStorage.removeItem(KEY_STORE);
            if (state.apiKey) sessionStorage.setItem(KEY_STORE, state.apiKey);
            else sessionStorage.removeItem(KEY_STORE);
        }
    } catch (_) { /* storage blocked */ }
}

export function loadSessions() {
    const list = readJSON(SESSIONS_KEY, []);
    state.sessions = Array.isArray(list)
        ? list.filter((s) => s && s.id && Array.isArray(s.messages))
        : [];
}

export function persistSessions() {
    writeJSON(SESSIONS_KEY, state.sessions.slice(0, MAX_SESSIONS));
}

export function usesFreeProxy(provider, apiKey) {
    return provider === DEFAULT_PROVIDER && !apiKey;
}

export function hasKey() {
    return Boolean(resolveKey(state.provider)) || usesFreeProxy(state.provider, '');
}
