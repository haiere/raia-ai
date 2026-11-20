// Unit untuk modul di js/: settings, provider (termasuk stream), ui helper, dan chat helper.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';

// Stub browser minimal. Modul hanya menyentuh window/localStorage saat fungsinya dipanggil.
const store = new Map();
const sess = new Map();
globalThis.window = { I18N: { t: (k) => k }, matchMedia: () => ({ matches: false }) };
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k)
};
globalThis.sessionStorage = {
  getItem: (k) => (sess.has(k) ? sess.get(k) : null),
  setItem: (k, v) => sess.set(k, String(v)),
  removeItem: (k) => sess.delete(k)
};

let S, P, U, C;
before(async () => {
  S = await import('../js/settings.js');
  P = await import('../js/provider.js');
  U = await import('../js/ui.js');
  C = await import('../js/chat.js');
});

const FREE = () => ({ provider: 'Gemini (Google)', model: 'gemini-2.5-flash-lite', apiKey: '', baseUrl: '', proxyUrl: '', temp: 0.7, maxTokens: 1024 });
const HIST = [{ role: 'user', content: 'hai' }, { role: 'assistant', content: 'halo' }];

test('free proxy request: url, model, and role mapping', () => {
  const r = P.buildRequest(FREE(), HIST);
  const b = JSON.parse(r.body);
  assert.equal(r.url, 'https://raia-proxy.haiere.workers.dev/');
  assert.equal(b.model, 'gemini-2.5-flash-lite');
  assert.equal(b.contents[1].role, 'model');
});

test('direct Gemini request puts the key in a header, not the URL', () => {
  const r = P.buildRequest({ ...FREE(), apiKey: 'K' }, HIST);
  assert.ok(r.url.endsWith('/models/gemini-2.5-flash-lite:generateContent'));
  assert.equal(r.headers['x-goog-api-key'], 'K');
  assert.ok(!r.url.includes('K'));
});

test('OpenAI reasoning models use max_completion_tokens and omit temperature', () => {
  const r = P.buildRequest({ provider: 'OpenAI', model: 'gpt-5.6', apiKey: 'K', temp: 1, maxTokens: 500, baseUrl: '', proxyUrl: '' }, HIST);
  const b = JSON.parse(r.body);
  assert.equal(b.max_completion_tokens, 500);
  assert.equal(b.temperature, undefined);
});

test('Perplexity merges the system prompt into the first user turn', () => {
  const r = P.buildRequest({ provider: 'Perplexity', model: 'sonar', apiKey: 'K', temp: 0.5, maxTokens: 100, baseUrl: '', proxyUrl: '' }, HIST);
  assert.ok(JSON.parse(r.body).messages[0].content.includes('\n\nhai'));
});

test('CORS-blocked providers route through the configured proxy', () => {
  const r = P.buildRequest({ provider: 'Mistral', model: 'mistral-small-latest', apiKey: 'K', temp: 0.5, maxTokens: 100, baseUrl: '', proxyUrl: 'https://px.example/' }, HIST);
  assert.equal(r.url, 'https://px.example');
  assert.ok(r.headers['X-Target-Url'].startsWith('https://api.mistral.ai'));
});

test('Anthropic clamps temperature to 1', () => {
  const r = P.buildRequest({ provider: 'Claude (Anthropic)', model: 'claude-sonnet-5', apiKey: 'K', temp: 1.8, maxTokens: 100, baseUrl: '', proxyUrl: '' }, HIST);
  assert.equal(JSON.parse(r.body).temperature, 1);
});

test('parseReply reads each wire format', () => {
  assert.equal(P.parseReply('Gemini (Google)', { candidates: [{ content: { parts: [{ text: 'a' }, { text: 'b' }] } }] }), 'ab');
  assert.equal(P.parseReply('Claude (Anthropic)', { content: [{ type: 'text', text: 'x' }, { type: 'tool_use' }, { type: 'text', text: 'y' }] }), 'xy');
  assert.equal(P.parseReply('OpenAI', { choices: [{ message: { content: 'z' } }] }), 'z');
  assert.equal(P.parseReply('OpenAI', {}), '');
});

test('describeError offers an own-key action when the free quota is used up', () => {
  const d = P.describeError(new P.ApiError(429, 'msg', 'quota'), 'Gemini (Google)');
  assert.ok(d.action && d.action.label);
});

test('settings persist the key to localStorage when "remember" is on, and load it back', () => {
  S.state.provider = 'OpenAI';
  S.state.model = 'gpt-4o';
  S.state.apiKey = 'SECRET';
  S.state.remember = true;
  S.persistSettings();
  assert.equal(localStorage.getItem(S.KEY_STORE), 'SECRET');
  S.loadSettings();
  assert.equal(S.state.provider, 'OpenAI');
  assert.equal(S.state.model, 'gpt-4o');
  assert.equal(S.state.apiKey, 'SECRET');
});

