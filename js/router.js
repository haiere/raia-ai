/* ═══════════════════════════════════════════════════════
   RAIA · Reflecting Tomorrow · v1.2.6
   js/router.js: rute /chat dan /setting dengan History API.
   Base path dihitung dari lokasi modul ini, jadi aplikasi tetap
   jalan kalau dipasang di subfolder (misalnya /raia-ai/).
   ═══════════════════════════════════════════════════════ */

'use strict';

const ROUTES = ['chat', 'setting'];
const BASE = new URL('../', import.meta.url).pathname;

export function baseHref() {
    return BASE;
}

export function routeUrl(route) {
    return BASE + route;
}

/* Rute dari path. Path yang tidak dikenal dianggap /chat. */
export function currentRoute(pathname = window.location.pathname) {
    let path = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
    path = path.replace(/\/+$/, '');
    return path === 'setting' ? 'setting' : 'chat';
}

export function navigate(route, { replace = false } = {}) {
    if (!ROUTES.includes(route)) return;
    const url = routeUrl(route);
    if (window.location.pathname === url) return;
    try {
        if (replace) window.history.replaceState({ route }, '', url);
        else window.history.pushState({ route }, '', url);
    } catch (_) {
        /* file:// atau konteks terbatas: URL dibiarkan apa adanya */
    }
}

export function onRouteChange(handler) {
    window.addEventListener('popstate', () => handler(currentRoute()));
}

/* Mengubah tautan hash lama (#/chat, #/setting) menjadi path. Mengembalikan true jika ada yang diubah. */
export function migrateHashRoute() {
    const match = window.location.hash.match(/^#\/(chat|setting)$/);
    if (!match) return false;
    navigate(match[1], { replace: true });
    return true;
}
