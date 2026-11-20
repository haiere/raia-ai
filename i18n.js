/* ═══════════════════════════════════════════════════════
   RAIA · Reflecting Tomorrow · v1.2.6
   i18n.js: Bahasa Indonesia (id) dan English (en)
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const STORAGE_KEY = 'raia_lang';
    const DEFAULT_LANG = 'id';
    const LANGUAGES = ['id', 'en'];

    const dict = {
        id: {
            pageTitle: 'Raia AI: Reflecting Tomorrow',
            appTagline: 'Reflecting Tomorrow',
            versionTitle: 'Versi aplikasi',

            navChat: 'Chat',
            navSetting: 'Pengaturan',
            backToChat: 'Kembali ke Chat',
            navHistory: 'Riwayat',
            newChat: 'Chat baru',
            newChatTitle: 'Mulai chat baru (Ctrl+N)',
            historyTitle: 'Buka riwayat chat',
            closeHistory: 'Tutup riwayat',
            themeToggle: 'Ganti tema',
            support: 'Dukung',
            supportTitle: 'Traktir kopi untuk Hajir',
            skipLink: 'Lewati ke konten',

            welcomeTitle: 'Halo, ada yang bisa dibantu?',
            welcomeDesc: 'Raia terhubung ke beberapa penyedia AI memakai API key milikmu sendiri. Chat tersimpan hanya di browser ini.',
            chipExplain: 'Jelaskan konsep',
            chipWrite: 'Bantu menulis',
            chipCode: 'Tinjau kode',
            chipPlan: 'Buat rencana',
            promptExplain: 'Jelaskan konsep ini dengan bahasa sederhana: ',
            promptWrite: 'Bantu saya menulis dan merapikan teks berikut: ',
            promptCode: 'Tinjau dan perbaiki kode ini:\n\n',
            promptPlan: 'Buatkan rencana langkah demi langkah untuk: ',

            inputLabel: 'Pesan',
            inputPlaceholder: 'Tulis pesan kamu...',
            sendLabel: 'Kirim pesan',
            stopLabel: 'Hentikan jawaban',
            inputHint: 'Enter untuk kirim, Shift+Enter untuk baris baru',
            charCount: '{n} karakter',
            jumpBottom: 'Scroll Down',
            chooseModel: 'Pilih model',
            modelActive: 'Aktif',
            closeModels: 'Tutup pilihan model',

            noKeyBanner: 'API key belum diisi. Tambahkan dulu di pengaturan supaya Raia bisa menjawab.',
            goSetting: 'Buka pengaturan',

            toastEmpty: 'Tulis pesan dulu ya.',
            toastNoKey: 'Isi API key di pengaturan dulu.',
            toastCopied: 'Tersalin ke papan klip.',
            toastCopyFailed: 'Gagal menyalin. Coba salin secara manual.',
            toastSaved: 'Pengaturan tersimpan.',
            toastReset: 'Pengaturan dikembalikan ke awal.',
            toastDeleted: 'Chat dihapus.',
            toastStopped: 'Jawaban dihentikan.',
            toastOnline: 'Koneksi internet kembali.',
            toastOffline: 'Internet terputus.',

            setTitle: 'Pengaturan',
            setDesc: 'Atur penyedia, model, dan API key kamu. Semua disimpan di browser ini.',
            language: 'Bahasa',
            provider: 'Penyedia',
            model: 'Model',
            modelPlaceholder: 'Pilih atau ketik ID model',
            modelCustom: '(kustom)',
            apiKey: 'API key',
            apiKeyPlaceholder: 'Tempel API key kamu',
            showKey: 'Tampilkan key',
            hideKey: 'Sembunyikan key',
            getKey: 'Ambil API key',
            rememberKey: 'Ingat key di browser ini',
            keyNote: 'Key hanya dikirim ke penyedia yang kamu pilih.',
            connect: 'Simpan',
            test: 'Tes koneksi',
            testing: 'Mengetes...',
            statusOn: 'Terhubung',
            statusOff: 'Belum terhubung',
            pingOk: 'Koneksi ke {provider} berhasil.',
            pingFail: 'Koneksi gagal: {msg}',
            advanced: 'Lanjutan',
            baseUrl: 'Base URL kustom (opsional)',
            baseUrlPlaceholder: 'Kosongkan untuk memakai default penyedia',
            proxy: 'Proxy CORS (opsional)',
            proxyPlaceholder: 'Contoh: https://worker-kamu.workers.dev',
            temp: 'Kreativitas',
            maxTok: 'Panjang jawaban maks',
            resetAll: 'Reset semua',

            you: 'Kamu',
            assistant: 'Raia',
            typing: 'Raia sedang menulis',
            copy: 'Salin',
            copyCode: 'Salin kode',
            codeCopied: 'Kode tersalin',
            regenerate: 'Ulangi',

            historyHeading: 'Riwayat',
            historyEmpty: 'Belum ada riwayat chat.',
            untitled: 'Chat tanpa judul',
            deleteChat: 'Hapus chat',
            clearAllHistory: 'Hapus semua riwayat',
            confirmClearAll: 'Yakin ingin menghapus semua riwayat chat? Tindakan ini tidak bisa dibatalkan.',
            confirmReset: 'Kembalikan semua pengaturan ke awal? API key juga akan dihapus. Riwayat chat tetap tersimpan.',

            errNoKeyTitle: 'API key belum diisi',
            errNoKeyBody: 'Buka pengaturan, masukkan API key {provider}, lalu tekan Simpan.',
            errAuthTitle: 'API key tidak diterima',
            errAuthBody: 'Periksa kembali key kamu di {provider}. Pastikan key masih aktif.',
            errRateTitle: 'Batas permintaan tercapai',
            errRateBody: 'Tunggu sebentar lalu coba lagi, atau cek kuota akun kamu.',
            errModelTitle: 'Model tidak ditemukan',
            errModelBody: 'Model {model} tidak tersedia di {provider}. Pilih model lain di pengaturan.',
            errNetTitle: 'Koneksi bermasalah',
            errNetBody: 'Periksa internet kamu lalu coba lagi. Jika memakai proxy, pastikan proxy aktif.',
            errCorsBody: 'Browser memblokir permintaan ke {provider}. Isi Proxy CORS di pengaturan lanjutan.',
            errTimeoutBody: 'Permintaan terlalu lama. Coba lagi atau pilih model yang lebih ringan.',
            errGenericTitle: 'Ada kendala',
            errGenericBody: 'Permintaan belum berhasil. Coba lagi sebentar lagi.',
            emptyReply: '(Jawaban kosong)',
            loadModels: 'Muat model',
            modelIdLabel: 'ID model kustom (opsional)',
            useOwnKey: 'Pakai API key sendiri',
            providerLabel: 'Provider',
            providerBackup: 'Backup',
            quotaLeft: 'Sisa {n} pesan gratis hari ini',
            quotaEmpty: 'Kuota gratis hari ini habis',
            errQuotaBody: 'Kuota API gratis hari ini sudah habis. Pakai API key sendiri untuk lanjut.',
            errRateLimitTitle: 'Terlalu cepat',
            errRateLimitBody: 'Terlalu banyak permintaan dalam waktu singkat. Tunggu sebentar lalu coba lagi.',
            modelsNoList: 'Provider ini tidak menyediakan daftar model. Memakai daftar bawaan.',
            modelsEmpty: 'Tidak ada model chat yang ditemukan.',
            modelsLoaded: '{n} model dimuat.',
            modelsFail: 'Gagal memuat model: {msg}',
            keyManagedInCustom: 'Diatur di Custom API',
            customApiTitle: 'Custom API',
            customApiDesc: 'Tambahkan penyedia lain yang kompatibel dengan format OpenAI, Gemini, atau Anthropic. Key disimpan di browser ini dan tidak ditampilkan lagi setelah disimpan.',
            customAddTitle: 'Tambah Custom API',
            customEditTitle: 'Ubah Custom API',
            customLabelField: 'Nama provider',
            customLabelPlaceholder: 'Contoh: Provider Saya',
            customCompatField: 'Jenis API',
            customBaseUrlField: 'Endpoint (base URL)',
            customModelField: 'ID model',
            customKeyField: 'API key',
            customSave: 'Simpan',
            customUpdate: 'Perbarui',
            customCancel: 'Batal',
            customListTitle: 'Daftar custom API',
            customKeySaved: 'Tersimpan. Kosongkan jika tidak diganti.',
            customEmpty: 'Belum ada custom API.',
            customUse: 'Pakai',
            customEdit: 'Ubah',
            customDelete: 'Hapus',
            customConfirmDelete: 'Hapus custom API "{name}"?',
            customErrLabel: 'Nama provider wajib diisi.',
            customErrLabelLong: 'Nama provider maksimal 40 karakter.',
            customErrUrlEmpty: 'Endpoint wajib diisi.',
            customErrUrl: 'Endpoint harus berupa URL yang valid.',
            customErrUrlScheme: 'Endpoint harus memakai https (http hanya untuk localhost).',
            customErrModel: 'ID model wajib diisi dan tidak boleh mengandung spasi.',
            customErrCompat: 'Jenis kompatibilitas tidak dikenal.',
            customErrKey: 'API key wajib diisi.'
        },

        en: {
            pageTitle: 'Raia AI: Reflecting Tomorrow',
            appTagline: 'Reflecting Tomorrow',
            versionTitle: 'App version',

            navChat: 'Chat',
            navSetting: 'Settings',
            backToChat: 'Back to Chat',
            navHistory: 'History',
            newChat: 'New chat',
            newChatTitle: 'Start a new chat (Ctrl+N)',
            historyTitle: 'Open chat history',
            closeHistory: 'Close history',
            themeToggle: 'Toggle theme',
            support: 'Support',
            supportTitle: 'Buy Hajir a coffee',
            skipLink: 'Skip to content',

            welcomeTitle: 'Hi, how can I help?',
            welcomeDesc: 'Raia connects to several AI providers with your own API key. Chats are stored only in this browser.',
            chipExplain: 'Explain a concept',
            chipWrite: 'Help me write',
            chipCode: 'Review code',
            chipPlan: 'Make a plan',
            promptExplain: 'Explain this concept in simple terms: ',
            promptWrite: 'Help me write and polish this text: ',
            promptCode: 'Review and fix this code:\n\n',
            promptPlan: 'Give me a step-by-step plan for: ',

            inputLabel: 'Message',
            inputPlaceholder: 'Type your message...',
            sendLabel: 'Send message',
            stopLabel: 'Stop answer',
            inputHint: 'Enter to send, Shift+Enter for a new line',
            charCount: '{n} characters',
            jumpBottom: 'Scroll Down',
            chooseModel: 'Choose model',
            modelActive: 'Active',
            closeModels: 'Close model list',

            noKeyBanner: 'No API key yet. Add one in settings so Raia can reply.',
            goSetting: 'Open settings',

            toastEmpty: 'Write a message first.',
            toastNoKey: 'Add your API key in settings first.',
            toastCopied: 'Copied to clipboard.',
            toastCopyFailed: 'Copy failed. Try copying it manually.',
            toastSaved: 'Settings saved.',
            toastReset: 'Settings were reset.',
            toastDeleted: 'Chat deleted.',
            toastStopped: 'Answer stopped.',
            toastOnline: 'Back online.',
            toastOffline: 'Internet connection lost.',

            setTitle: 'Settings',
            setDesc: 'Choose a provider, a model, and your API key. Everything is saved in this browser.',
            language: 'Language',
            provider: 'Provider',
            model: 'Model',
            modelPlaceholder: 'Choose or type a model ID',
            modelCustom: '(custom)',
            apiKey: 'API key',
            apiKeyPlaceholder: 'Paste your API key',
            showKey: 'Show key',
            hideKey: 'Hide key',
            getKey: 'Get an API key',
            rememberKey: 'Remember key in this browser',
            keyNote: 'The key is sent only to the provider you choose.',
            connect: 'Save',
            test: 'Test connection',
            testing: 'Testing...',
            statusOn: 'Connected',
            statusOff: 'Not connected',
            pingOk: 'Connected to {provider}.',
            pingFail: 'Connection failed: {msg}',
            advanced: 'Advanced',
            baseUrl: 'Custom base URL (optional)',
            baseUrlPlaceholder: 'Leave empty to use the provider default',
            proxy: 'CORS proxy (optional)',
            proxyPlaceholder: 'For example: https://your-worker.workers.dev',
            temp: 'Creativity',
            maxTok: 'Max answer length',
            resetAll: 'Reset all',

            you: 'You',
            assistant: 'Raia',
            typing: 'Raia is writing',
            copy: 'Copy',
            copyCode: 'Copy code',
            codeCopied: 'Code copied',
            regenerate: 'Retry',

            historyHeading: 'History',
            historyEmpty: 'No chat history yet.',
            untitled: 'Untitled chat',
            deleteChat: 'Delete chat',
            clearAllHistory: 'Clear all history',
            confirmClearAll: 'Delete all chat history? This cannot be undone.',
            confirmReset: 'Reset all settings to the defaults? Your API key will be removed. Chat history is kept.',

            errNoKeyTitle: 'No API key yet',
            errNoKeyBody: 'Open settings, paste your {provider} API key, then press Save.',
            errAuthTitle: 'API key not accepted',
            errAuthBody: 'Check your key on {provider}. Make sure it is still active.',
            errRateTitle: 'Request limit reached',
            errRateBody: 'Wait a moment and try again, or check your account quota.',
            errModelTitle: 'Model not found',
            errModelBody: 'The model {model} is not available on {provider}. Pick another one in settings.',
            errNetTitle: 'Connection problem',
            errNetBody: 'Check your internet and try again. If you use a proxy, make sure it is running.',
            errCorsBody: 'The browser blocked the request to {provider}. Add a CORS proxy in advanced settings.',
            errTimeoutBody: 'The request took too long. Try again or pick a lighter model.',
            errGenericTitle: 'Something went wrong',
            errGenericBody: 'The request did not go through. Please try again in a moment.',
            emptyReply: '(Empty answer)',
            loadModels: 'Load models',
            modelIdLabel: 'Custom model ID (optional)',
            useOwnKey: 'Use your own API key',
            providerLabel: 'Provider',
            providerBackup: 'Backup',
            quotaLeft: '{n} free messages left today',
            quotaEmpty: 'Today’s free quota is used up',
            errQuotaBody: 'Today’s free API quota is used up. Use your own API key to continue.',
            errRateLimitTitle: 'Too fast',
            errRateLimitBody: 'Too many requests in a short time. Wait a moment and try again.',
            modelsNoList: 'This provider does not list its models. Using the built-in list.',
            modelsEmpty: 'No chat models were found.',
            modelsLoaded: '{n} models loaded.',
            modelsFail: 'Could not load models: {msg}',
            keyManagedInCustom: 'Managed in Custom API',
            customApiTitle: 'Custom API',
            customApiDesc: 'Add another provider that is compatible with the OpenAI, Gemini, or Anthropic format. The key is stored in this browser and is not shown again after saving.',
            customAddTitle: 'Add Custom API',
            customEditTitle: 'Edit Custom API',
            customLabelField: 'Provider name',
            customLabelPlaceholder: 'For example: My Provider',
            customCompatField: 'API type',
            customBaseUrlField: 'Endpoint (base URL)',
            customModelField: 'Model ID',
            customKeyField: 'API key',
            customSave: 'Save',
            customUpdate: 'Update',
            customCancel: 'Cancel',
            customListTitle: 'Custom API list',
            customKeySaved: 'Saved. Leave empty to keep it.',
            customEmpty: 'No custom APIs yet.',
            customUse: 'Use',
            customEdit: 'Edit',
            customDelete: 'Delete',
            customConfirmDelete: 'Delete custom API "{name}"?',
            customErrLabel: 'Provider name is required.',
            customErrLabelLong: 'Provider name can be at most 40 characters.',
            customErrUrlEmpty: 'Endpoint is required.',
            customErrUrl: 'Endpoint must be a valid URL.',
            customErrUrlScheme: 'Endpoint must use https (http is only allowed for localhost).',
            customErrModel: 'Model ID is required and cannot contain spaces.',
            customErrCompat: 'Unknown API type.',
            customErrKey: 'API key is required.'
        }
    };

    let current = DEFAULT_LANG;

    function detectLang() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (LANGUAGES.includes(saved)) return saved;
        } catch (_) { /* storage can be blocked */ }
        const nav = (navigator.language || '').toLowerCase();
        return nav.startsWith('en') ? 'en' : DEFAULT_LANG;
    }

    function t(key, vars) {
        const table = dict[current] || dict[DEFAULT_LANG];
        const str = table[key] !== undefined ? table[key] : (dict.en[key] !== undefined ? dict.en[key] : key);
        if (!vars) return str;
        return str.replace(/\{(\w+)\}/g, (match, name) =>
            Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
        );
    }

    function apply(root) {
        const scope = root || document;
        scope.querySelectorAll('[data-i18n]').forEach((el) => {
            el.textContent = t(el.dataset.i18n);
        });
        scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
        });
        scope.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
            el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
        });
        scope.querySelectorAll('[data-i18n-title]').forEach((el) => {
            el.setAttribute('title', t(el.dataset.i18nTitle));
        });
        document.documentElement.lang = current;
        document.title = t('pageTitle');
    }

    function setLang(lang) {
        if (!LANGUAGES.includes(lang) || lang === current) return;
        current = lang;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }
        apply();
        window.dispatchEvent(new CustomEvent('raia:langchange', { detail: lang }));
    }

    function getLang() {
        return current;
    }

    current = detectLang();

    window.I18N = { t, apply, setLang, getLang, languages: LANGUAGES.slice() };
})();
