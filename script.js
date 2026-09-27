/* ═══════════════════════════════════════════════
   RAIA — Reflecting Tomorrow  ·  v1.1.1
   script.js
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    const APP_VERSION = '1.1.1';

    const PROVIDERS = {
        OpenRouter: {
            label: 'OpenRouter',
            models: [
                'anthropic/claude-sonnet-5', 'openai/gpt-5.6', 'google/gemini-3.5-flash',
                'meta-llama/llama-4-maverick', 'mistralai/mistral-large-3', 'deepseek/deepseek-v4'
            ],
            baseUrl: 'https://openrouter.ai/api/v1',
            keyUrl: 'https://openrouter.ai/settings/keys',
            keyHint: 'Get from OpenRouter dashboard'
        },
        OpenAI: {
            label: 'OpenAI',
            models: ['gpt-5.6', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-4o', 'gpt-4o-mini'],
            baseUrl: 'https://api.openai.com/v1',
            keyUrl: 'https://platform.openai.com/api-keys',
            keyHint: 'Create API key on OpenAI platform'
        },
        Perplexity: {
            label: 'Perplexity',
            models: ['sonar', 'sonar-pro', 'sonar-reasoning-pro', 'sonar-deep-research'],
            baseUrl: 'https://api.perplexity.ai',
            keyUrl: 'https://www.perplexity.ai/settings/api',
            keyHint: 'Get from Perplexity settings'
        },
        'Claude (Anthropic)': {
            label: 'Claude (Anthropic)',
            models: ['claude-sonnet-5', 'claude-opus-4-8', 'claude-haiku-4-5-20251001', 'claude-fable-5'],
            baseUrl: 'https://api.anthropic.com/v1',
            keyUrl: 'https://console.anthropic.com/settings/keys',
            keyHint: 'Create API key on Anthropic console'
        },
        'Gemini (Google)': {
            label: 'Gemini (Google)',
            models: ['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'],
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
            keyUrl: 'https://aistudio.google.com/app/apikey',
            keyHint: 'Get from Google AI Studio'
        },
        Mistral: {
            label: 'Mistral',
            models: ['mistral-large-latest', 'mistral-small-latest', 'magistral-medium-latest', 'codestral-latest'],
            baseUrl: 'https://api.mistral.ai/v1',
            keyUrl: 'https://console.mistral.ai/api-keys/',
            keyHint: 'Create API key on Mistral console'
        }
    };

    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    const providerEl       = $('#provider');
    const modelEl          = $('#model');
    const modelListData    = $('#modelListData');
    const modelBadge       = $('#modelBadge');
    const apiKeyEl         = $('#apiKey');
    const rememberKeyEl    = $('#rememberKey');
    const customBaseUrlEl  = $('#customBaseUrl');
    const proxyUrlEl       = $('#proxyUrl');
    const CORS_BLOCKED     = ['OpenAI', 'Perplexity', 'Mistral'];
    const eyeToggle        = $('#eyeToggle');
    const connectBtn       = $('#connectBtn');
    const testBtn          = $('#testBtn');
    const resetBtn         = $('#resetBtn');
    const tempSlider       = $('#tempSlider');
    const tokSlider        = $('#tokSlider');
    const tempDisplay      = $('#tempDisplay');
    const tokDisplay       = $('#tokDisplay');
    const statusDot        = $('#statusDot');
    const statusText       = $('#statusText');
    const keyLink          = $('#keyLink');
    const messages         = $('#messages');
    const chatForm         = $('#chatForm');
    const prompt           = $('#prompt');
    const sendBtn          = $('#sendBtn');
    const sendIcon         = $('#sendIcon');
    const settingsToggle   = $('#settingsToggle');
    const settingsPanel    = $('#settingsPanel');
    const themeToggle      = $('#themeToggle');
    const newChatBtn       = $('#newChatBtn');
    const toasts           = $('#toasts');
    const welcome          = $('#welcome');
    const jumpBottom       = $('#jumpBottom');
    const scrollProgress   = $('#scrollProgress');
    const spotlight        = $('#spotlight');
    const charCount        = $('#charCount');
    const suggestionChips  = $('#suggestionChips');
    const quickRow         = $('#quickRow');
    const advancedToggle   = $('#advancedToggle');
    const advancedContent  = $('#advancedContent');
    const header           = $('#header');
    const historyToggle    = $('#historyToggle');
    const historyDrawer    = $('#historyDrawer');
    const historyOverlay   = $('#historyOverlay');
    const closeHistoryBtn  = $('#closeHistoryBtn');
    const chatHistoryList  = $('#chatHistoryList');
    const newChatDrawerBtn = $('#newChatDrawerBtn');

    let state = {
        provider: 'OpenRouter',
        model: '',
        apiKey: '',
        rememberKey: true,
        customBaseUrl: '',
        proxyUrl: '',
        connected: false,
        temp: 0.7,
        maxTokens: 1024,
        theme: null,
        messages: [],
        loading: false,
        chatId: Date.now().toString(36),
        currentSessionId: null
    };

    let abortController = null;

    /* ─── Persistence ─── */
    function load() {
        try {
            const raw = localStorage.getItem('raia_simple');
            if (raw) {
                const saved = JSON.parse(raw);
                Object.assign(state, saved);
            }
        } catch (_) { /* ignore */ }

        if (!state.chatId) state.chatId = Date.now().toString(36);
        if (!Array.isArray(state.messages)) state.messages = [];

        if (!state.theme) {
            const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            state.theme = prefersLight ? 'light' : 'dark';
        }

        const savedSessionId = localStorage.getItem('raia_current_session');
        if (savedSessionId) state.currentSessionId = savedSessionId;
    }

    function save() {
        try {
            const toSave = Object.assign({}, state);
            if (!state.rememberKey) toSave.apiKey = '';
            localStorage.setItem('raia_simple', JSON.stringify(toSave));
            if (state.currentSessionId) {
                localStorage.setItem('raia_current_session', state.currentSessionId);
            } else {
                localStorage.removeItem('raia_current_session');
            }
        } catch (_) { /* ignore */ }
    }

    /* ─── Toasts ─── */
    const TOAST_ICONS = {
        success: '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-check"/></svg>',
        error:   '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-alert-triangle"/></svg>',
        info:    '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-info"/></svg>'
    };

    function toast(msg, type = 'success') {
        const el = document.createElement('div');
        el.className = 'toast ' + type;
        el.innerHTML = `<span aria-hidden="true">${TOAST_ICONS[type] || TOAST_ICONS.info}</span><span>${escapeHtml(msg)}</span>`;
        toasts.appendChild(el);
        setTimeout(() => { if (el.parentNode) el.remove(); }, 3800);
    }

    /* ─── Utilities ─── */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str == null ? '' : String(str);
        return div.innerHTML;
    }

    function renderMarkdown(text) {
        let html = escapeHtml(text);
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code>${code}</code></pre>`);
        html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
        html = html.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>');
        html = html.replace(/^#{1,6}\s?(.*)$/gm, '<strong>$1</strong>');
        html = html.replace(/^[-*]\s+(.*)$/gm, '<li style="margin-left:18px;">$1</li>');
        html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function fmtTime(ts) {
        try {
            return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (_) { return ''; }
    }

    function addMessage(role, content) {
        state.messages.push({ role, content, ts: Date.now() });
        save();
        renderMessages();
        saveCurrentSession();
    }

    function isNearBottom() {
        return messages.scrollHeight - messages.scrollTop - messages.clientHeight < 120;
    }

    function scrollToBottom(smooth) {
        messages.scrollTo({ top: messages.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
        jumpBottom.classList.remove('show');
    }

    /* ─── Render messages ─── */
    function renderMessages(opts) {
        opts = opts || {};
        const wasNearBottom = isNearBottom();

        if (state.messages.length === 0) {
            if (!document.getElementById('welcome')) {
                messages.innerHTML = '';
                messages.appendChild(welcome);
            }
            return;
        }

        const wc = document.getElementById('welcome');
        if (wc) wc.remove();

        messages.innerHTML = '';

        state.messages.forEach((m) => {
            const msg = document.createElement('div');
            msg.className = 'msg ' + m.role;

            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            if (m.role === 'user') {
                avatar.textContent = 'U';
            } else {
                avatar.innerHTML = '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-sparkle"/></svg>';
            }

            const wrap = document.createElement('div');
            wrap.className = 'bubble-wrap';

            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.innerHTML = renderMarkdown(m.content);
            wrap.appendChild(bubble);

            const actions = document.createElement('div');
            actions.className = 'actions';

            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.innerHTML = '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-copy"/></svg> Copy';
            copyBtn.addEventListener('click', () => copyText(m.content, copyBtn));
            actions.appendChild(copyBtn);

            if (m.role === 'assistant') {
                const regenBtn = document.createElement('button');
                regenBtn.type = 'button';
                regenBtn.innerHTML = '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-refresh"/></svg> Regenerate';
                regenBtn.addEventListener('click', () => {
                    const idx = state.messages.indexOf(m);
                    const lastUser = [...state.messages.slice(0, idx)].reverse().find(mm => mm.role === 'user');
                    if (lastUser) {
                        state.messages.splice(idx, 1);
                        save();
                        renderMessages();
                        sendToAI(lastUser.content);
                    }
                });
                actions.appendChild(regenBtn);
            }

            const meta = document.createElement('div');
            meta.className = 'msg-meta';
            meta.textContent = fmtTime(m.ts);

            wrap.appendChild(actions);
            wrap.appendChild(meta);

            msg.appendChild(avatar);
            msg.appendChild(wrap);
            messages.appendChild(msg);
        });

        if (opts.forceScroll || wasNearBottom) {
            scrollToBottom(false);
        } else {
            jumpBottom.classList.add('show');
        }
    }

    /* ─── Copy ─── */
    function copyText(text, btnEl) {
        const done = () => {
            if (btnEl) {
                const original = btnEl.innerHTML;
                btnEl.innerHTML = '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-check"/></svg> Copied';
                btnEl.classList.add('copied');
                setTimeout(() => {
                    btnEl.innerHTML = original;
                    btnEl.classList.remove('copied');
                }, 1500);
            }
            toast('Copied to clipboard', 'success');
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else {
            fallbackCopy(text, done);
        }
    }

    function fallbackCopy(text, done) {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            ta.style.pointerEvents = 'none';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            done();
        } catch (_) {
            toast('Could not copy — please copy manually', 'error');
        }
    }

    /* ─── Typing indicator ─── */
    function showTyping() {
        const el = document.createElement('div');
        el.className = 'msg assistant';
        el.id = 'typing';
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = '<svg class="icon icon-sm" aria-hidden="true"><use href="#i-sparkle"/></svg>';
        const wrap = document.createElement('div');
        wrap.className = 'bubble-wrap';
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
        wrap.appendChild(bubble);
        el.appendChild(avatar);
        el.appendChild(wrap);
        messages.appendChild(el);
        if (isNearBottom()) scrollToBottom(true);
    }

    function hideTyping() {
        const el = document.getElementById('typing');
        if (el) el.remove();
    }

    /* ─── Provider / model dropdowns ─── */
    function populateProviders() {
        providerEl.innerHTML = '';
        Object.keys(PROVIDERS).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = PROVIDERS[key].label;
            if (key === state.provider) opt.selected = true;
            providerEl.appendChild(opt);
        });
        updateModels();
        updateKeyHint();
    }

    function updateModels() {
        const key = providerEl.value;
        const data = PROVIDERS[key];
        modelListData.innerHTML = '';
        (data.models || []).forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            modelListData.appendChild(opt);
        });
        if (!state.model) state.model = data.models[0] || '';
        modelEl.value = state.model;
        modelBadge.textContent = (data.models || []).includes(state.model) ? '' : '(custom)';
    }

    function updateKeyHint() {
        const key = providerEl.value;
        const data = PROVIDERS[key];
        keyLink.href = data.keyUrl || '#';
        keyLink.innerHTML = data.keyUrl
            ? '<span>Get API key</span> <svg class="icon icon-sm" aria-hidden="true"><use href="#i-external-link"/></svg>'
            : '<span>—</span>';
        customBaseUrlEl.placeholder = `Default: ${data.baseUrl}`;
    }

    function effectiveBaseUrl() {
        const custom = (customBaseUrlEl.value || '').trim();
        if (custom) return custom.replace(/\/+$/, '');
        return (PROVIDERS[state.provider]?.baseUrl || '').replace(/\/+$/, '');
    }

    providerEl.addEventListener('change', () => {
        state.provider = providerEl.value;
        state.model = '';
        updateModels();
        updateKeyHint();
        save();
    });

    modelEl.addEventListener('change', () => {
        state.model = modelEl.value.trim();
        modelBadge.textContent = (PROVIDERS[state.provider]?.models || []).includes(state.model) ? '' : '(custom)';
        save();
    });
    modelEl.addEventListener('blur', () => {
        state.model = modelEl.value.trim();
        save();
    });

    customBaseUrlEl.addEventListener('change', () => { state.customBaseUrl = customBaseUrlEl.value.trim(); save(); });
    proxyUrlEl.addEventListener('change', () => { state.proxyUrl = proxyUrlEl.value.trim(); save(); });

    /* ─── CORS proxy wrapper ─── */
    function wrapForProxy(provider, targetUrl, headers) {
        if (CORS_BLOCKED.includes(provider) && state.proxyUrl) {
            const proxyBase = state.proxyUrl.replace(/\/$/, '');
            return { url: proxyBase, headers: { ...headers, 'X-Target-Url': targetUrl } };
        }
        return { url: targetUrl, headers };
    }

    /* ─── API key visibility ─── */
    eyeToggle.addEventListener('click', () => {
        const isPass = apiKeyEl.type === 'password';
        apiKeyEl.type = isPass ? 'text' : 'password';
        eyeToggle.innerHTML = isPass
            ? '<svg class="icon" aria-hidden="true"><use href="#i-eye-off"/></svg>'
            : '<svg class="icon" aria-hidden="true"><use href="#i-eye"/></svg>';
    });

    rememberKeyEl.addEventListener('change', () => {
        state.rememberKey = rememberKeyEl.checked;
        save();
        toast(state.rememberKey ? 'API key will be remembered on this device' : 'API key will only be kept for this session', 'info');
    });

    function applyApiKeyDirectly() {
        const val = apiKeyEl.value.trim();
        if (val) {
            state.apiKey = val;
            state.connected = true;
            updateStatus();
            save();
        }
    }

    apiKeyEl.addEventListener('input', applyApiKeyDirectly);

    apiKeyEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyApiKeyDirectly();
            settingsPanel.classList.remove('open');
            settingsToggle.classList.remove('active');
            settingsToggle.setAttribute('aria-expanded', 'false');
            const label = settingsToggle.querySelector('.label');
            if (label) label.textContent = 'Setup API';
            prompt.focus();
            toast('API Key applied — you can now chat!', 'success');
        }
    });

    connectBtn.addEventListener('click', () => {
        const key = apiKeyEl.value.trim();
        if (!key) {
            toast('API Key cannot be empty', 'error');
            apiKeyEl.focus();
            return;
        }
        state.apiKey = key;
        state.connected = true;
        updateStatus();
        save();
        if (CORS_BLOCKED.includes(providerEl.value) && !state.proxyUrl) {
            toast(`${providerEl.value} blocks direct browser requests (CORS). Set a CORS Proxy URL under Advanced, or switch to OpenRouter.`, 'error');
        } else {
            toast('Connected & saved', 'success');
        }
    });

    /* ─── Test connection ─── */
    testBtn.addEventListener('click', async () => {
        const key = apiKeyEl.value.trim() || state.apiKey;
        if (!key) {
            toast('Enter an API key first', 'error');
            apiKeyEl.focus();
            return;
        }
        testBtn.disabled = true;
        const original = testBtn.innerHTML;
        testBtn.innerHTML = '⏳ Pinging…';
        try {
            const provider = providerEl.value;
            const model = modelEl.value.trim();
            const baseUrl = effectiveBaseUrl();

            if (provider === 'Gemini (Google)') {
                const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
                        generationConfig: { maxOutputTokens: 5 }
                    })
                });
                if (!resp.ok) throw new Error(await extractError(resp));
            } else if (provider === 'Claude (Anthropic)') {
                const resp = await fetch(`${baseUrl}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': key,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true'
                    },
                    body: JSON.stringify({
                        model: model || 'claude-haiku-4-5-20251001',
                        max_tokens: 5,
                        messages: [{ role: 'user', content: 'ping' }]
                    })
                });
                if (!resp.ok) throw new Error(await extractError(resp));
            } else {
                let headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` };
                if (provider === 'OpenRouter') {
                    headers['HTTP-Referer'] = 'https://raia-ai.netlify.app/';
                    headers['X-Title'] = 'RAIA';
                }
                let testUrl = `${baseUrl}/chat/completions`;
                ({ url: testUrl, headers } = wrapForProxy(provider, testUrl, headers));
                const resp = await fetch(testUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        model: model || 'gpt-4o-mini',
                        max_tokens: 5,
                        messages: [{ role: 'user', content: 'ping' }]
                    })
                });
                if (!resp.ok) throw new Error(await extractError(resp));
            }
            toast(`Ping successful to ${PROVIDERS[provider]?.label || provider}`, 'success');
            if (!state.connected) {
                state.apiKey = key;
                state.connected = true;
                updateStatus();
                save();
            }
        } catch (err) {
            toast(`Ping failed: ${friendlyError(err)}`, 'error');
        } finally {
            testBtn.disabled = false;
            testBtn.innerHTML = original;
        }
    });

    async function extractError(resp) {
        let msg = `HTTP ${resp.status}`;
        try {
            const d = await resp.json();
            msg = d?.error?.message || d?.message || d?.detail || msg;
        } catch (_) { /* ignore */ }
        return msg;
    }

    function friendlyError(err) {
        const m = (err && err.message) || 'Unknown error';
        if (/failed to fetch|networkerror|load failed/i.test(m)) {
            return `${m} — this provider blocks direct browser calls (CORS). Set a CORS Proxy URL under Advanced, or switch to OpenRouter.`;
        }
        return m;
    }

    function updateStatus() {
        statusDot.className = state.connected ? 'dot on' : 'dot';
        statusText.textContent = state.connected ? 'Connected' : 'Disconnected';
        settingsToggle.classList.toggle('active', settingsPanel.classList.contains('open'));
    }

    /* ─── Sliders ─── */
    tempSlider.addEventListener('input', () => {
        state.temp = parseFloat(tempSlider.value);
        tempDisplay.textContent = state.temp.toFixed(1);
        save();
    });
    tokSlider.addEventListener('input', () => {
        state.maxTokens = parseInt(tokSlider.value, 10);
        tokDisplay.textContent = state.maxTokens;
        save();
    });

    advancedToggle.addEventListener('click', () => {
        const open = advancedContent.classList.toggle('open');
        advancedToggle.classList.toggle('open', open);
        advancedToggle.setAttribute('aria-expanded', String(open));
    });

    /* ─── Reset ─── */
    resetBtn.addEventListener('click', () => {
        if (!confirm('Reset all chat history and configuration? This cannot be undone.')) return;
        if (abortController) abortController.abort();
        state = {
            provider: 'OpenRouter', model: '', apiKey: '', rememberKey: true,
            customBaseUrl: '', proxyUrl: '', connected: false,
            temp: 0.7, maxTokens: 1024, theme: state.theme,
            messages: [], loading: false, chatId: Date.now().toString(36),
            currentSessionId: null
        };
        apiKeyEl.value = '';
        customBaseUrlEl.value = '';
        proxyUrlEl.value = '';
        rememberKeyEl.checked = true;
        tempSlider.value = 0.7;
        tokSlider.value = 1024;
        tempDisplay.textContent = '0.7';
        tokDisplay.textContent = '1024';
        populateProviders();
        updateStatus();
        save();
        localStorage.removeItem('raia_current_session');
        renderMessages({ forceScroll: true });
        toast('Everything has been reset', 'success');
    });

    /* ─── Loading UI ─── */
    function setLoadingUI(isLoading) {
        state.loading = isLoading;
        sendBtn.classList.toggle('stop-mode', isLoading);
        sendBtn.disabled = false;
        sendBtn.setAttribute('aria-label', isLoading ? 'Stop generating' : 'Send message');
        if (isLoading) {
            sendIcon.innerHTML = '<span class="spinner-ring"></span>';
        } else {
            sendIcon.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-send"/></svg>';
        }
    }

    /* ─── Send to AI ─── */
    async function sendToAI(userMsg) {
        if (state.loading) return;
        setLoadingUI(true);
        showTyping();
        abortController = new AbortController();

        try {
            if (!state.connected || !state.apiKey) throw new Error('NOT_CONNECTED');

            const provider = state.provider;
            const model = state.model;
            const apiKey = state.apiKey;
            const baseUrl = effectiveBaseUrl();
            const temp = state.temp;
            const maxTokens = state.maxTokens;

            const history = state.messages
                .filter(m => m.role !== 'system')
                .slice(-20)
                .map(m => ({ role: m.role, content: m.content }));

            let url, headers, body;

            if (provider === 'Gemini (Google)') {
                url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
                headers = { 'Content-Type': 'application/json' };
                let geminiHistory = history.map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));
                if (geminiHistory.length === 0) geminiHistory = [{ role: 'user', parts: [{ text: userMsg }] }];
                body = JSON.stringify({
                    contents: geminiHistory,
                    generationConfig: { temperature: temp, maxOutputTokens: maxTokens }
                });
            } else if (provider === 'Claude (Anthropic)') {
                url = `${baseUrl}/messages`;
                headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                };
                body = JSON.stringify({
                    model,
                    max_tokens: maxTokens,
                    temperature: temp,
                    messages: history.length > 0 ? history : [{ role: 'user', content: userMsg }]
                });
            } else {
                url = `${baseUrl}/chat/completions`;
                headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
                if (provider === 'OpenRouter') {
                    headers['HTTP-Referer'] = 'https://raia-ai.netlify.app';
                    headers['X-Title'] = 'RAIA';
                }
                body = JSON.stringify({
                    model,
                    temperature: temp,
                    max_tokens: maxTokens,
                    messages: history.length > 0 ? history : [{ role: 'user', content: userMsg }]
                });
            }

            ({ url, headers } = wrapForProxy(provider, url, headers));
            const resp = await fetch(url, { method: 'POST', headers, body, signal: abortController.signal });
            if (!resp.ok) throw new Error(await extractError(resp));

            const data = await resp.json();
            let reply = '';
            if (provider === 'Gemini (Google)') {
                reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '(Empty response)';
            } else if (provider === 'Claude (Anthropic)') {
                reply = data?.content?.map(b => b.text || '').join('') || '(Empty response)';
            } else {
                reply = data?.choices?.[0]?.message?.content || '(Empty response)';
            }

            hideTyping();
            addMessage('assistant', reply);
        } catch (err) {
            hideTyping();
            let errText;
            if (err.name === 'AbortError') {
                toast('Generation stopped', 'info');
                errText = null;
            } else if (err.message === 'NOT_CONNECTED') {
                errText = `**Not connected**\n\nMake sure your API Key is filled in and click **Connect** in the Settings panel.`;
            } else if (/401|unauthorized|invalid/i.test(err.message)) {
                errText = `**Invalid API Key**\n\nCheck your key, make sure there are no extra spaces, and that it has access to **${state.model}**.`;
            } else if (/429|rate/i.test(err.message)) {
                errText = `**Rate limit / quota exceeded**\n\nTry again later or check your provider dashboard.`;
            } else if (/404|not found/i.test(err.message)) {
                errText = `**Model not found**\n\nMake sure **${state.model}** is a valid, currently available model for **${PROVIDERS[state.provider]?.label}**.`;
            } else if (/fetch|network|load failed/i.test(err.message)) {
                errText = `**Connection failed**\n\n${friendlyError(err)}`;
            } else {
                errText = `**Error from ${PROVIDERS[state.provider]?.label || state.provider}**\n\n${err.message}`;
            }
            if (errText) addMessage('assistant', errText);
        } finally {
            setLoadingUI(false);
            abortController = null;
        }
    }

    /* ─── Chat form ─── */
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (state.loading) {
            if (abortController) abortController.abort();
            return;
        }
        const msg = prompt.value.trim();
        if (!msg) return;
        addMessage('user', msg);
        prompt.value = '';
        prompt.style.height = 'auto';
        updateCharCount();
        sendToAI(msg);
    });

    function updateCharCount() {
        const n = prompt.value.length;
        charCount.textContent = n === 0 ? '0 characters' : `${n} character${n === 1 ? '' : 's'}`;
    }

    prompt.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 140) + 'px';
        updateCharCount();
    });

    prompt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.requestSubmit();
        }
    });

    /* ─── Suggestion chips ─── */
    suggestionChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        prompt.value = (chip.dataset.prompt || '').replace(/\\n/g, '\n');
        prompt.dispatchEvent(new Event('input'));
        prompt.focus();
        prompt.setSelectionRange(prompt.value.length, prompt.value.length);
    });

    /* ─── Chat sessions ─── */
    function getSavedSessions() {
        try {
            return JSON.parse(localStorage.getItem('raia_chat_sessions') || '[]');
        } catch (_) { return []; }
    }

    function saveCurrentSession() {
        if (!state.messages || state.messages.length === 0) return;
        let sessions = getSavedSessions();

        let currentId = state.currentSessionId || state.chatId || Date.now().toString(36);
        state.currentSessionId = currentId;
        state.chatId = currentId;

        const firstUserMsg = state.messages.find(m => m.role === 'user');
        const title = firstUserMsg
            ? firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '…' : '')
            : 'New Chat';

        const sessionData = {
            id: currentId,
            title,
            date: new Date().toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            messages: state.messages.slice()
        };

        const existingIndex = sessions.findIndex(s => s.id === currentId);
        if (existingIndex >= 0) sessions[existingIndex] = sessionData;
        else sessions.unshift(sessionData);

        if (sessions.length > 50) sessions = sessions.slice(0, 50);

        localStorage.setItem('raia_chat_sessions', JSON.stringify(sessions));
        localStorage.setItem('raia_current_session', currentId);
    }

    function renderHistoryList() {
        const sessions = getSavedSessions();
        chatHistoryList.innerHTML = '';

        if (sessions.length === 0) {
            chatHistoryList.innerHTML = `
                <li class="history-empty">
                    <span class="empty-icon"><svg class="icon icon-lg" aria-hidden="true"><use href="#i-message-circle"/></svg></span>
                    <span>No conversation history yet.</span>
                    <span style="font-size:var(--text-xs);color:var(--text-quaternary);">Start a chat for a conversation.</span>
                </li>
            `;
            return;
        }

        sessions.forEach(session => {
            const li = document.createElement('li');
            li.className = `history-item ${session.id === state.currentSessionId ? 'active' : ''}`;
            li.innerHTML = `
                <div class="info">
                    <span class="title">${escapeHtml(session.title)}</span>
                    <span class="date">${escapeHtml(session.date)}</span>
                </div>
                <button class="del-btn" title="Delete chat" aria-label="Delete chat">&times;</button>
            `;

            li.addEventListener('click', (e) => {
                if (e.target.classList.contains('del-btn')) return;
                if (abortController) abortController.abort();
                state.currentSessionId = session.id;
                state.messages = session.messages.slice();
                state.chatId = session.id;
                renderMessages({ forceScroll: true });
                closeHistoryDrawer();
                save();
            });

            li.querySelector('.del-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                let updated = getSavedSessions().filter(s => s.id !== session.id);
                localStorage.setItem('raia_chat_sessions', JSON.stringify(updated));
                if (state.currentSessionId === session.id) {
                    state.messages = [];
                    state.currentSessionId = null;
                    state.chatId = Date.now().toString(36);
                    renderMessages({ forceScroll: true });
                    save();
                    localStorage.removeItem('raia_current_session');
                }
                renderHistoryList();
                toast('Chat deleted', 'info');
            });

            chatHistoryList.appendChild(li);
        });
    }

    function openHistoryDrawer() {
        renderHistoryList();
        historyDrawer.classList.add('open');
        historyOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeHistoryDrawer() {
        historyDrawer.classList.remove('open');
        historyOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    historyToggle.addEventListener('click', openHistoryDrawer);
    closeHistoryBtn.addEventListener('click', closeHistoryDrawer);
    historyOverlay.addEventListener('click', closeHistoryDrawer);

    newChatDrawerBtn.addEventListener('click', () => {
        if (abortController) abortController.abort();
        state.messages = [];
        state.currentSessionId = null;
        state.chatId = Date.now().toString(36);
        localStorage.removeItem('raia_current_session');
        renderMessages({ forceScroll: true });
        closeHistoryDrawer();
        save();
        toast('New chat started', 'success');
        prompt.focus();
    });

    /* ─── New chat (header) ─── */
    newChatBtn.addEventListener('click', () => {
        if (abortController) abortController.abort();
        state.messages = [];
        state.currentSessionId = null;
        state.chatId = Date.now().toString(36);
        localStorage.removeItem('raia_current_session');
        save();
        renderMessages({ forceScroll: true });
        toast('New chat created', 'success');
    });

    /* ─── Settings toggle ─── */
    settingsToggle.addEventListener('click', () => {
        const open = settingsPanel.classList.toggle('open');
        settingsToggle.setAttribute('aria-expanded', String(open));
        settingsToggle.classList.toggle('active', open);
        const label = settingsToggle.querySelector('.label');
        if (label) label.textContent = open ? 'Close' : 'Setup API';
    });

    /* ─── Theme ─── */
    function applyTheme() {
        document.documentElement.setAttribute('data-theme', state.theme);
        themeToggle.innerHTML = state.theme === 'dark'
            ? '<svg class="icon" aria-hidden="true"><use href="#i-sun"/></svg>'
            : '<svg class="icon" aria-hidden="true"><use href="#i-moon"/></svg>';
        updateLogo();
    }

    themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        save();
    });

    /* ─── Logo theme swap ─── */
    const LOGO_LIGHT = 'https://i.postimg.cc/GmWt2wch/H-blue.webp';
    const LOGO_DARK  = 'https://i.postimg.cc/8PJ0bhb1/H-haiere.webp';

    function updateLogo() {
        const isDark = state.theme === 'dark';
        const newSrc = isDark ? LOGO_DARK : LOGO_LIGHT;
        document.querySelectorAll('.logo-img').forEach(function (img) {
            if (img.getAttribute('src') === newSrc) return;
            img.classList.add('logo-switching');
            setTimeout(function () {
                img.src = newSrc;
                img.onload = function () {
                    img.classList.remove('logo-switching');
                    img.onload = null;
                };
                setTimeout(function () {
                    img.classList.remove('logo-switching');
                }, 400);
            }, 120);
        });
    }

    /* ─── Scroll progress & header shadow ─── */
    messages.addEventListener('scroll', () => {
        const max = messages.scrollHeight - messages.clientHeight;
        const pct = max > 0 ? (messages.scrollTop / max) * 100 : 0;
        scrollProgress.style.width = pct + '%';
        if (isNearBottom()) jumpBottom.classList.remove('show');
    });
    jumpBottom.addEventListener('click', () => scrollToBottom(true));

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }, { passive: true });

    /* ─── Spotlight ─── */
    let spotlightRaf = null;
    window.addEventListener('pointermove', (e) => {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        document.body.classList.add('has-mouse');
        if (spotlightRaf) cancelAnimationFrame(spotlightRaf);
        spotlightRaf = requestAnimationFrame(() => {
            spotlight.style.setProperty('--sx', e.clientX + 'px');
            spotlight.style.setProperty('--sy', e.clientY + 'px');
        });
    });

    /* ─── Button magnetic hover ─── */
    document.querySelectorAll('.icon-btn, .send-btn, .btn-primary, .btn-secondary, .donate-btn').forEach(btn => {
        btn.addEventListener('pointermove', (e) => {
            if (e.pointerType && e.pointerType !== 'mouse') return;
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.20;
            const y = (e.clientY - r.top - r.height / 2) * 0.20;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('pointerleave', () => {
            btn.style.transform = '';
        });
    });

    /* ─── Keyboard shortcuts ─── */
    document.addEventListener('keydown', (e) => {
        const ctrl = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();

        if (ctrl && key === 'h') {
            e.preventDefault();
            if (historyDrawer.classList.contains('open')) closeHistoryDrawer();
            else openHistoryDrawer();
        }
        if (ctrl && key === 'n') {
            e.preventDefault();
            newChatBtn.click();
        }
        if (ctrl && key === 'k') {
            e.preventDefault();
            prompt.focus();
        }
        if (ctrl && e.key === 'Enter') {
            e.preventDefault();
            chatForm.requestSubmit();
        }
        if (e.key === 'Escape' && settingsPanel.classList.contains('open')) {
            settingsToggle.click();
        }
        if (e.key === 'Escape' && historyDrawer.classList.contains('open')) {
            closeHistoryDrawer();
        }
    });

    /* ─── Save on exit ─── */
    window.addEventListener('beforeunload', () => {
        if (state.messages && state.messages.length > 0) saveCurrentSession();
    });

    /* ─── Boot ─── */
    load();
    populateProviders();
    updateStatus();
    applyTheme();
    renderMessages({ forceScroll: true });
    updateCharCount();

    if (state.apiKey) {
        apiKeyEl.value = state.apiKey;
        state.connected = true;
        updateStatus();
    }
    if (state.customBaseUrl) customBaseUrlEl.value = state.customBaseUrl;
    if (state.proxyUrl) proxyUrlEl.value = state.proxyUrl;
    rememberKeyEl.checked = state.rememberKey !== false;

    tempSlider.value = state.temp;
    tokSlider.value = state.maxTokens;
    tempDisplay.textContent = state.temp.toFixed(1);
    tokDisplay.textContent = state.maxTokens;

    if (state.currentSessionId) {
        const sessions = getSavedSessions();
        const found = sessions.find(s => s.id === state.currentSessionId);
        if (found && found.messages && found.messages.length > 0) {
            state.messages = found.messages.slice();
            renderMessages({ forceScroll: true });
        }
    }

    console.log(`RAIA — Reflecting Tomorrow · v${APP_VERSION} · Symmetric Intelligence`);
})();