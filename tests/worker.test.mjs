// Unit dan integrasi ringan untuk raia-proxy/worker.js (Node >= 20, tanpa dependensi).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { buildRequest, parseReply, classifyUpstream, validate, toGeminiShape } from '../raia-proxy/worker.js';

const ORIGIN = 'https://hajir.is-a.dev';
const env = (extra = {}) => ({
  ALLOWED_ORIGINS: `${ORIGIN},http://localhost:8788`,
  RAIA_QUOTA: memoryKV(),
  ...extra
});

function memoryKV(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get: async (k) => (store.has(k) ? store.get(k) : null),
    put: async (k, v) => { store.set(k, v); }
  };
}

const validBody = (extra = {}) => ({
  model: 'gemini-2.5-flash-lite',
  contents: [{ role: 'user', parts: [{ text: 'halo' }] }],
  ...extra
});

const post = (body, headers = {}) => new Request('https://proxy.example/', {
  method: 'POST',
  headers: { Origin: ORIGIN, 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(body)
});

const withFetch = async (impl, fn) => {
  const original = globalThis.fetch;
  globalThis.fetch = impl;
  try { return await fn(); } finally { globalThis.fetch = original; }
};

// ─── validate ───
test('validate rejects unknown model', () => {
  assert.equal(validate(validBody({ model: 'gpt-x' })), 'Model tidak didukung.');
});

test('validate rejects non-boolean stream', () => {
  assert.equal(validate(validBody({ stream: 'yes' })), 'Format stream tidak valid.');
});

test('validate rejects too many messages and oversized text', () => {
  const many = Array.from({ length: 21 }, () => ({ role: 'user', parts: [{ text: 'a' }] }));
  assert.equal(validate(validBody({ contents: many })), 'Jumlah pesan tidak valid.');
  const big = [{ role: 'user', parts: [{ text: 'x'.repeat(12001) }] }];
  assert.equal(validate(validBody({ contents: big })), 'Pesan terlalu panjang.');
});

test('validate accepts a well-formed body', () => {
  assert.equal(validate(validBody()), null);
});

// ─── buildRequest ───
test('buildRequest clamps temperature and output tokens', () => {
  const up = buildRequest(validBody({ generationConfig: { temperature: 9, maxOutputTokens: 99999 } }));
  assert.equal(up.generationConfig.temperature, 2);
  assert.equal(up.generationConfig.maxOutputTokens, 1024);
});

test('buildRequest uses defaults when config is missing', () => {
  const up = buildRequest(validBody());
  assert.equal(up.generationConfig.temperature, 0.7);
  assert.equal(up.generationConfig.maxOutputTokens, 1024);
});

test('buildRequest keeps system instruction only when it has text, capped at 4000 chars', () => {
  assert.equal(buildRequest(validBody({ systemInstruction: { parts: [{ text: '' }] } })).systemInstruction, undefined);
  const long = 'S'.repeat(5000);
  const up = buildRequest(validBody({ systemInstruction: { parts: [{ text: long }] } }));
  assert.equal(up.systemInstruction.parts[0].text.length, 4000);
});

// ─── parseReply / toGeminiShape ───
test('parseReply joins text parts and defaults finishReason', () => {
  const r = parseReply({ candidates: [{ content: { parts: [{ text: 'a' }, { text: 'b' }] } }] });
  assert.deepEqual(r, { text: 'ab', finishReason: 'STOP' });
});

test('parseReply returns empty text for an empty body', () => {
  assert.equal(parseReply({}).text, '');
  assert.equal(parseReply(null).text, '');
});

test('toGeminiShape maps an OpenAI-style answer to Gemini shape', () => {
  const g = toGeminiShape({ choices: [{ message: { content: 'hai' }, finish_reason: 'stop' }] });
  assert.equal(parseReply(g).text, 'hai');
});

// ─── classifyUpstream ───
test('classifyUpstream maps statuses to codes', () => {
  assert.equal(classifyUpstream(429), 'quota');
  assert.equal(classifyUpstream(401), 'auth');
  assert.equal(classifyUpstream(403), 'auth');
  assert.equal(classifyUpstream(404), 'model_unavailable');
  assert.equal(classifyUpstream(500), 'server');
});

test('classifyUpstream reads 400 bodies for invalid key and quota', () => {
  assert.equal(classifyUpstream(400, '{"error":"API key not valid"}'), 'auth');
  assert.equal(classifyUpstream(400, 'RESOURCE_EXHAUSTED quota'), 'quota');
  assert.equal(classifyUpstream(400, 'bad field'), 'validation');
});

// ─── handler ───
test('handler rejects origins that are not allowed', async () => {
  const res = await worker.fetch(post(validBody(), { Origin: 'https://evil.example' }), env());
  assert.equal(res.status, 403);
});

test('handler answers preflight for an allowed origin with CORS headers', async () => {
  const req = new Request('https://proxy.example/', { method: 'OPTIONS', headers: { Origin: ORIGIN } });
  const res = await worker.fetch(req, env());
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.match(res.headers.get('Access-Control-Allow-Headers'), /X-Turnstile-Token/);
});

test('handler returns 400 for invalid JSON', async () => {
  const req = new Request('https://proxy.example/', { method: 'POST', headers: { Origin: ORIGIN }, body: '{oops' });
  assert.equal((await worker.fetch(req, env())).status, 400);
});

test('handler blocks when the daily quota is used up', async () => {
  const today = new Date().toISOString().slice(0, 10);
  const kv = memoryKV({ [`q:unknown:${today}`]: '10' });
  const res = await worker.fetch(post(validBody()), env({ RAIA_QUOTA: kv }));
  assert.equal(res.status, 429);
  assert.equal(res.headers.get('X-RateLimit-Remaining'), '0');
});

test('handler falls back to OpenRouter when Gemini has no key, and marks it as backup', async () => {
  const calls = [];
  const fakeFetch = async (url) => {
    calls.push(url);
    return new Response(JSON.stringify({ choices: [{ message: { content: 'dari backup' } }] }), { status: 200 });
  };
  const res = await withFetch(fakeFetch, () => worker.fetch(post(validBody()), env({ OPENROUTER_API_KEY: 'k' })));
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(parseReply(data).text, 'dari backup');
  assert.equal(data.raia.providerType, 'backup');
  assert.equal(data.raia.fallbackUsed, true);
  assert.ok(calls[0].includes('openrouter.ai'));
});

test('handler does not fall back when the client sends X-Raia-Fallback: off', async () => {
  const res = await withFetch(async () => new Response('{}', { status: 500 }),
    () => worker.fetch(post(validBody(), { 'X-Raia-Fallback': 'off' }), env({ OPENROUTER_API_KEY: 'k' })));
  assert.equal(res.status, 502);
});

test('handler rejects requests without a valid Turnstile token when the secret is set', async () => {
  const res = await withFetch(async () => new Response(JSON.stringify({ success: false }), { status: 200 }),
    () => worker.fetch(post(validBody()), env({ TURNSTILE_SECRET: 's', GEMINI_API_KEY: 'g' })));
  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.error.code, 'turnstile');
});
