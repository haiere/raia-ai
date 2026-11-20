/* ═══════════════════════════════════════════════════════
   RAIA · Reflecting Tomorrow · v1.2.6
   script.js: orkestrasi UI. Logika provider, settings,
   chat, dan UI ada di js/.
   ═══════════════════════════════════════════════════════ */

import {
  APP_VERSION, CONTEXT_LIMIT, CUSTOM_COMPAT, CUSTOM_PREFIX, DEFAULT_PROVIDER, KEY_STORE, MAX_SESSIONS, PROVIDERS, REQUEST_TIMEOUT_MS, SETTINGS_KEY, TEST_TIMEOUT_MS, THEME_KEY, findCustom, getProviderInfo, hasKey, loadCatalog, loadCustomProviders, loadSessions, loadSettings, modelsFor, persistCatalog, persistCustomProviders, persistSessions, persistSettings, removeCustomKey, resolveKey, state, storeCustomKey, t, tx, uid, usesFreeProxy
} from './js/settings.js';

import {
  ApiError, applyProxy, buildMeta, buildRequest, describeError, listRequest, normalizeModels, parseReply, readError, streamFreeProxy
} from './js/provider.js';

import {
  createTokenStream, renderMarkdown
} from './js/chat.js';

import {
  bindRangeNumber, createFocusTrap, guardSlider, paintRangeFill, watchKeyboard
} from './js/ui.js';

import { currentRoute, migrateHashRoute, navigate, onRouteChange } from './js/router.js';

