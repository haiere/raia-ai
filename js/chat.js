/* ═══════════════════════════════════════════════════════
   RAIA · Reflecting Tomorrow · v1.2.6
   js/chat.js: render Markdown dan LaTeX, serta penulisan
   token stream ke bubble jawaban. Tanpa state global.
   ═══════════════════════════════════════════════════════ */

'use strict';

import { t } from './settings.js';

export function escapeHtml(value) {
    return String(value).replace(/[&<>\"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

export function codeBlockHtml(lang, code) {
    const safeLang = (lang || '').replace(/[^\w+#.-]/g, '').slice(0, 24);
    return (
        '<div class="code-block">' +
        '<div class="code-head">' +
        `<span>${escapeHtml(safeLang || 'text')}</span>` +
        `<button class="code-copy" type="button" data-copy-code>${escapeHtml(t('copyCode'))}</button>` +
        '</div>' +
        `<pre><code class="language-${escapeHtml(safeLang)}">${escapeHtml(code)}</code></pre>` +
        '</div>'
    );
}

export function katexHtml(tex, display) {
    const source = tex.trim();
    if (window.katex && typeof window.katex.renderToString === 'function') {
        try {
            return window.katex.renderToString(source, {
                displayMode: display,
                throwOnError: false,
                strict: 'ignore'
            });
        } catch (_) { /* fall back to raw text below */ }
    }
    return display
        ? `<pre class="math-raw">${escapeHtml(source)}</pre>`
        : `<code>${escapeHtml(source)}</code>`;
}

export function renderMarkdown(source) {
    const raw = String(source).replace(/\r\n?/g, '\n');
    const stash = [];
    const hold = (html) => {
        stash.push(html);
        return `RAIAHOLD${stash.length - 1}END`;
    };

    let text = raw;

    /* 1. Protect code first so its contents are never treated as math or Markdown */
    text = text.replace(/```([^\n`]*)\n([\s\S]*?)\n?```/g, (_, lang, code) => hold(codeBlockHtml(lang.trim(), code)));
    text = text.replace(/`([^`\n]+)`/g, (_, code) => hold(`<code>${escapeHtml(code)}</code>`));

    /* 2. Protect math: display first, then inline */
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => hold(katexHtml(tex, true)));
    text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => hold(katexHtml(tex, true)));
    text = text.replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => hold(katexHtml(tex, false)));
    text = text.replace(/(^|[^\\\w$])\$(?=\S)([^$\n]*?\S)\$(?![\w$])/g, (_, pre, tex) => pre + hold(katexHtml(tex, false)));

    /* 3. Markdown */
    let html;
    if (window.marked && typeof window.marked.parse === 'function') {
        html = window.marked.parse(text, { gfm: true, breaks: true });
    } else {
        html = `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`;
    }

    /* 4. Restore protected blocks */
    html = html.replace(/<p>\s*RAIAHOLD(\d+)END\s*<\/p>/g, (_, i) => stash[Number(i)]);
    html = html.replace(/RAIAHOLD(\d+)END/g, (_, i) => stash[Number(i)]);

    /* Tables scroll sideways inside their own box, so cells keep their width */
    html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');

    /* 5. Sanitize everything that reaches the DOM */
    if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
        return window.DOMPurify.sanitize(html);
    }
    return `<p>${escapeHtml(raw).replace(/\n/g, '<br>')}</p>`;
}


/* ═══════════════════════════════════════
   TOKEN STREAM
   Teks dari stream ditambahkan ke message.content, lalu dirender ulang
   paling banyak sekali per frame. Render tidak dibatasi per paragraf.
   ═══════════════════════════════════════ */
export function createTokenStream(message, { getBody, onFrame } = {}) {
    let frame = 0;

    const paint = () => {
        frame = 0;
        const body = getBody ? getBody() : null;
        if (!body) return;
        body.innerHTML = renderMarkdown(message.content);
        if (onFrame) onFrame(body);
    };

    return {
        push(text) {
            message.content += text;
            if (!frame) frame = requestAnimationFrame(paint);
        },
        flush() {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
            paint();
        },
        cancel() {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        }
    };
}
