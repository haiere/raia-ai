/* ═══════════════════════════════════════════════
   RAIA — Reflecting Tomorrow  ·  v1.2.1
   i18n.js — Lightweight internationalization
   Supports: Bahasa Indonesia (id) & English (en)
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    const STORAGE_KEY = 'raia_language';
    const SUPPORTED_LANGUAGES = ['id', 'en'];

    const translations = {
        id: {
            /* ─── App ─── */
            pageTitle: 'Raia AI — Asisten AI Percakapan',
            appName: 'Raia AI',
            appTagline: 'Reflecting Tomorrow',
            versionTitle: 'Versi aplikasi',

            /* ─── Header ─── */
            settingsOpen: 'Atur API',
            settingsClose: 'Tutup',
            settingsAria: 'Buka pengaturan',
            support: 'Dukung',
            supportTitle: 'Dukung Raia AI — traktir kopi',
            toggleTheme: 'Ganti tema warna',
            newChat: 'Percakapan baru',
            newChatTitle: 'Percakapan baru (Ctrl+N)',
            history: 'Riwayat',
            historyTitle: 'Buka riwayat percakapan (Ctrl+H)',
            closeHistory: 'Tutup riwayat',
            clearChat: 'Hapus chat',
            clearChatTitle: 'Hapus seluruh percakapan ini',

            /* ─── Settings ─── */
            settingsRegion: 'Pengaturan',
            language: 'Bahasa',
            provider: 'Provider',
            model: 'Model',
            modelCustom: '(khusus)',
            chooseModel: 'Pilih atau ketik id model…',
            apiKey: 'API Key',
            apiKeyPlaceholder: 'sk-...',
            showHideKey: 'Tampilkan atau sembunyikan API key',
            rememberKey: 'Ingat',
            getApiKey: 'Dapatkan API key',
            connect: 'Hubungkan',
            testConnection: 'Tes',
            statusConnected: 'Terhubung',
            statusDisconnected: 'Belum terhubung',
            online: 'Online',
            offline: 'Offline',
            advanced: 'Lanjutan',
            customBaseUrl: 'Custom Base URL (opsional)',
            customBaseUrlPlaceholder: 'Kosongkan untuk memakai bawaan provider',
            defaultPrefix: 'Bawaan:',
            proxyUrl: 'CORS Proxy URL (opsional — diperlukan untuk OpenAI / Perplexity / Mistral)',
            proxyUrlPlaceholder: 'mis. https://worker-kamu.workers.dev',
            temp: 'Temp',
            maxTokens: 'Maks Token',
            resetAll: 'Reset semua',
            resetConfirm: 'Reset seluruh riwayat chat dan konfigurasi? Tindakan ini tidak bisa dibatalkan.',

            /* ─── Welcome / empty state ─── */
            welcomeTitle: 'Raia AI — Reflecting Tomorrow',
            welcomeDesc1: 'Isi',
            welcomeDescKey: 'API key',
            welcomeDesc2: 'di Pengaturan, pilih provider dan model, lalu mulai ngobrol. Raia siap membantu.',
            featurePrivate: 'Privat',
            featureFast: 'Cepat',
            featureMulti: 'Multi-model',
            chipExplain: 'Jelaskan konsep',
            chipWrite: 'Tulis sesuatu',
            chipReview: 'Review kode',
            chipPlan: 'Buat rencana',
            coffeePrompt: 'Raia membantu? Traktir kopi, yuk',

            /* ─── Input ─── */
            typeMessage: 'Tulis pesan… (Enter untuk kirim, Shift+Enter untuk baris baru)',
            messageLabel: 'Pesan',
            send: 'Kirim',
            sendLabel: 'Kirim pesan',
            sendingLabel: 'Sedang mengirim pesan',
            stopGenerating: 'Hentikan',
            stopLabel: 'Hentikan generasi',
            charCount: '{n} karakter',
            hintSend: 'untuk kirim',
            hintNewline: 'baris baru',
            hintFocus: 'fokus',
            jumpBottom: 'Pesan baru',

            /* ─── Chat ─── */
            typingLabel: 'Raia sedang mengetik',
            thinking: 'Sedang berpikir…',
            copy: 'Salin',
            copied: 'Tersalin',
            regenerate: 'Buat ulang',
            retry: 'Coba lagi',
            emptyChat: 'Belum ada pesan.',
            emptyResponse: '(Respons kosong)',

            /* ─── Toasts & dialogs ─── */
            toastCopied: 'Tersalin ke clipboard',
            toastCopyFailed: 'Tidak bisa menyalin — salin manual, ya',
            toastStopped: 'Dithentikan',
            toastKeyEmpty: 'API key tidak boleh kosong',
            toastEnterKeyFirst: 'Isi API key dulu, ya',
            toastConnectedSaved: 'Tersambung & tersimpan',
            toastKeyApplied: 'API key dipakai — silakan mulai chat!',
            toastRememberOn: 'API key akan diingat di perangkat ini',
            toastRememberOff: 'API key hanya disimpan untuk sesi ini',
            corsWarning: '{provider} memblokir panggilan langsung dari browser (CORS). Isi CORS Proxy URL di bagian Lanjutan, atau pindah ke OpenRouter.',
            pingSuccess: 'Koneksi ke {provider} berhasil',
            pingFailed: 'Tes gagal: ',
            pinging: 'Mengetes…',
            toastNewChat: 'Percakapan baru dimulai',
            toastNewChatCreated: 'Percakapan baru dibuat',
            toastChatDeleted: 'Percakapan dihapus',
            toastChatCleared: 'Chat dihapus',
            toastAllReset: 'Semuanya sudah direset',
            toastOffline: 'Koneksi internet terputus',
            toastOnline: 'Koneksi internet kembali',
            deleteChatConfirm: 'Hapus percakapan ini?',
            deleteChat: 'Hapus chat',
            newChatDrawer: 'Percakapan Baru',
            historyEmpty: 'Belum ada riwayat percakapan.',
            historyEmptyHint: 'Mulai chat untuk membuat percakapan baru.',
            confirmClear: 'Hapus seluruh percakapan ini?',
            cancel: 'Batal',
            confirm: 'Konfirmasi',
            errorGeneric: 'Terjadi kesalahan. Coba lagi, ya.',
            timedOut: 'Permintaan memakan waktu terlalu lama dan sudah dihentikan. Coba lagi, ya.',
            mathRenderError: 'Gagal menampilkan rumus',

            /* ─── Error states (rendered as chat messages) ─── */
            errNotConnectedTitle: 'Belum terhubung',
            errNotConnectedBody: 'Pastikan API key sudah diisi, lalu klik **Hubungkan** di panel Pengaturan.',
            errInvalidKeyTitle: 'API key tidak valid',
            errInvalidKeyBody: 'Cek key-mu, pastikan tidak ada spasi berlebih, dan key itu punya akses ke **{model}**.',
            errRateLimitTitle: 'Rate limit / kuota habis',
            errRateLimitBody: 'Coba beberapa saat lagi, atau cek dashboard provider-mu.',
            errModelNotFoundTitle: 'Model tidak ditemukan',
            errModelNotFoundBody: 'Pastikan **{model}** adalah model yang valid dan masih tersedia di **{provider}**.',
            errConnectionTitle: 'Koneksi gagal',
            errProviderTitle: 'Error dari {provider}'
        },

        en: {
            /* ─── App ─── */
            pageTitle: 'Raia AI — AI Chat Assistant',
            appName: 'Raia AI',
            appTagline: 'Reflecting Tomorrow',
            versionTitle: 'Application version',

            /* ─── Header ─── */
            settingsOpen: 'Setup API',
            settingsClose: 'Close',
            settingsAria: 'Open settings',
            support: 'Support',
            supportTitle: 'Support Raia AI — buy me a coffee',
            toggleTheme: 'Toggle color theme',
            newChat: 'New chat',
            newChatTitle: 'New chat (Ctrl+N)',
            history: 'History',
            historyTitle: 'Open chat history (Ctrl+H)',
            closeHistory: 'Close history',
            clearChat: 'Clear chat',
            clearChatTitle: 'Clear entire conversation',

            /* ─── Settings ─── */
            settingsRegion: 'Settings',
            language: 'Language',
            provider: 'Provider',
            model: 'Model',
            modelCustom: '(custom)',
            chooseModel: 'Choose or type a model id…',
            apiKey: 'API Key',
            apiKeyPlaceholder: 'sk-...',
            showHideKey: 'Show or hide API key',
            rememberKey: 'Remember',
            getApiKey: 'Get API key',
            connect: 'Connect',
            testConnection: 'Test',
            statusConnected: 'Connected',
            statusDisconnected: 'Disconnected',
            online: 'Online',
            offline: 'Offline',
            advanced: 'Advanced',
            customBaseUrl: 'Custom Base URL (optional)',
            customBaseUrlPlaceholder: 'Leave empty to use the provider default',
            defaultPrefix: 'Default:',
            proxyUrl: 'CORS Proxy URL (optional — needed for OpenAI / Perplexity / Mistral)',
            proxyUrlPlaceholder: 'e.g. https://your-worker.workers.dev',
            temp: 'Temp',
            maxTokens: 'Max Tok',
            resetAll: 'Reset all',
            resetConfirm: 'Reset all chat history and configuration? This cannot be undone.',

            /* ─── Welcome / empty state ─── */
            welcomeTitle: 'Raia AI — Reflecting Tomorrow',
            welcomeDesc1: 'Configure your',
            welcomeDescKey: 'API key',
            welcomeDesc2: 'in Settings, pick a provider and model, then start the conversation. Raia is ready to help.',
            featurePrivate: 'Private',
            featureFast: 'Fast',
            featureMulti: 'Multi-model',
            chipExplain: 'Explain a concept',
            chipWrite: 'Write something',
            chipReview: 'Review code',
            chipPlan: 'Make a plan',
            coffeePrompt: 'Enjoying Raia? Buy me a coffee',

            /* ─── Input ─── */
            typeMessage: 'Type a message… (Enter to send, Shift+Enter for new line)',
            messageLabel: 'Message',
            send: 'Send',
            sendLabel: 'Send message',
            sendingLabel: 'Sending message',
            stopGenerating: 'Stop',
            stopLabel: 'Stop generation',
            charCount: '{n} character(s)',
            hintSend: 'to send',
            hintNewline: 'new line',
            hintFocus: 'focus',
            jumpBottom: 'New messages',

            /* ─── Chat ─── */
            typingLabel: 'Raia is typing',
            thinking: 'Thinking…',
            copy: 'Copy',
            copied: 'Copied',
            regenerate: 'Regenerate',
            retry: 'Retry',
            emptyChat: 'No messages yet.',
            emptyResponse: '(Empty response)',

            /* ─── Toasts & dialogs ─── */
            toastCopied: 'Copied to clipboard',
            toastCopyFailed: 'Could not copy — please copy manually',
            toastStopped: 'Generation stopped',
            toastKeyEmpty: 'API key cannot be empty',
            toastEnterKeyFirst: 'Enter an API key first',
            toastConnectedSaved: 'Connected & saved',
            toastKeyApplied: 'API key applied — you can now chat!',
            toastRememberOn: 'API key will be remembered on this device',
            toastRememberOff: 'API key will only be kept for this session',
            corsWarning: '{provider} blocks direct browser requests (CORS). Set a CORS Proxy URL under Advanced, or switch to OpenRouter.',
            pingSuccess: 'Ping successful to {provider}',
            pingFailed: 'Ping failed: ',
            pinging: 'Pinging…',
            toastNewChat: 'New chat started',
            toastNewChatCreated: 'New chat created',
            toastChatDeleted: 'Chat deleted',
            toastChatCleared: 'Chat cleared',
            toastAllReset: 'Everything has been reset',
            toastOffline: 'Internet connection lost',
            toastOnline: 'Back online',
            deleteChatConfirm: 'Delete this conversation?',
            deleteChat: 'Delete chat',
            newChatDrawer: 'New Chat',
            historyEmpty: 'No conversation history yet.',
            historyEmptyHint: 'Start a chat to create a conversation.',
            confirmClear: 'Clear this entire conversation?',
            cancel: 'Cancel',
            confirm: 'Confirm',
            errorGeneric: 'Something went wrong. Please try again.',
            timedOut: 'The request took too long and was stopped. Please try again.',
            mathRenderError: 'Failed to render formula',

            /* ─── Error states (rendered as chat messages) ─── */
            errNotConnectedTitle: 'Not connected',
            errNotConnectedBody: 'Make sure your API key is filled in, then click **Connect** in the Settings panel.',
            errInvalidKeyTitle: 'Invalid API key',
            errInvalidKeyBody: 'Check your key, make sure there are no extra spaces, and that it has access to **{model}**.',
            errRateLimitTitle: 'Rate limit / quota exceeded',
            errRateLimitBody: 'Try again in a moment, or check your provider dashboard.',
            errModelNotFoundTitle: 'Model not found',
            errModelNotFoundBody: 'Make sure **{model}** is a valid, currently available model for **{provider}**.',
            errConnectionTitle: 'Connection failed',
            errProviderTitle: 'Error from {provider}'
        }
    };

    let currentLanguage = detectInitialLanguage();
    const listeners = [];

    function detectInitialLanguage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && SUPPORTED_LANGUAGES.indexOf(saved) !== -1) return saved;
        } catch (_) { /* storage unavailable — fall through */ }

        const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (nav.indexOf('id') === 0) return 'id';
        return 'en';
    }

    function getCurrentLanguage() {
        return currentLanguage;
    }

    function setLanguage(language) {
        if (SUPPORTED_LANGUAGES.indexOf(language) === -1) language = 'en';
        if (language === currentLanguage) {
            applyTranslations();
            return;
        }
        currentLanguage = language;
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch (_) { /* ignore */ }
        document.documentElement.lang = language;
        applyTranslations();
        listeners.forEach(function (cb) {
            try { cb(language); } catch (_) { /* listener errors must not break i18n */ }
        });
    }

    function translate(key, fallback) {
        const dict = translations[currentLanguage] || {};
        if (Object.prototype.hasOwnProperty.call(dict, key) && dict[key] != null) {
            return dict[key];
        }
        const en = translations.en || {};
        if (Object.prototype.hasOwnProperty.call(en, key) && en[key] != null) {
            return en[key];
        }
        if (fallback !== undefined && fallback !== null) return fallback;
        return key;
    }

    function t(key, fallback) {
        return translate(key, fallback);
    }

    function applyTranslations() {
        document.documentElement.lang = currentLanguage;

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            el.textContent = translate(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-placeholder');
            if (!key) return;
            el.setAttribute('placeholder', translate(key));
        });

        document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-title');
            if (!key) return;
            el.setAttribute('title', translate(key));
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-aria-label');
            if (!key) return;
            el.setAttribute('aria-label', translate(key));
        });
    }

    function onLanguageChange(callback) {
        if (typeof callback === 'function') listeners.push(callback);
    }

    document.documentElement.lang = currentLanguage;

    window.I18N = {
        t: t,
        translate: translate,
        setLanguage: setLanguage,
        getCurrentLanguage: getCurrentLanguage,
        applyTranslations: applyTranslations,
        onLanguageChange: onLanguageChange,
        languages: SUPPORTED_LANGUAGES.slice()
    };
})(); 
