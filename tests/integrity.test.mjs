// Pemeriksaan integritas statis:
//  1. Setiap id yang diambil lewat $('...') atau getElementById('...') ada di index.html.
//  2. Setiap t('...') dan data-i18n="..." punya terjemahan di blok id DAN en pada i18n.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const jsFiles = ['script.js', ...readdirSync(join(ROOT, 'js')).filter((f) => f.endsWith('.js')).map((f) => `js/${f}`)];
const html = read('index.html');

test('every element id referenced from JS exists in index.html', () => {
  const declared = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const missing = new Set();
  for (const f of jsFiles) {
    const src = read(f);
    for (const m of src.matchAll(/\$\('([^']+)'\)|getElementById\('([^']+)'\)/g)) {
      const id = m[1] || m[2];
      if (!declared.has(id)) missing.add(`${f}: ${id}`);
    }
  }
  assert.deepEqual([...missing], [], 'ids used in JS but absent from index.html');
});

// Mengambil nama kunci dari blok `id: {` atau `en: {` di dalam dict pada i18n.js
function keysOf(i18n, lang) {
  const lines = i18n.split('\n');
  const start = lines.findIndex((l) => l === `        ${lang}: {`);
  assert.ok(start >= 0, `blok "${lang}" tidak ditemukan di i18n.js`);
  const keys = new Set();
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i] === '        },') break;
    const m = lines[i].match(/^ {12}(\w+):/);
    if (m) keys.add(m[1]);
  }
  return keys;
}

const i18n = read('i18n.js');
const idKeys = keysOf(i18n, 'id');
const enKeys = keysOf(i18n, 'en');

test('i18n: the id and en blocks have the same keys', () => {
  const onlyId = [...idKeys].filter((k) => !enKeys.has(k));
  const onlyEn = [...enKeys].filter((k) => !idKeys.has(k));
  assert.deepEqual({ onlyId, onlyEn }, { onlyId: [], onlyEn: [] });
});

test('i18n: every t("...") key used in JS exists in both languages', () => {
  const used = new Set();
  for (const f of jsFiles) {
    for (const m of read(f).matchAll(/\bt\(\s*'([A-Za-z0-9_]+)'/g)) used.add(m[1]);
  }
  const missing = [...used].filter((k) => !idKeys.has(k) || !enKeys.has(k));
  assert.deepEqual(missing, []);
});

test('i18n: every data-i18n key in index.html exists in both languages', () => {
  const used = new Set([...html.matchAll(/data-i18n(?:-\w+)?="([A-Za-z0-9_]+)"/g)].map((m) => m[1]));
  const missing = [...used].filter((k) => !idKeys.has(k) || !enKeys.has(k));
  assert.deepEqual(missing, []);
});
