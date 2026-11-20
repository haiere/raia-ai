/* ═══════════════════════════════════════════════════════
   RAIA · Reflecting Tomorrow · v1.2.6
   js/ui.js: interaksi DOM yang tidak tahu soal chat atau
   provider: slider, focus trap, dan deteksi keyboard mobile.
   ═══════════════════════════════════════════════════════ */

'use strict';

export function guardSlider(input) {
    if (!input) return;
    const THUMB = 26;
    const thumbX = () => {
        const rect = input.getBoundingClientRect();
        const min = Number(input.min);
        const max = Number(input.max);
        const ratio = (Number(input.value) - min) / ((max - min) || 1);
        return { x: rect.left + THUMB / 2 + ratio * (rect.width - THUMB), reach: THUMB / 2 + 14 };
    };
    const begin = (clientX) => {
        const { x, reach } = thumbX();
        const onThumb = Math.abs(clientX - x) <= reach;
        input.dataset.snap = input.value;
        input.dataset.blocked = onThumb ? '' : '1';
        input.classList.toggle('is-dragging', onThumb);
        return onThumb;
    };
    const end = () => {
        input.classList.remove('is-dragging');
        delete input.dataset.blocked;
    };
    input.addEventListener('pointerdown', (e) => {
        if (!begin(e.clientX)) e.preventDefault();
    });
    input.addEventListener('touchstart', (e) => {
        if (!begin(e.touches[0].clientX)) e.preventDefault();
    }, { passive: false });
    ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach((name) => input.addEventListener(name, end));
    input.addEventListener('input', (e) => {
        if (input.dataset.blocked === '1' && input.dataset.snap !== undefined) {
            input.value = input.dataset.snap;
            e.stopImmediatePropagation();
        }
    });
}

/* ═══════════════════════════════════════
   SLIDER
   Progress fill: bagian yang sudah terisi diwarnai lewat variabel --fill.
   Angka yang diketik manual dibatasi ke rentang slider lalu dibulatkan.
   ═══════════════════════════════════════ */
export function paintRangeFill(input) {
    if (!input) return;
    const min = Number(input.min);
    const max = Number(input.max);
    const pct = ((Number(input.value) - min) / ((max - min) || 1)) * 100;
    input.style.setProperty('--fill', `${Math.min(100, Math.max(0, pct)).toFixed(2)}%`);
}

export function normalizeRangeValue(input, raw, decimals = 0) {
    const n = Number(String(raw).trim().replace(',', '.'));
    if (!Number.isFinite(n)) return Number(input.value);
    const min = Number(input.min);
    const max = Number(input.max);
    const clamped = Math.min(max, Math.max(min, n));
    return Number(clamped.toFixed(decimals));
}

export function bindRangeNumber(range, numInput, decimals, apply) {
    if (!range || !numInput) return;
    const commit = () => {
        const value = normalizeRangeValue(range, numInput.value, decimals);
        range.value = String(value);
        paintRangeFill(range);
        apply(Number(range.value));
    };
    numInput.addEventListener('change', commit);
    numInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commit();
            numInput.blur();
        }
    });
}

/* ═══════════════════════════════════════
   FOCUS TRAP
   Tab tidak keluar dari panel yang sedang terbuka (setting, drawer, sheet).
   ═══════════════════════════════════════ */
const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(',');

export function createFocusTrap(container) {
    let active = false;

    const onKeydown = (e) => {
        if (e.key !== 'Tab' || !container) return;
        const items = Array.from(container.querySelectorAll(FOCUSABLE))
            .filter((el) => el.offsetParent !== null);
        if (!items.length) {
            e.preventDefault();
            return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const current = document.activeElement;
        const inside = container.contains(current);

        if (e.shiftKey && (!inside || current === first)) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && (!inside || current === last)) {
            e.preventDefault();
            first.focus();
        }
    };

    return {
        activate() {
            if (active) return;
            active = true;
            document.addEventListener('keydown', onKeydown, true);
        },
        deactivate() {
            if (!active) return;
            active = false;
            document.removeEventListener('keydown', onKeydown, true);
        }
    };
}

/* ═══════════════════════════════════════
   KEYBOARD MOBILE
   Saat keyboard terbuka, class kbd-open dipasang pada <html>.
   Hanya berlaku untuk perangkat dengan pointer kasar (sentuh).
   ═══════════════════════════════════════ */
export function watchKeyboard() {
    const vv = window.visualViewport;
    if (!vv || !window.matchMedia('(pointer: coarse)').matches) return;
    const root = document.documentElement;
    const update = () => {
        const open = window.innerHeight - vv.height > 150;
        root.classList.toggle('kbd-open', open);
    };
    vv.addEventListener('resize', update);
    update();
}