test('listRequest: Gemini list url, and providers without a list return null', () => {
  assert.ok(P.listRequest({ provider: 'Gemini (Google)', apiKey: 'K', baseUrl: '' }).url.includes('/models?pageSize=1000'));
  assert.equal(P.listRequest({ provider: 'Perplexity', apiKey: 'K', baseUrl: '' }), null);
});

// ─── streamFreeProxy ───
const sse = (parts) => new Response(new ReadableStream({
  start(c) {
    const enc = new TextEncoder();
    for (const p of parts) {
      const bytes = enc.encode(p);
      const cut = Math.floor(bytes.length / 2);
      c.enqueue(bytes.slice(0, cut));
      c.enqueue(bytes.slice(cut));
    }
    c.close();
  }
}), { status: 200, headers: { 'X-RateLimit-Remaining': '9', 'Content-Type': 'text/event-stream' } });

const withFetch = async (impl, fn) => {
  const original = globalThis.fetch;
  globalThis.fetch = impl;
  try { return await fn(); } finally { globalThis.fetch = original; }
};

test('streamFreeProxy assembles text across split reads and reports meta and quota', async () => {
  const frames = [
    'event: meta\ndata: {"raia":{"provider":"gemini","providerType":"primary","model":"gemini-2.5-flash-lite","fallbackUsed":false}}\n\n',
    'data: {"candidates":[{"content":{"role":"model","parts":[{"text":"Ha"}]}}]}\n\n',
    'data: {"candidates":[{"content":{"role":"model","parts":[{"text":"lo"}]}}]}\n\n',
    'event: done\ndata: {}\n\n'
  ];
  let text = '';
  let meta = null;
  let quota = null;
  await withFetch(async () => sse(frames), () => P.streamFreeProxy(FREE(), HIST, {
    onMeta: (m) => { meta = m; },
    onText: (t) => { text += t; },
    onQuota: (q) => { quota = q; }
  }));
  assert.equal(text, 'Halo');
  assert.equal(meta.model, 'gemini-2.5-flash-lite');
  assert.equal(quota.remaining, 9);
});

test('streamFreeProxy turns an in-stream error event into ApiError', async () => {
  await withFetch(async () => sse(['event: error\ndata: {"error":{"code":"server","message":"x"}}\n\n']), async () => {
    await assert.rejects(
      P.streamFreeProxy(FREE(), HIST, { onText() {} }),
      (err) => err.name === 'ApiError' && err.code === 'server'
    );
  });
});

test('streamFreeProxy treats a stream that ends without done as an error', async () => {
  await withFetch(async () => sse(['data: {"candidates":[{"content":{"parts":[{"text":"a"}]}}]}\n\n']), async () => {
    await assert.rejects(P.streamFreeProxy(FREE(), HIST, { onText() {} }), (err) => err.code === 'server');
  });
});

// ─── ui helpers ───
const temp = { min: '0', max: '2', step: '0.1', value: '0.7' };
const tok = { min: '256', max: '8192', step: '1', value: '1024' };

test('normalizeRangeValue: comma decimal, clamping, and fallback on junk', () => {
  assert.equal(U.normalizeRangeValue(temp, '0,75', 1), 0.8);
  assert.equal(U.normalizeRangeValue(temp, '9', 1), 2);
  assert.equal(U.normalizeRangeValue(tok, '100', 0), 256);
  assert.equal(U.normalizeRangeValue(tok, '500', 0), 500);
  assert.equal(U.normalizeRangeValue(tok, 'abc', 0), 1024);
});

test('paintRangeFill sets --fill as a percentage of the range', () => {
  const el = { min: '256', max: '8192', value: '4224', style: { props: {}, setProperty(k, v) { this.props[k] = v; } } };
  U.paintRangeFill(el);
  assert.equal(el.style.props['--fill'], '50.00%');
});

// ─── token stream ───
test('createTokenStream accumulates, paints once per frame, and flush paints immediately', () => {
  let rafFn = null;
  globalThis.requestAnimationFrame = (fn) => { rafFn = fn; return 1; };
  globalThis.cancelAnimationFrame = () => { rafFn = null; };
  const body = { innerHTML: '' };
  const msg = { content: '' };
  let frames = 0;
  const stream = C.createTokenStream(msg, { getBody: () => body, onFrame: () => frames++ });
  stream.push('Ha');
  stream.push('lo');
  assert.equal(msg.content, 'Halo');
  assert.equal(body.innerHTML, '');
  rafFn();
  assert.ok(body.innerHTML.includes('Halo'));
  assert.equal(frames, 1);
  stream.push('!');
  stream.flush();
  assert.ok(body.innerHTML.includes('Halo!'));
  assert.equal(frames, 2);
  stream.push('x');
  stream.cancel();
  assert.equal(rafFn, null);
});

test('createTokenStream escapes raw HTML when DOMPurify is not loaded', () => {
  globalThis.requestAnimationFrame = () => 1;
  const body = { innerHTML: '' };
  const stream = C.createTokenStream({ content: '<img src=x onerror=alert(1)>' }, { getBody: () => body });
  stream.flush();
  assert.ok(!body.innerHTML.includes('<img'));
});