(function () {
    'use strict';


    /* ─── Helpers ─── */
    const $ = (id) => document.getElementById(id);
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Translation with a fallback, for strings not yet added to i18n.js */

    function on(el, event, handler) {
        if (el) el.addEventListener(event, handler);
    }


    function formatDate(ts) {
        const locale = window.I18N.getLang() === 'en' ? 'en-US' : 'id-ID';
        try {
            return new Date(ts).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        } catch (_) {
            return '';
        }
    }

    /* ═══════════════════════════════════════
       MOTION (GSAP)
       Only transform and opacity are animated.
       Forms, navigation, and the send button are never animated.
       ═══════════════════════════════════════ */
    const motion = {
        get enabled() {
            return Boolean(window.gsap) && !prefersReducedMotion();
        }
    };

    function animateWelcome() {
        if (!motion.enabled) return;
        gsap.killTweensOf(['#welcomeTitle', '.welcome-desc', '.chip']);
        gsap.timeline({ defaults: { ease: 'power2.out' } })
            .from('#welcomeTitle', { opacity: 0, y: 14, duration: 0.5 })
            .from('.welcome-desc', { opacity: 0, y: 10, duration: 0.45 }, '-=0.3')
            .from('.chip', { opacity: 0, y: 8, duration: 0.35, stagger: 0.06, clearProps: 'transform,opacity' }, '-=0.25');
    }

    function animateNewMessage() {
        const node = els.messages.querySelector('.msg.is-new');
        if (!node || !motion.enabled) return;
        if (node.classList.contains('msg-assistant')) return;
        gsap.from(node, { opacity: 0, y: 10, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' });
    }

    function animateSettings() {
        if (!motion.enabled) return;
        gsap.killTweensOf('.settings-inner .card');
        gsap.from('.settings-head', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity' });
        gsap.from('.settings-inner .card', {
            opacity: 0, y: 12, duration: 0.4, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity'
        });
    }

    function animateHistory() {
        if (!motion.enabled) return;
        gsap.from('.history-item', {
            opacity: 0, x: 14, duration: 0.3, stagger: 0.035, ease: 'power2.out', clearProps: 'transform,opacity'
        });
    }

    function animateToast(node) {
        if (!motion.enabled) return;
        gsap.from(node, { opacity: 0, y: 10, duration: 0.25, ease: 'power2.out', clearProps: 'transform,opacity' });
    }

    function bindChipHover() {
        els.chips.querySelectorAll('.chip').forEach((chip) => {
            chip.addEventListener('pointerenter', () => {
                if (motion.enabled) gsap.to(chip, { y: -2, duration: 0.2, ease: 'power1.out' });
            });
            chip.addEventListener('pointerleave', () => {
                if (motion.enabled) gsap.to(chip, { y: 0, duration: 0.2, ease: 'power1.out' });
            });
        });
    }

    /* ─── DOM references ─── */
    const els = {
        html: document.documentElement,
        themeToggle: $('themeToggle'),
        themeIcon: $('themeIcon'),
        historyBtn: $('historyBtn'),
        newChatBtn: $('newChatBtn'),
        navSetting: $('navSetting'),
        chatView: $('chat'),
        settingView: $('setting'),
        settingsOverlay: $('settingsOverlay'),
        settingsClose: $('settingsClose'),
        backToChat: $('backToChat'),
        chatScroll: $('chatScroll'),
        messages: $('messages'),
        welcome: $('welcome'),
        chips: $('chips'),
        noKey: $('noKeyNotice'),
        jumpBtn: $('jumpBtn'),
        jumpDot: $('jumpDot'),
        modelPickerBtn: $('modelPickerBtn'),
        modelSheet: $('modelSheet'),
        modelSheetOverlay: $('modelSheetOverlay'),
        modelSheetList: $('modelSheetList'),
        modelSheetClose: $('modelSheetClose'),
        modelSheetGrip: $('modelSheetGrip'),
        composer: $('composer'),
        prompt: $('prompt'),
        sendBtn: $('sendBtn'),
        sendIcon: $('sendIcon'),
        charCount: $('charCount'),
        quotaNote: $('quotaNote'),
        quotaText: $('quotaText'),
        quotaBtn: $('quotaBtn'),
        activeModel: $('activeModel'),
        providerSelect: $('providerSelect'),
        modelInput: $('modelInput'),
        modelSelect: $('modelSelect'),
        modelList: $('modelList'),
        modelBadge: $('modelBadge'),
        loadModelsBtn: $('loadModelsBtn'),
        apiKeyInput: $('apiKeyInput'),
        toggleKeyBtn: $('toggleKeyBtn'),
        eyeIcon: $('eyeIcon'),
        keyLink: $('keyLink'),
        rememberKey: $('rememberKey'),
        connectBtn: $('connectBtn'),
        testBtn: $('testBtn'),
        statusBadge: $('statusBadge'),
        statusText: $('statusText'),
        langSelect: $('langSelect'),
        baseUrlInput: $('baseUrlInput'),
        proxyInput: $('proxyInput'),
        tempRange: $('tempRange'),
        tempValue: $('tempValue'),
        tokRange: $('tokRange'),
        tokValue: $('tokValue'),
        tempNum: $('tempNum'),
        tokNum: $('tokNum'),
        customTitle: $('customTitle'),
        customLabel: $('customLabel'),
        customBaseUrl: $('customBaseUrl'),
        customCompat: $('customCompat'),
        customModel: $('customModel'),
        customApiKey: $('customApiKey'),
        customSaveBtn: $('customSaveBtn'),
        customCancelBtn: $('customCancelBtn'),
        customList: $('customList'),
        resetBtn: $('resetBtn'),
        drawer: $('drawer'),
        drawerOverlay: $('drawerOverlay'),
        drawerClose: $('drawerClose'),
        historyList: $('historyList'),
        historyEmpty: $('historyEmpty'),
        clearAllBtn: $('clearAllBtn'),
        toasts: $('toasts')
    };


    let controller = null;
    const settingsTrap = createFocusTrap(els.settingView);
    const drawerTrap = createFocusTrap(els.drawer);
    const sheetTrap = createFocusTrap(els.modelSheet);



    function saveCurrentSession() {
        if (!state.messages.length) return;
        if (!state.sessionId) state.sessionId = uid();
        const first = state.messages.find((m) => m.role === 'user');
        const title = first ? first.content.replace(/\s+/g, ' ').trim().slice(0, 60) : '';
        const session = {
            id: state.sessionId,
            title: title || t('untitled'),
            updatedAt: Date.now(),
            messages: state.messages.slice(-100)
        };
        state.sessions = [session, ...state.sessions.filter((s) => s.id !== state.sessionId)].slice(0, MAX_SESSIONS);
        persistSessions();
    }

    /* ═══════════════════════════════════════
       THEME AND TOASTS
       ═══════════════════════════════════════ */
    function applyTheme(theme) {
        els.html.dataset.theme = theme;
        const use = els.themeIcon.querySelector('use');
        if (use) use.setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
    }

    function toggleTheme() {
        const next = els.html.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (_) { /* ignore */ }
    }

    const TOAST_ICON = { success: '#i-check', error: '#i-alert', info: '#i-info' };

    function toast(message, type) {
        const kind = TOAST_ICON[type] ? type : 'info';
        const node = document.createElement('div');
        node.className = `toast toast-${kind}`;
        node.innerHTML = `<svg class="icon icon-sm" aria-hidden="true"><use href="${TOAST_ICON[kind]}"/></svg><span></span>`;
        node.querySelector('span').textContent = message;
        els.toasts.appendChild(node);
        animateToast(node);
        while (els.toasts.children.length > 3) els.toasts.firstElementChild.remove();
        setTimeout(() => node.remove(), 3200);
    }

    /* ═══════════════════════════════════════
       MARKDOWN, MATH AND CODE RENDERING
       ═══════════════════════════════════════ */
    /* ═══════════════════════════════════════
       MESSAGES
       ═══════════════════════════════════════ */
    function isNearBottom() {
        const el = els.chatScroll;
        return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    }

    function scrollToBottom(smooth) {
        requestAnimationFrame(() => {
            els.chatScroll.scrollTo({
                top: els.chatScroll.scrollHeight,
                behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto'
            });
        });
    }

    function updateJumpButton() {
        if (isNearBottom()) state.unseen = 0;
        els.jumpBtn.hidden = state.messages.length === 0 || isNearBottom();
        if (els.jumpDot) els.jumpDot.hidden = state.unseen === 0;
    }

    function makeAction(label, icon, attr) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'msg-action';
        button.setAttribute(attr, '');
        button.innerHTML = `<svg class="icon icon-sm" aria-hidden="true"><use href="${icon}"/></svg>`;
        const span = document.createElement('span');
        span.textContent = label;
        button.appendChild(span);
        return button;
    }

    /* Provider line shown under an assistant message, from the response metadata */
    function metaLine(meta) {
        const name = meta.providerType === 'backup'
            ? `${meta.provider} — ${tx('providerBackup', 'Backup')}`
            : meta.provider;
        let line = `${tx('providerLabel', 'Provider')}: ${name}`;
        if (meta.model && meta.requested && meta.model !== meta.requested) line += ` · ${meta.model}`;
        return line;
    }

    /* A new reply fades in paragraph by paragraph, instead of appearing all at once */
    function revealParagraphs(body) {
        Array.from(body.children).forEach((node, i) => {
            node.classList.add('msg-reveal');
            node.style.setProperty('--reveal-delay', `${Math.min(i, 12) * 90}ms`);
        });
    }

    function buildMessage(m, isNew, isLast) {
        const article = document.createElement('article');
        article.className = `msg msg-${m.role}${m.error ? ' msg-error' : ''}${isNew ? ' is-new' : ''}`;
        article.dataset.id = m.id;

        if (m.error) {
            const box = document.createElement('div');
            box.className = 'notice notice-error';
            box.setAttribute('role', 'alert');
            box.innerHTML =
                '<svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg>' +
                '<div class="notice-body"><p class="notice-title"></p><p class="notice-text"></p></div>';
            box.querySelector('.notice-title').textContent = m.title || t('errGenericTitle');
            box.querySelector('.notice-text').textContent = m.body || '';
            if (m.action) {
                const cta = document.createElement('button');
                cta.type = 'button';
                cta.className = 'msg-action msg-action-cta';
                cta.setAttribute('data-goto-setting', '');
                cta.textContent = m.action.label;
                box.querySelector('.notice-body').appendChild(cta);
            }
            article.appendChild(box);
        } else if (m.role === 'user') {
            const body = document.createElement('div');
            body.className = 'msg-body';
            body.textContent = m.content;
            article.appendChild(body);
        } else {
            const meta = document.createElement('div');
            meta.className = 'msg-meta';
            meta.textContent = t('assistant');
            const body = document.createElement('div');
            body.className = 'msg-body';
            body.innerHTML = renderMarkdown(m.content);
            article.append(meta, body);
            if (isNew) revealParagraphs(body);
            if (m.meta) {
                const provider = document.createElement('div');
                provider.className = `msg-provider${m.meta.providerType === 'backup' ? ' is-backup' : ''}`;
                provider.textContent = metaLine(m.meta);
                article.appendChild(provider);
            }
        }

        const actions = [];
        if (!m.error && m.role === 'assistant') {
            actions.push(makeAction(t('copy'), '#i-copy', 'data-copy-msg'));
        }
        if (isLast && (m.error || m.role === 'assistant')) {
            actions.push(makeAction(t('regenerate'), '#i-refresh', 'data-retry'));
        }
        if (actions.length) {
            const row = document.createElement('div');
            row.className = 'msg-actions';
            row.append(...actions);
            article.appendChild(row);
        }

        return article;
    }

    function showTyping() {
        if (els.messages.querySelector('.typing-row')) return;
        const row = document.createElement('div');
        row.className = 'msg msg-assistant typing-row';
        row.innerHTML =
            '<div class="typing">' +
            '<span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>' +
            '<span class="typing-label"></span>' +
            '</div>';
        row.querySelector('.typing-label').textContent = `${t('typing')}...`;
        els.messages.appendChild(row);
    }

    function hideTyping() {
        const row = els.messages.querySelector('.typing-row');
        if (row) row.remove();
    }

    function renderAll(opts) {
        const options = opts || {};
        const stick = options.stick || isNearBottom();
        const fragment = document.createDocumentFragment();
        const lastIndex = state.messages.length - 1;

        state.messages.forEach((m, index) => {
            fragment.appendChild(buildMessage(m, m.id === options.newId, index === lastIndex));
        });

        els.messages.replaceChildren(fragment);
        if (state.loading && !state.streamingId) showTyping();

        const wasWelcomeHidden = els.welcome.hidden;
        els.welcome.hidden = state.messages.length > 0;
        if (wasWelcomeHidden && els.welcome.hidden === false) animateWelcome();
        updateNoKeyNotice();
        if (stick) {
            state.unseen = 0;
            scrollToBottom(Boolean(options.newId));
        } else if (options.newId) {
            state.unseen += 1;
        }
        if (options.newId) animateNewMessage();
        updateJumpButton();
    }

    function pushMessage(role, content, extra) {
        const message = Object.assign({ id: uid(), role, content, ts: Date.now() }, extra || {});
        state.messages.push(message);
        saveCurrentSession();
        /* Only the user's own message forces a scroll. A reply scrolls only if the user is already at the bottom */
        renderAll({ newId: message.id, stick: role === 'user' });
        return message;
    }

    function pushError(info) {
        if (!info) return;
        pushMessage('assistant', '', {
            error: true,
            title: info.title,
            body: info.body,
            action: info.action || null
        });
    }

    /* ═══════════════════════════════════════
       QUOTA (free Gemini proxy)
       Read from X-RateLimit-* headers. Never shown when the headers are missing or invalid.
       ═══════════════════════════════════════ */


    function updateQuotaNote() {
        if (!els.quotaNote) return;
        const show = usesFreeProxy(state.provider, state.apiKey) && Boolean(state.quota);
        els.quotaNote.hidden = !show;
        if (!show) return;
        const left = state.quota.remaining;
        if (els.quotaText) {
            els.quotaText.textContent = left > 0
                ? tx('quotaLeft', 'Sisa {n} pesan gratis hari ini', { n: left })
                : tx('quotaEmpty', 'Kuota gratis hari ini habis');
        }
    }

    /* ═══════════════════════════════════════
       PROVIDER REQUESTS
       ═══════════════════════════════════════ */


    function currentConfig() {
        return {
            provider: state.provider,
            model: state.model,
            apiKey: resolveKey(state.provider),
            baseUrl: state.baseUrl,
            proxyUrl: state.proxyUrl,
            temp: state.temp,
            maxTokens: state.maxTokens
        };
    }

    /* ═══════════════════════════════════════
       SEND, STOP AND RETRY
       ═══════════════════════════════════════ */
    function syncSendButton() {
        const busy = state.loading;
        const empty = els.prompt.value.trim().length === 0;
        els.sendBtn.dataset.mode = busy ? 'stop' : 'send';
        /* aria-disabled only changes the look. The button always responds, so it never feels stuck */
        els.sendBtn.setAttribute('aria-disabled', String(!busy && empty));
        els.sendBtn.setAttribute('aria-label', busy ? t('stopLabel') : t('sendLabel'));
        const use = els.sendIcon.querySelector('use');
        if (use) use.setAttribute('href', busy ? '#i-stop' : '#i-send');
    }

    function setLoading(on) {
        state.loading = on;
        if (on) showTyping();
        else hideTyping();
        syncSendButton();
    }

    function stopGeneration() {
        if (controller) controller.abort();
    }

    async function ask() {
        const cfg = currentConfig();
        const history = state.messages
            .filter((m) => !m.error && m.content)
            .slice(-CONTEXT_LIMIT)
            .map((m) => ({ role: m.role, content: m.content }));

        const ctrl = new AbortController();
        controller = ctrl;
        setLoading(true);
        try {
            if (usesFreeProxy(cfg.provider, cfg.apiKey)) await askStreaming(cfg, history, ctrl);
            else await askOnce(cfg, history, ctrl);
        } finally {
            if (controller === ctrl) controller = null;
            setLoading(false);
        }
    }

    /* Non-stream request, for providers that the browser calls directly */
    async function askOnce(cfg, history, ctrl) {
        let timedOut = false;
        const timer = setTimeout(() => {
            timedOut = true;
            ctrl.abort();
        }, REQUEST_TIMEOUT_MS);
        try {
            const req = buildRequest(cfg, history);
            const resp = await fetch(req.url, {
                method: 'POST',
                headers: req.headers,
                body: req.body,
                signal: ctrl.signal
            });
            if (!resp.ok) {
                const info = await readError(resp);
                throw new ApiError(resp.status, info.message, info.code);
            }
            const data = await resp.json();
            const reply = parseReply(cfg.provider, data).trim();
            pushMessage('assistant', reply || t('emptyReply'), { meta: buildMeta(cfg, data) });
        } catch (err) {
            if (err.name === 'AbortError') {
                if (timedOut) pushError({ title: t('errNetTitle'), body: t('errTimeoutBody') });
                else toast(t('toastStopped'), 'info');
            } else {
                pushError(describeError(err, cfg.provider));
            }
        } finally {
            clearTimeout(timer);
        }
    }

    /* Free proxy: tokens are rendered while they arrive. The timeout is idle-based, reset on every chunk,
       so a long answer is not cut off just because the whole reply takes more than REQUEST_TIMEOUT_MS. */
    async function askStreaming(cfg, history, ctrl) {
        let timedOut = false;
        let meta = null;
        let idle = 0;
        const arm = () => {
            clearTimeout(idle);
            idle = setTimeout(() => {
                timedOut = true;
                ctrl.abort();
            }, REQUEST_TIMEOUT_MS);
        };

        const message = pushMessage('assistant', '', { streaming: true });
        const isCurrent = () => state.messages.includes(message);
        state.streamingId = message.id;
        hideTyping();
        els.messages.setAttribute('aria-busy', 'true');

        const bodyOf = () => els.messages.querySelector(`[data-id="${message.id}"] .msg-body`);
        const stream = createTokenStream(message, {
            getBody: bodyOf,
            onFrame: (body) => {
                body.classList.add('is-streaming');
                if (isNearBottom()) scrollToBottom(false);
                updateJumpButton();
            }
        });
        arm();

        try {
            await streamFreeProxy(cfg, history, {
                signal: ctrl.signal,
                onQuota: (quota) => {
                    state.quota = quota;
                    updateQuotaNote();
                },
                onMeta: (raia) => {
                    meta = buildMeta(cfg, { raia });
                },
                onText: (text) => {
                    arm();
                    stream.push(text);
                }
            });
            stream.flush();
            message.content = message.content.trim() || t('emptyReply');
            delete message.streaming;
            if (meta) message.meta = meta;
            if (isCurrent()) {
                saveCurrentSession();
                renderAll();
            }
        } catch (err) {
            stream.cancel();
            const current = isCurrent();
            const partial = message.content.trim();
            if (partial) {
                /* Keep what has already arrived */
                message.content = partial;
                delete message.streaming;
                if (meta) message.meta = meta;
            } else if (current) {
                state.messages = state.messages.filter((m) => m !== message);
            }
            /* The user may have switched chats meanwhile; then the active session must not be touched */
            if (current) {
                saveCurrentSession();
                renderAll();
                if (err.name === 'AbortError') {
                    if (timedOut) pushError({ title: t('errNetTitle'), body: t('errTimeoutBody') });
                    else toast(t('toastStopped'), 'info');
                } else {
                    pushError(describeError(err, cfg.provider));
                }
            }
        } finally {
            clearTimeout(idle);
            state.streamingId = null;
            els.messages.removeAttribute('aria-busy');
        }
    }

    function submitPrompt() {
        const text = els.prompt.value.trim();

        if (!text) {
            toast(t('toastEmpty'), 'info');
            els.prompt.focus();
            return;
        }

        if (!hasKey()) {
            toast(t('toastNoKey'), 'error');
            els.noKey.hidden = false;
            return;
        }

        els.prompt.value = '';
        resizePrompt();
        updateCharCount();
        pushMessage('user', text);
        ask();
    }

    function onFormSubmit(event) {
        event.preventDefault();
        if (state.loading) {
            stopGeneration();
            return;
        }
        submitPrompt();
    }

    function requestSubmit() {
        if (typeof els.composer.requestSubmit === 'function') {
            els.composer.requestSubmit();
        } else {
            els.composer.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    }

    function retryLast() {
        if (state.loading) return;
        while (state.messages.length && state.messages[state.messages.length - 1].role !== 'user') {
            state.messages.pop();
        }
        if (!state.messages.length) return;
        saveCurrentSession();
        renderAll({ stick: true });
        ask();
    }

    function startNewChat() {
        if (controller) controller.abort();
        state.messages = [];
        state.sessionId = null;
        renderAll();
    }

    /* Opens settings and puts focus on the key field (or the custom form when a custom provider is active) */
    function goToKeySettings() {
        openSettings();
        const target = findCustom(state.provider) ? els.customBaseUrl : els.apiKeyInput;
        if (target && !target.disabled) setTimeout(() => target.focus(), 60);
    }

    /* ═══════════════════════════════════════
       COMPOSER
       ═══════════════════════════════════════ */
    function resizePrompt() {
        els.prompt.style.height = 'auto';
        els.prompt.style.height = `${Math.min(els.prompt.scrollHeight, 180)}px`;
    }

    function updateCharCount() {
        els.charCount.textContent = t('charCount', { n: els.prompt.value.length });
    }

    function updateNoKeyNotice() {
        els.noKey.hidden = hasKey();
        updateQuotaNote();
    }

    /* ═══════════════════════════════════════
       CLIPBOARD
       ═══════════════════════════════════════ */
    async function copyText(text) {
        try {
            if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
            await navigator.clipboard.writeText(text);
            toast(t('toastCopied'), 'success');
        } catch (_) {
            const area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (_e) { ok = false; }
            area.remove();
            toast(ok ? t('toastCopied') : t('toastCopyFailed'), ok ? 'success' : 'error');
        }
    }

    /* ═══════════════════════════════════════
       HISTORY DRAWER
       ═══════════════════════════════════════ */
    function renderHistory() {
        const list = state.sessions;
        els.historyList.replaceChildren();
        els.historyEmpty.hidden = list.length > 0;
        els.clearAllBtn.disabled = list.length === 0;

        list.forEach((s) => {
            const item = document.createElement('li');
            item.className = `history-item${s.id === state.sessionId ? ' active' : ''}`;

            const open = document.createElement('button');
            open.type = 'button';
            open.className = 'history-open';
            open.dataset.openSession = s.id;

            const title = document.createElement('span');
            title.className = 'history-title';
            title.textContent = s.title || t('untitled');

            const date = document.createElement('span');
            date.className = 'history-date';
            date.textContent = formatDate(s.updatedAt);

            open.append(title, date);

            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'icon-btn';
            del.dataset.deleteSession = s.id;
            del.setAttribute('aria-label', t('deleteChat'));
            del.innerHTML = '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-trash"/></svg>';

            item.append(open, del);
            els.historyList.appendChild(item);
        });
    }

    function openDrawer() {
        renderHistory();
        animateHistory();
        els.drawer.classList.add('open');
        els.drawer.setAttribute('aria-hidden', 'false');
        els.drawerOverlay.classList.add('open');
        els.historyBtn.setAttribute('aria-expanded', 'true');
        drawerTrap.activate();
        els.drawerClose.focus();
    }

    function closeDrawer() {
        if (!els.drawer.classList.contains('open')) return;
        drawerTrap.deactivate();
        els.drawer.classList.remove('open');
        els.drawer.setAttribute('aria-hidden', 'true');
        els.drawerOverlay.classList.remove('open');
        els.historyBtn.setAttribute('aria-expanded', 'false');
        els.historyBtn.focus();
    }

    function openSession(id) {
        const session = state.sessions.find((s) => s.id === id);
        if (!session) return;
        if (controller) controller.abort();
        state.sessionId = session.id;
        state.messages = session.messages.slice();
        closeDrawer();
        closeSettings();
        renderAll({ stick: true });
    }

    function deleteSession(id) {
        state.sessions = state.sessions.filter((s) => s.id !== id);
        persistSessions();
        if (state.sessionId === id) startNewChat();
        renderHistory();
        toast(t('toastDeleted'), 'success');
    }

    function clearAllHistory() {
        if (!window.confirm(t('confirmClearAll'))) return;
        state.sessions = [];
        persistSessions();
        startNewChat();
        renderHistory();
        toast(t('toastDeleted'), 'success');
    }

    /* ═══════════════════════════════════════
       SETTINGS FORM
       ═══════════════════════════════════════ */
    function option(value, text) {
        const node = document.createElement('option');
        node.value = value;
        node.textContent = text;
        return node;
    }

    function rebuildProviderOptions() {
        if (!els.providerSelect) return;
        const options = Object.keys(PROVIDERS).map((key) => option(key, PROVIDERS[key].label));
        state.custom.forEach((c) => options.push(option(CUSTOM_PREFIX + c.id, `${c.label} (Custom)`)));
        els.providerSelect.replaceChildren(...options);
    }

    /* The shared key field belongs to built-in providers. Custom providers keep their own key in the custom form. */
    function syncApiKeyField() {
        if (!els.apiKeyInput) return;
        const custom = Boolean(findCustom(state.provider));
        els.apiKeyInput.disabled = custom;
        els.apiKeyInput.placeholder = custom ? tx('keyManagedInCustom', 'Diatur di Custom API') : '';
    }

    function refreshProviderUi() {
        const providerKey = els.providerSelect.value || state.provider;
        const info = getProviderInfo(providerKey) || PROVIDERS[DEFAULT_PROVIDER];
        const models = modelsFor(providerKey);
        const ids = models.map((m) => m.id);

        if (els.modelList) {
            els.modelList.replaceChildren(...ids.map((id) => option(id, id)));
        }

        const current = els.modelInput.value.trim();
        if (els.modelSelect) {
            const options = models.map((m) => option(m.id, m.name || m.id));
            if (current && !ids.includes(current)) options.unshift(option(current, current));
            els.modelSelect.replaceChildren(...options);
            els.modelSelect.value = current;
        }

        if (els.keyLink) {
            if (info.keyUrl) {
                els.keyLink.setAttribute('href', info.keyUrl);
                els.keyLink.hidden = false;
            } else {
                els.keyLink.hidden = true;
            }
        }

        const isCustomModel = Boolean(current) && !ids.includes(current);
        if (els.modelBadge) {
            els.modelBadge.hidden = !isCustomModel;
            els.modelBadge.textContent = t('modelCustom');
        }
    }

    function updateStatus() {
        const on = hasKey();
        if (els.statusBadge) els.statusBadge.dataset.state = on ? 'on' : 'off';
        if (els.statusText) els.statusText.textContent = on ? t('statusOn') : t('statusOff');
        updateActiveModel();
    }

    function updateActiveModel() {
        if (!els.activeModel) return;
        const info = getProviderInfo(state.provider);
        els.activeModel.textContent = `${info ? info.label : state.provider} · ${state.model}`;
        els.activeModel.dataset.provider = state.provider;
    }

    function syncSettingsForm() {
        rebuildProviderOptions();
        els.providerSelect.value = state.provider;
        els.modelInput.value = state.model;
        els.apiKeyInput.value = state.apiKey;
        els.rememberKey.checked = state.remember;
        els.baseUrlInput.value = state.baseUrl;
        els.proxyInput.value = state.proxyUrl;
        els.tempRange.value = String(state.temp);
        els.tempValue.textContent = state.temp.toFixed(1);
        els.tokRange.value = String(state.maxTokens);
        els.tokValue.textContent = String(state.maxTokens);
        els.tempNum.value = state.temp.toFixed(1);
        els.tokNum.value = String(state.maxTokens);
        paintRangeFill(els.tempRange);
        paintRangeFill(els.tokRange);
        syncApiKeyField();
        refreshProviderUi();
        renderCustomList();
        updateStatus();
    }

    function configFromForm() {
        const providerKey = getProviderInfo(els.providerSelect.value) ? els.providerSelect.value : DEFAULT_PROVIDER;
        const info = getProviderInfo(providerKey);
        const formKey = findCustom(providerKey) ? '' : els.apiKeyInput.value.trim();
        return {
            provider: providerKey,
            model: els.modelInput.value.trim() || info.models[0],
            apiKey: findCustom(providerKey) ? resolveKey(providerKey) : (formKey || state.apiKey),
            baseUrl: findCustom(providerKey) ? info.baseUrl : els.baseUrlInput.value.trim(),
            proxyUrl: els.proxyInput.value.trim(),
            temp: state.temp,
            maxTokens: state.maxTokens
        };
    }

    function saveFromForm() {
        const cfg = configFromForm();
        const custom = findCustom(cfg.provider);
        state.provider = cfg.provider;
        state.model = els.modelInput.value.trim() || getProviderInfo(cfg.provider).models[0];
        if (custom) {
            /* A custom provider's model can be changed here too; the rest of its config is edited in the custom form */
            if (state.model !== custom.model) {
                custom.model = state.model;
                persistCustomProviders();
            }
        } else {
            state.apiKey = els.apiKeyInput.value.trim();
            state.baseUrl = els.baseUrlInput.value.trim();
        }
        state.remember = els.rememberKey.checked;
        state.proxyUrl = els.proxyInput.value.trim();
        els.modelInput.value = state.model;
        persistSettings();
        updateStatus();
        updateNoKeyNotice();
        syncSendButton();
        renderCustomList();
        toast(t('toastSaved'), 'success');
    }

    /* Fetches the provider's own model list and keeps it in the catalog for that provider only */
    async function loadModelList() {
        const cfg = configFromForm();
        if (!cfg.apiKey) {
            toast(t('toastNoKey'), 'error');
            if (els.apiKeyInput && !els.apiKeyInput.disabled) els.apiKeyInput.focus();
            return;
        }
        const req = listRequest(cfg);
        if (!req) {
            toast(tx('modelsNoList', 'Provider ini tidak menyediakan daftar model. Memakai daftar bawaan.'), 'info');
            return;
        }

        const btn = els.loadModelsBtn;
        if (btn) btn.disabled = true;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), TEST_TIMEOUT_MS);
        try {
            const routed = applyProxy(cfg.provider, cfg.proxyUrl, req.url, req.headers);
            const resp = await fetch(routed.url, { method: 'GET', headers: routed.headers, signal: ctrl.signal });
            if (!resp.ok) {
                const info = await readError(resp);
                throw new ApiError(resp.status, info.message, info.code);
            }
            const data = await resp.json();
            const models = normalizeModels(req.parse(data), cfg.provider);
            if (!models.length) {
                toast(tx('modelsEmpty', 'Tidak ada model chat yang ditemukan.'), 'info');
                return;
            }
            state.catalog[cfg.provider] = { fetchedAt: Date.now(), models };
            persistCatalog();
            refreshProviderUi();
            toast(tx('modelsLoaded', '{n} model dimuat.', { n: models.length }), 'success');
        } catch (err) {
            const info = err.name === 'AbortError' ? { title: t('errTimeoutBody') } : describeError(err, cfg.provider);
            toast(tx('modelsFail', 'Gagal memuat model: {msg}', { msg: info.title }), 'error');
        } finally {
            clearTimeout(timer);
            if (btn) btn.disabled = false;
        }
    }

    async function testConnection() {
        const cfg = configFromForm();
        if (!cfg.apiKey) {
            toast(t('toastNoKey'), 'error');
            if (els.apiKeyInput && !els.apiKeyInput.disabled) els.apiKeyInput.focus();
            return;
        }

        const label = els.testBtn.querySelector('span');
        const original = label.textContent;
        els.testBtn.disabled = true;
        label.textContent = t('testing');

        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), TEST_TIMEOUT_MS);
        try {
            const req = buildRequest(Object.assign({}, cfg, { temp: 0, maxTokens: 256 }), [{ role: 'user', content: 'ping' }]);
            const resp = await fetch(req.url, {
                method: 'POST',
                headers: req.headers,
                body: req.body,
                signal: ctrl.signal
            });
            if (!resp.ok) {
                const info = await readError(resp);
                throw new ApiError(resp.status, info.message, info.code);
            }
            toast(t('pingOk', { provider: getProviderInfo(cfg.provider).label }), 'success');
        } catch (err) {
            const info = err.name === 'AbortError'
                ? { title: t('errTimeoutBody') }
                : describeError(err, cfg.provider);
            toast(t('pingFail', { msg: info.title }), 'error');
        } finally {
            clearTimeout(timer);
            els.testBtn.disabled = false;
            label.textContent = original;
        }
    }

    function resetAll() {
        if (!window.confirm(t('confirmReset'))) return;
        state.provider = DEFAULT_PROVIDER;
        state.model = PROVIDERS[DEFAULT_PROVIDER].models[0];
        state.apiKey = '';
        state.remember = true;
        state.baseUrl = '';
        state.proxyUrl = '';
        state.temp = 0.7;
        state.maxTokens = 1024;
        state.quota = null;
        try {
            localStorage.removeItem(SETTINGS_KEY);
            localStorage.removeItem(KEY_STORE);
            sessionStorage.removeItem(KEY_STORE);
        } catch (_) { /* storage blocked */ }
        syncSettingsForm();
        updateNoKeyNotice();
        syncSendButton();
        toast(t('toastReset'), 'success');
    }

    /* ═══════════════════════════════════════
       CUSTOM API
       Keys are never shown after saving: the field stays empty with a placeholder.
       Keys are never written to the console.
       ═══════════════════════════════════════ */
    function hostOf(url) {
        try { return new URL(url).host; } catch (_) { return url; }
    }

    function compatLabel(compat) {
        return { openai: 'OpenAI-compatible', gemini: 'Gemini-compatible', anthropic: 'Anthropic-compatible' }[compat] || compat;
    }

    function readCustomForm() {
        return {
            label: els.customLabel ? els.customLabel.value : '',
            baseUrl: els.customBaseUrl ? els.customBaseUrl.value : '',
            compat: els.customCompat ? els.customCompat.value : 'openai',
            model: els.customModel ? els.customModel.value : '',
            key: els.customApiKey ? els.customApiKey.value : ''
        };
    }

    /* Returns { error } or { value }. Required fields, a valid URL (https, or http only on localhost), and a model id. */
    function validateCustom(input, isEdit) {
        const label = input.label.trim();
        const baseUrl = input.baseUrl.trim().replace(/\/+$/, '');
        const model = input.model.trim();
        const key = input.key.trim();

        if (!label) return { error: tx('customErrLabel', 'Nama provider wajib diisi.') };
        if (label.length > 40) return { error: tx('customErrLabelLong', 'Nama provider maksimal 40 karakter.') };
        if (!baseUrl) return { error: tx('customErrUrlEmpty', 'Endpoint wajib diisi.') };

        let url;
        try {
            url = new URL(baseUrl);
        } catch (_) {
            return { error: tx('customErrUrl', 'Endpoint harus berupa URL yang valid.') };
        }
        const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
        if (url.protocol !== 'https:' && !localHttp) {
            return { error: tx('customErrUrlScheme', 'Endpoint harus memakai https (http hanya untuk localhost).') };
        }

        if (!model || /\s/.test(model) || model.length > 120) {
            return { error: tx('customErrModel', 'Model wajib diisi dan tidak boleh mengandung spasi.') };
        }
        if (!CUSTOM_COMPAT.includes(input.compat)) {
            return { error: tx('customErrCompat', 'Jenis kompatibilitas tidak dikenal.') };
        }
        if (!isEdit && !key) return { error: tx('customErrKey', 'API key wajib diisi.') };

        return {
            value: {
                label,
                baseUrl,
                compat: input.compat,
                model,
                key
            }
        };
    }

    function clearCustomForm() {
        state.editingCustomId = null;
        if (els.customLabel) els.customLabel.value = '';
        if (els.customBaseUrl) els.customBaseUrl.value = '';
        if (els.customCompat) els.customCompat.value = 'openai';
        if (els.customModel) els.customModel.value = '';
        if (els.customApiKey) {
            els.customApiKey.value = '';
            els.customApiKey.placeholder = '';
        }
        if (els.customTitle) els.customTitle.textContent = tx('customAddTitle', 'Tambah Custom API');
        if (els.customSaveBtn) els.customSaveBtn.textContent = tx('customSave', 'Simpan');
        if (els.customCancelBtn) els.customCancelBtn.hidden = true;
    }

    function startEditCustom(id) {
        const c = state.custom.find((x) => x.id === id);
        if (!c) return;
        state.editingCustomId = id;
        if (els.customLabel) els.customLabel.value = c.label;
        if (els.customBaseUrl) els.customBaseUrl.value = c.baseUrl;
        if (els.customCompat) els.customCompat.value = c.compat;
        if (els.customModel) els.customModel.value = c.model;
        if (els.customApiKey) {
            els.customApiKey.value = '';
            els.customApiKey.placeholder = tx('customKeySaved', 'Tersimpan. Kosongkan jika tidak diganti.');
        }
        if (els.customTitle) els.customTitle.textContent = tx('customEditTitle', 'Ubah Custom API');
        if (els.customSaveBtn) els.customSaveBtn.textContent = tx('customUpdate', 'Perbarui');
        if (els.customCancelBtn) els.customCancelBtn.hidden = false;
        if (els.customLabel) els.customLabel.focus();
    }

    function saveCustom() {
        const editing = state.editingCustomId ? state.custom.find((c) => c.id === state.editingCustomId) : null;
        const check = validateCustom(readCustomForm(), Boolean(editing));
        if (check.error) {
            toast(check.error, 'error');
            return;
        }
        const v = check.value;

        if (editing) {
            const providerKey = CUSTOM_PREFIX + editing.id;
            editing.label = v.label;
            editing.baseUrl = v.baseUrl;
            editing.compat = v.compat;
            editing.model = v.model;
            if (v.key) {
                editing.apiKey = v.key;
                storeCustomKey(editing.id, v.key);
            }
            delete state.catalog[providerKey];
            persistCatalog();
            if (state.provider === providerKey) state.model = v.model;
        } else {
            const c = { id: uid(), label: v.label, baseUrl: v.baseUrl, compat: v.compat, model: v.model, apiKey: v.key };
            state.custom.push(c);
            storeCustomKey(c.id, v.key);
            state.provider = CUSTOM_PREFIX + c.id;
            state.model = v.model;
        }

        persistCustomProviders();
        persistSettings();
        clearCustomForm();
        syncSettingsForm();
        updateNoKeyNotice();
        toast(t('toastSaved'), 'success');
    }

    function deleteCustom(id) {
        const c = state.custom.find((x) => x.id === id);
        if (!c) return;
        if (!window.confirm(tx('customConfirmDelete', 'Hapus custom API "{name}"?', { name: c.label }))) return;
        const providerKey = CUSTOM_PREFIX + id;
        state.custom = state.custom.filter((x) => x.id !== id);
        removeCustomKey(id);
        delete state.catalog[providerKey];
        persistCatalog();
        persistCustomProviders();
        if (state.editingCustomId === id) clearCustomForm();
        if (state.provider === providerKey) {
            state.provider = DEFAULT_PROVIDER;
            state.model = PROVIDERS[DEFAULT_PROVIDER].models[0];
            persistSettings();
        }
        syncSettingsForm();
        updateNoKeyNotice();
        toast(t('toastDeleted'), 'success');
    }

    function useCustom(id) {
        const c = state.custom.find((x) => x.id === id);
        if (!c) return;
        state.provider = CUSTOM_PREFIX + id;
        state.model = c.model;
        persistSettings();
        syncSettingsForm();
        updateNoKeyNotice();
        syncSendButton();
    }

    function actionButton(action, id, label) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'custom-btn';
        btn.dataset.customAction = action;
        btn.dataset.customId = id;
        btn.textContent = label;
        return btn;
    }

    function renderCustomList() {
        if (!els.customList) return;
        els.customList.replaceChildren();

        if (!state.custom.length) {
            const empty = document.createElement('p');
            empty.className = 'custom-empty';
            empty.textContent = tx('customEmpty', 'Belum ada custom API.');
            els.customList.appendChild(empty);
            return;
        }

        state.custom.forEach((c) => {
            const item = document.createElement('div');
            item.className = `custom-item${state.provider === CUSTOM_PREFIX + c.id ? ' is-active' : ''}`;

            const info = document.createElement('div');
            info.className = 'custom-info';
            const name = document.createElement('strong');
            name.textContent = c.label;
            const meta = document.createElement('span');
            meta.className = 'custom-meta';
            meta.textContent = `${c.model} · ${compatLabel(c.compat)} · ${hostOf(c.baseUrl)}`;
            info.append(name, meta);

            const actions = document.createElement('div');
            actions.className = 'custom-actions';
            actions.append(
                actionButton('use', c.id, tx('customUse', 'Pakai')),
                actionButton('edit', c.id, tx('customEdit', 'Ubah')),
                actionButton('delete', c.id, tx('customDelete', 'Hapus'))
            );

            item.append(info, actions);
            els.customList.appendChild(item);
        });
    }

    /* ═══════════════════════════════════════
       MODEL SHEET
       Model picker as a bottom drawer. Closes with the overlay, the close button,
       a swipe down on the handle, or Escape.
       ═══════════════════════════════════════ */
    function isModelSheetOpen() {
        return els.modelSheet.classList.contains('open');
    }

    function renderModelSheet() {
        const providerLabel = (getProviderInfo(state.provider) || {}).label || state.provider;
        const items = modelsFor(state.provider).map((m) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'presentation');

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'model-option';
            btn.setAttribute('role', 'option');
            const active = m.id === state.model;
            btn.setAttribute('aria-selected', String(active));
            btn.dataset.modelId = m.id;

            const text = document.createElement('span');
            text.className = 'model-option-text';
            const name = document.createElement('span');
            name.className = 'model-option-name';
            name.textContent = m.name || m.id;
            const sub = document.createElement('span');
            sub.className = 'model-option-id';
            sub.textContent = `${providerLabel} · ${m.id}`;
            text.append(name, sub);
            btn.appendChild(text);

            if (active) {
                const badge = document.createElement('span');
                badge.className = 'model-option-badge';
                badge.textContent = t('modelActive');
                btn.appendChild(badge);
            }
            li.appendChild(btn);
            return li;
        });
        els.modelSheetList.replaceChildren(...items);
    }

    function openModelSheet() {
        if (isModelSheetOpen()) return;
        renderModelSheet();
        sheetTrap.activate();
        els.modelSheet.classList.add('open');
        els.modelSheet.setAttribute('aria-hidden', 'false');
        els.modelSheetOverlay.classList.add('open');
        els.modelPickerBtn.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
            const current = els.modelSheetList.querySelector('[aria-selected="true"]');
            (current || els.modelSheetClose).focus({ preventScroll: true });
        }, 80);
    }

    function closeModelSheet() {
        if (!isModelSheetOpen()) return;
        sheetTrap.deactivate();
        els.modelSheet.classList.remove('open', 'is-dragging');
        els.modelSheet.setAttribute('aria-hidden', 'true');
        els.modelSheet.style.transform = '';
        els.modelSheetOverlay.classList.remove('open');
        els.modelPickerBtn.setAttribute('aria-expanded', 'false');
        els.modelPickerBtn.focus({ preventScroll: true });
    }

    function toggleModelSheet() {
        if (isModelSheetOpen()) closeModelSheet();
        else openModelSheet();
    }

    function selectModel(id) {
        if (!id) return;
        state.model = id;
        els.modelInput.value = id;
        const custom = findCustom(state.provider);
        if (custom && custom.model !== id) {
            custom.model = id;
            persistCustomProviders();
        }
        persistSettings();
        updateActiveModel();
        refreshProviderUi();
        closeModelSheet();
    }

    /* Swipe down on the handle or header to close. Releasing short of 80px snaps back. */
    function bindSheetDrag() {
        const handles = [els.modelSheetGrip, els.modelSheet.querySelector('.sheet-head')].filter(Boolean);
        let startY = 0;
        let offset = 0;
        let active = false;
        handles.forEach((handle) => {
            handle.addEventListener('pointerdown', (e) => {
                active = true;
                startY = e.clientY;
                offset = 0;
                els.modelSheet.classList.add('is-dragging');
                if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
            });
            handle.addEventListener('pointermove', (e) => {
                if (!active) return;
                offset = Math.max(0, e.clientY - startY);
                els.modelSheet.style.transform = `translateY(${offset}px)`;
            });
            const release = () => {
                if (!active) return;
                active = false;
                els.modelSheet.classList.remove('is-dragging');
                if (offset > 80) closeModelSheet();
                else els.modelSheet.style.transform = '';
                offset = 0;
            };
            handle.addEventListener('pointerup', release);
            handle.addEventListener('pointercancel', release);
        });
    }

    /* ═══════════════════════════════════════
       SETTINGS PANEL
       Opens over the chat. The settings button toggles it, and the same button closes it.
       ═══════════════════════════════════════ */
    function isSettingsOpen() {
        return els.settingView.classList.contains('open');
    }

    function setSettingsButton(open) {
        if (!els.navSetting) return;
        els.navSetting.setAttribute('aria-expanded', String(open));
        els.navSetting.classList.toggle('is-active', open);
    }

    function openSettings({ route = true } = {}) {
        if (isSettingsOpen()) return;
        closeDrawer();
        syncSettingsForm();
        els.settingView.classList.add('open');
        els.settingView.setAttribute('aria-hidden', 'false');
        els.settingsOverlay.classList.add('open');
        setSettingsButton(true);
        settingsTrap.activate();
        if (route) navigate('setting');
        animateSettings();
        setTimeout(() => els.settingsClose.focus(), 60);
    }

    function closeSettings({ route = true } = {}) {
        if (!isSettingsOpen()) return;
        const hadFocus = els.settingView.contains(document.activeElement);
        els.settingView.classList.remove('open');
        els.settingView.setAttribute('aria-hidden', 'true');
        els.settingsOverlay.classList.remove('open');
        setSettingsButton(false);
        settingsTrap.deactivate();
        if (route) navigate('chat', { replace: true });
        if (hadFocus && els.navSetting) els.navSetting.focus();
        updateJumpButton();
        if (!prefersReducedMotion()) scrollToBottom(false);
    }

    function toggleSettings() {
        if (isSettingsOpen()) closeSettings();
        else openSettings();
    }

    /* ═══════════════════════════════════════
       EVENT BINDINGS
       ═══════════════════════════════════════ */
    /* Sliders change only while the thumb is dragged. A tap on the track is ignored. Keyboard arrows still work. */
    function bindEvents() {
        /* Composer */
        els.composer.addEventListener('submit', onFormSubmit);
        els.prompt.addEventListener('input', () => {
            resizePrompt();
            updateCharCount();
            syncSendButton();
        });
        els.prompt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                e.preventDefault();
                if (!state.loading) requestSubmit();
            }
        });

        /* Suggestion chips */
        bindChipHover();
        els.chips.addEventListener('click', (e) => {
            const chip = e.target.closest('[data-prompt-key]');
            if (!chip) return;
            const text = t(chip.dataset.promptKey);
            els.prompt.value = text;
            resizePrompt();
            updateCharCount();
            syncSendButton();
            els.prompt.focus();
            els.prompt.setSelectionRange(text.length, text.length);
        });

        /* Message actions (event delegation) */
        els.messages.addEventListener('click', (e) => {
            const codeBtn = e.target.closest('[data-copy-code]');
            if (codeBtn) {
                const code = codeBtn.closest('.code-block') && codeBtn.closest('.code-block').querySelector('code');
                copyText(code ? code.textContent : '');
                return;
            }
            const msgBtn = e.target.closest('[data-copy-msg]');
            if (msgBtn) {
                const id = msgBtn.closest('.msg') && msgBtn.closest('.msg').dataset.id;
                const message = state.messages.find((m) => m.id === id);
                copyText(message ? message.content : '');
                return;
            }
            if (e.target.closest('[data-goto-setting]')) {
                goToKeySettings();
                return;
            }
            if (e.target.closest('[data-retry]')) retryLast();
        });

        /* Quota note */
        on(els.quotaBtn, 'click', goToKeySettings);

        /* Scroll */
        els.chatScroll.addEventListener('scroll', updateJumpButton, { passive: true });
        els.jumpBtn.addEventListener('click', () => scrollToBottom(true));

        /* Header */
        els.newChatBtn.addEventListener('click', () => {
            startNewChat();
            closeSettings();
            els.prompt.focus();
        });
        els.historyBtn.addEventListener('click', openDrawer);
        els.themeToggle.addEventListener('click', toggleTheme);

        /* Drawer */
        els.drawerClose.addEventListener('click', closeDrawer);
        els.drawerOverlay.addEventListener('click', closeDrawer);
        els.clearAllBtn.addEventListener('click', clearAllHistory);
        els.historyList.addEventListener('click', (e) => {
            const del = e.target.closest('[data-delete-session]');
            if (del) {
                deleteSession(del.dataset.deleteSession);
                return;
            }
            const open = e.target.closest('[data-open-session]');
            if (open) openSession(open.dataset.openSession);
        });

        /* Model sheet */
        on(els.modelPickerBtn, 'click', toggleModelSheet);
        on(els.modelSheetClose, 'click', closeModelSheet);
        on(els.modelSheetOverlay, 'click', closeModelSheet);
        on(els.modelSheetList, 'click', (e) => {
            const option = e.target.closest('[data-model-id]');
            if (option) selectModel(option.dataset.modelId);
        });
        bindSheetDrag();

        /* Settings panel */
        on(els.navSetting, 'click', toggleSettings);
        on(els.settingsClose, 'click', closeSettings);
        on(els.backToChat, 'click', () => closeSettings());
        on(els.settingsOverlay, 'click', closeSettings);
        on($('brandLink'), 'click', (e) => {
            e.preventDefault();
            closeSettings();
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-open-settings]')) openSettings();
        });

        /* Settings */
        on(els.langSelect, 'change', () => window.I18N.setLang(els.langSelect.value));
        on(els.providerSelect, 'change', () => {
            const providerKey = els.providerSelect.value;
            const info = getProviderInfo(providerKey);
            if (!info) return;
            els.modelInput.value = modelsFor(providerKey)[0] ? modelsFor(providerKey)[0].id : info.models[0];
            syncApiKeyField();
            refreshProviderUi();
        });
        on(els.modelSelect, 'change', () => {
            els.modelInput.value = els.modelSelect.value;
            refreshProviderUi();
        });
        on(els.modelInput, 'input', refreshProviderUi);
        on(els.loadModelsBtn, 'click', loadModelList);
        on(els.rememberKey, 'change', () => {
            state.remember = els.rememberKey.checked;
            persistSettings();
        });
        on(els.toggleKeyBtn, 'click', () => {
            const show = els.apiKeyInput.type === 'password';
            els.apiKeyInput.type = show ? 'text' : 'password';
            els.toggleKeyBtn.setAttribute('aria-pressed', String(show));
            els.toggleKeyBtn.setAttribute('aria-label', show ? t('hideKey') : t('showKey'));
            const use = els.eyeIcon.querySelector('use');
            if (use) use.setAttribute('href', show ? '#i-eye-off' : '#i-eye');
        });
        on(els.apiKeyInput, 'keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveFromForm();
            }
        });
        on(els.connectBtn, 'click', saveFromForm);
        on(els.testBtn, 'click', testConnection);

        guardSlider(els.tempRange);
        guardSlider(els.tokRange);

        /* Sliders: a drag updates the value, nothing is triggered by taps. Typed numbers work too. */
        const applyTemp = (value) => {
            state.temp = value;
            els.tempValue.textContent = value.toFixed(1);
            els.tempNum.value = value.toFixed(1);
            persistSettings();
        };
        const applyTok = (value) => {
            state.maxTokens = value;
            els.tokValue.textContent = String(value);
            els.tokNum.value = String(value);
            persistSettings();
        };
        on(els.tempRange, 'input', () => {
            paintRangeFill(els.tempRange);
            applyTemp(Number(els.tempRange.value));
        });
        on(els.tokRange, 'input', () => {
            paintRangeFill(els.tokRange);
            applyTok(Number(els.tokRange.value));
        });
        bindRangeNumber(els.tempRange, els.tempNum, 1, applyTemp);
        bindRangeNumber(els.tokRange, els.tokNum, 0, applyTok);
        on(els.resetBtn, 'click', resetAll);

        /* Custom API */
        on(els.customSaveBtn, 'click', saveCustom);
        on(els.customCancelBtn, 'click', clearCustomForm);
        on(els.customList, 'click', (e) => {
            const btn = e.target.closest('[data-custom-action]');
            if (!btn) return;
            const id = btn.dataset.customId;
            if (btn.dataset.customAction === 'use') useCustom(id);
            else if (btn.dataset.customAction === 'edit') startEditCustom(id);
            else if (btn.dataset.customAction === 'delete') deleteCustom(id);
        });

        /* Routing and language */
        window.addEventListener('raia:langchange', () => {
            els.langSelect.value = window.I18N.getLang();
            renderAll();
            renderHistory();
            refreshProviderUi();
            renderCustomList();
            updateStatus();
            updateQuotaNote();
            updateCharCount();
            syncSendButton();
        });

        /* Keyboard shortcuts */
        document.addEventListener('keydown', (e) => {
            const mod = e.ctrlKey || e.metaKey;
            const key = e.key.toLowerCase();
            if (mod && key === 'n') {
                e.preventDefault();
                startNewChat();
                closeSettings();
                els.prompt.focus();
            } else if (mod && key === 'k') {
                e.preventDefault();
                closeSettings();
                els.prompt.focus();
            } else if (mod && key === 'h') {
                e.preventDefault();
                openDrawer();
            } else if (e.key === 'Escape') {
                closeDrawer();
                closeSettings();
                closeModelSheet();
            }
        });

        /* Connectivity */
        window.addEventListener('online', () => toast(t('toastOnline'), 'success'));
        window.addEventListener('offline', () => toast(t('toastOffline'), 'error'));
    }

    /* ═══════════════════════════════════════
       INIT
       ═══════════════════════════════════════ */
    function setupSanitizer() {
        if (!window.DOMPurify || typeof window.DOMPurify.addHook !== 'function') return;
        window.DOMPurify.addHook('afterSanitizeAttributes', (node) => {
            if (node.tagName === 'A' && node.getAttribute('href')) {
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    function init() {
        window.I18N.apply();
        setupSanitizer();

        loadCustomProviders();
        loadCatalog();
        loadSettings();
        loadSessions();

        const savedTheme = (() => {
            try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch (_) { return 'dark'; }
        })();
        applyTheme(savedTheme);

        els.langSelect.value = window.I18N.getLang();
        syncSettingsForm();

        bindEvents();
        watchKeyboard();
        /* Routing: /chat dan /setting. Hash lama dikonversi, lalu URL dirapikan. */
        migrateHashRoute();
        const initialRoute = currentRoute();
        navigate(initialRoute, { replace: true });
        onRouteChange((route) => (route === 'setting'
            ? openSettings({ route: false })
            : closeSettings({ route: false })));
        renderAll();
        animateWelcome();
        syncSendButton();
        updateCharCount();
        resizePrompt();
        if (currentRoute() === 'setting') openSettings({ route: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* Exposed for debugging only */
    window.RAIA = { version: APP_VERSION };
})();
