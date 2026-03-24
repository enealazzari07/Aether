// Surface fatal renderer errors in the UI so "all buttons dead" isn't silent.
(function () {
    function ensureFatalOverlay() {
        let el = document.getElementById('fatal-overlay');
        if (el) return el;
        el = document.createElement('div');
        el.id = 'fatal-overlay';
        el.style.cssText = [
            'position:fixed',
            'left:12px',
            'bottom:12px',
            'max-width:560px',
            'padding:10px 12px',
            'border-radius:10px',
            'background:rgba(255,255,255,0.96)',
            'box-shadow:0 14px 40px rgba(0,0,0,0.18)',
            'border:1px solid rgba(0,0,0,0.08)',
            'font:12px/1.35 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif',
            'color:#1d1d1f',
            'z-index:999999',
            'display:none',
        ].join(';');
        el.innerHTML = `<div style="font-weight:700; margin-bottom:4px;">UI-Fehler</div><div id="fatal-overlay-msg"></div>`;
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(el), { once: true });
        return el;
    }
    function showFatal(msg) {
        try {
            const el = ensureFatalOverlay();
            const msgEl = document.getElementById('fatal-overlay-msg');
            if (msgEl) msgEl.textContent = String(msg || 'Unbekannter Fehler');
            el.style.display = 'block';
        } catch {
            // ignore
        }
    }
    window.addEventListener('error', (e) => {
        const m = e && e.message ? e.message : 'Uncaught error';
        showFatal(m);
    });
    window.addEventListener('unhandledrejection', (e) => {
        const r = e && e.reason ? e.reason : 'Unhandled rejection';
        showFatal(r && r.message ? r.message : String(r));
    });
})();
function init() {
    // --- Umfassender Dark Mode Fix für alle UI-Elemente ---
    if (!document.getElementById('aether-dark-theme-styles')) {
        const style = document.createElement('style');
        style.id = 'aether-dark-theme-styles';
        style.textContent = `
            /* Aether Force Dark Mode Overrides */
            :root.theme-dark {
                --bg-primary: #121212 !important; /* Outer window background */
                --bg-secondary: #1a1a1a !important; /* Inner main stage */
                --bg-tertiary: #272727 !important; /* Input fields, Cards */
                --bg-hover: #333333 !important;
                --text-primary: #f5f5f7 !important;
                --text-secondary: #a1a1aa !important;
                --border-color: rgba(255, 255, 255, 0.08) !important;
                --accent-color: #0a84ff !important;
            }
            
            /* Base Layers */
            .theme-dark body, .theme-dark .sidebar, .theme-dark .win-title-bar, .theme-dark .history-sidebar, .theme-dark .ai-sidebar, .theme-dark .search-sidebar {
                background-color: var(--bg-primary) !important;
                color: var(--text-primary) !important;
            }
            
            /* Main Stage */
            .theme-dark .main-stage, .theme-dark .app-header, .theme-dark .tabs-container, .theme-dark .viewport-shell, .theme-dark .splash-view, .theme-dark .settings-view, .theme-dark .explorer-view, .theme-dark #view-layer, .theme-dark #news-view {
                background-color: var(--bg-secondary) !important;
                color: var(--text-primary) !important;
            }
            
            /* AI Sidebar Header & Footer Blur in Dark Mode */
            .theme-dark .ai-header, .theme-dark .ai-input-wrapper {
                background: rgba(26, 26, 26, 0.65) !important;
                backdrop-filter: blur(16px) saturate(150%) !important;
                -webkit-backdrop-filter: blur(16px) saturate(150%) !important;
                background: var(--bg-primary) !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                border: none !important;
            }
            
            /* Borders */
            .theme-dark .sidebar-header, .theme-dark .settings-title, .theme-dark .explorer-top {
                border-color: var(--border-color) !important;
            }

            /* Inputs & Forms */
            .theme-dark input, .theme-dark select, .theme-dark textarea, .theme-dark .explorer-search-input, .theme-dark .address-bar-capsule, .theme-dark .ai-input-box {
                background-color: var(--bg-tertiary) !important;
                color: var(--text-primary) !important;
                border: none !important;
            }
            .theme-dark input::placeholder, .theme-dark textarea::placeholder {
                color: var(--text-secondary) !important;
            }
            
            /* Tabs */
            .theme-dark .tab {
                background-color: var(--bg-primary) !important;
                border: 1px solid var(--border-color) !important;
                color: var(--text-secondary) !important;
            }
            .theme-dark .tab.active {
                background-color: var(--bg-secondary) !important;
                color: var(--text-primary) !important;
                border-bottom: none !important;
            }
            
            /* Cards, Panels & Popups */
            .theme-dark .settings-card, .theme-dark .search-result-item, .theme-dark .history-item, .theme-dark .home-search-box, .theme-dark .ai-mode-popup, .theme-dark .address-suggestions {
                background-color: var(--bg-tertiary) !important;
                border: none !important;
                color: var(--text-primary) !important;
                box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
            }
            
            /* AI Messages */
            .message {
                border: none !important;
                border-bottom: none !important;
                border-radius: 18px !important;
                padding: 12px 16px !important;
                margin-bottom: 12px !important;
                line-height: 1.5 !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
            }
            .theme-dark .message.bot {
                background-color: var(--bg-tertiary) !important;
                color: var(--text-primary) !important;
                border-bottom-left-radius: 4px !important;
            }
            .theme-dark .message.user {
                background-color: var(--accent-color) !important;
                color: #ffffff !important;
                border-color: transparent !important;
                border-bottom-right-radius: 4px !important;
            }
            
            /* AI Vorschläge und Willkommenstext */
            .theme-dark .ai-suggestion-btn {
                background: rgba(255, 255, 255, 0.05) !important;
                color: var(--text-primary) !important;
                border: none !important;
            }
            .theme-dark .ai-suggestion-btn:hover {
                background: rgba(255, 255, 255, 0.1) !important;
            }
            .theme-dark .ai-welcome-text { color: var(--text-primary) !important; }
            
            /* Hover Effects */
            .theme-dark .nav-item:hover, .theme-dark .settings-button:hover, .theme-dark .favorite-pill:hover, .theme-dark .tab:hover, .theme-dark .search-result-item:hover, .theme-dark .history-item:hover, .theme-dark .ai-mode-option:hover, .theme-dark .win-btn:hover, .theme-dark .sidebar-toggle:hover, .theme-dark .history-toggle-btn:hover, .theme-dark .ai-toggle-btn:hover, .theme-dark .notes-toggle-btn:hover, .theme-dark .downloads-toggle-btn:hover, .theme-dark .browser-nav-btns svg:hover, .theme-dark .new-tab-btn:hover, .theme-dark .explorer-btn:hover, .theme-dark .suggestion-item:hover, .theme-dark .suggestion-item.selected {
                background-color: var(--bg-hover) !important;
            }
            .theme-dark .win-btn.close:hover {
                background-color: #e81123 !important;
                color: #fff !important;
            }
            
            /* Text Muting */
            .theme-dark .settings-info .settings-description, .theme-dark .history-url, .theme-dark .result-meta {
                color: var(--text-secondary) !important;
            }
            .theme-dark .nav-item.active {
                color: var(--text-primary) !important;
                background-color: var(--bg-tertiary) !important;
            }
            
            /* Headings */
            .theme-dark h1, .theme-dark h2, .theme-dark h3, .theme-dark h4, .theme-dark .settings-label {
                color: var(--text-primary) !important;
            }
            
            /* Buttons & Chips */
            .theme-dark .settings-button, .theme-dark .favorite-pill, .theme-dark .home-search-chip, .theme-dark .home-search-iconbtn, .theme-dark .home-search-submit, .theme-dark .explorer-btn {
                background-color: var(--bg-tertiary) !important;
                color: var(--text-primary) !important;
                border: 1px solid var(--border-color) !important;
            }
            .theme-dark .explorer-btn.primary {
                background: var(--accent-color) !important;
                color: #fff !important;
                border: none !important;
            }
            
            /* Specific Text & Branding */
            .theme-dark .home-wordmark, .theme-dark .nav-text {
                color: var(--text-primary) !important;
            }
            .theme-dark .favorite-pill .fav-title, .theme-dark .suggestion-item, .theme-dark .ai-mode-option, .theme-dark .context-menu-item {
                color: var(--text-primary) !important;
            }
            .theme-dark .close-tab {
                color: var(--text-secondary) !important;
            }
            .theme-dark .close-tab:hover {
                color: #ff4d4d !important;
            }
            
            /* --- ICONS & SVGs --- */
            /* Override hardcoded grays to use the text color of their parent */
            .theme-dark svg[stroke="#86868b"], .theme-dark svg[stroke="#999"] {
                stroke: currentColor !important;
            }
            .theme-dark svg[fill="#86868b"], .theme-dark svg[fill="#999"] {
                fill: currentColor !important;
            }
            /* Override inline styles for icons */
            .theme-dark svg[style*="color:#999"], .theme-dark svg[style*="color: #999"] {
                color: var(--text-secondary) !important;
            }
            
            /* Base window controls and icon buttons */
            .theme-dark .win-btn, 
            .theme-dark .browser-nav-btns svg, 
            .theme-dark .history-toggle-btn, 
            .theme-dark .ai-toggle-btn, 
            .theme-dark .notes-toggle-btn, 
            .theme-dark .downloads-toggle-btn, 
            .theme-dark .sidebar-toggle, 
            .theme-dark #close-ai, 
            .theme-dark #close-history, 
            .theme-dark #close-notes, 
            .theme-dark #close-downloads, 
            .theme-dark #clear-history {
                color: var(--text-primary) !important;
            }
            
            /* Secondary muted buttons */
            .theme-dark .ai-attach-btn, .theme-dark .ai-mode-btn, .theme-dark .ai-screenshot-btn {
                color: var(--text-secondary) !important;
            }
            .theme-dark .ai-attach-btn:hover, .theme-dark .ai-mode-btn:hover, .theme-dark .ai-screenshot-btn:hover {
                color: var(--text-primary) !important;
            }
            
            /* Protect the gold star */
            .theme-dark svg[stroke="#FFD700"] {
                stroke: #FFD700 !important;
            }
            .theme-dark svg[fill="#FFD700"] {
                fill: #FFD700 !important;
            }
            
            /* Make the default Tab icon white in dark mode */
            .theme-dark img.tab-icon[src*="stroke=%2386868b"] {
                filter: grayscale(1) brightness(2.5) !important;
            }
            
            /* AI Box Modernization */
            .ai-input-box {
                border-radius: 16px !important;
                padding: 6px 6px 6px 14px !important;
                box-shadow: 0 4px 16px rgba(0,0,0,0.06) !important;
                border: 1px solid rgba(0,0,0,0.08) !important;
                background-color: #ffffff !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .ai-input-box input[type="text"], .ai-input-box textarea {
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
                outline: none !important;
                flex: 1 !important;
                min-width: 0 !important;
                color: inherit !important;
            }
            .theme-dark .ai-input-box {
                border: none !important;
                background-color: var(--bg-tertiary) !important;
            }
            .ai-send-circle {
                background: #e5e5ea !important;
                color: #1d1d1f !important;
                border-radius: 8px !important;
                width: 32px !important;
                height: 32px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
                cursor: pointer !important;
                transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                flex-shrink: 0 !important;
            }
            .ai-send-circle:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
                background: #d1d1d6 !important;
            }
            .theme-dark .ai-send-circle {
                background: #3a3a3c !important;
                color: #ffffff !important;
            }
            .theme-dark .ai-send-circle:hover {
                background: #48484a !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            }
            
            /* Audio Indicator */
            .tab-audio-indicator {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 16px !important;
                height: 16px !important;
                margin-right: 4px !important;
                cursor: pointer !important;
                opacity: 0.6 !important;
                transition: opacity 0.2s !important;
            }
            .tab-audio-indicator:hover {
                opacity: 1 !important;
            }
            .tab-audio-indicator.hidden {
                display: none !important;
            }
            .tab-audio-indicator.muted {
                color: #ff3b30 !important;
                opacity: 1 !important;
            }

            /* Modern Scrollbars */
            ::-webkit-scrollbar { width: 14px; height: 14px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background-color: rgba(134, 134, 139, 0.4); border-radius: 10px; border: 4px solid transparent; background-clip: padding-box; }
            ::-webkit-scrollbar-thumb:hover { background-color: rgba(134, 134, 139, 0.6); }
            .theme-dark ::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }
            .theme-dark ::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.3); }

            .blocked-tracker-item { background: rgba(0,0,0,0.03); }
            .theme-dark .blocked-tracker-item { background: rgba(255,255,255,0.05); }
            .blocked-tracker-badge { background: rgba(0,0,0,0.05); color: var(--text-secondary); }
            .theme-dark .blocked-tracker-badge { background: rgba(255,255,255,0.1); color: var(--text-secondary); }
        `;
        document.head.appendChild(style);
    }

    const homeNavBtn = document.getElementById('home-nav-btn');
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const historyToggleBtn = document.getElementById('history-toggle-btn');
    const newsNavBtn = document.getElementById('news-nav-btn');
    const settingsNavBtn = document.getElementById('settings-nav-btn');
    const resourcesNavBtn = document.getElementById('resources-nav-btn');
    const splashView = document.getElementById('splash-view');
    const settingsView = document.getElementById('settings-view');
    const themeSelect = document.getElementById('theme-select');
    const searchEngineSelect = document.getElementById('search-engine-select');
    const clearDataBtn = document.getElementById('clear-data-btn');
    const importBrowserSelect = document.getElementById('import-browser-select');
    const importBrowserBtn = document.getElementById('import-browser-btn');
    const importStatus = document.getElementById('import-status');
    const groqApiKeyInput = document.getElementById('groq-api-key-input');
    const groqApiKeySaveBtn = document.getElementById('groq-api-key-save');
    const groqApiKeyClearBtn = document.getElementById('groq-api-key-clear');
    const groqApiKeyStatus = document.getElementById('groq-api-key-status');
    const updateCheckBtn = document.getElementById('update-check-btn');
    const updateInstallBtn = document.getElementById('update-install-btn');
    const updateStatusEl = document.getElementById('update-status');
    const appVersionEl = document.getElementById('app-version');
    const resourcesView = document.getElementById('resources-view');
    const resourcesList = document.getElementById('resources-list');
    const totalRamUsageEl = document.getElementById('total-ram-usage');
    const optimizeRamBtn = document.getElementById('optimize-ram-btn');
    const newsView = document.getElementById('news-view');
    const aiSidebar = document.getElementById('ai-sidebar');
    const historySidebar = document.getElementById('history-sidebar');
    const downloadsToggleBtn = document.getElementById('downloads-toggle-btn');
    const notesToggleBtn = document.getElementById('notes-toggle-btn');
    const downloadsSidebar = document.getElementById('downloads-sidebar');
    const notesSidebar = document.getElementById('notes-sidebar');
    const downloadsList = document.getElementById('downloads-list');
    const notesDomain = document.getElementById('notes-domain');
    const notesTextarea = document.getElementById('notes-textarea');
    const topAddressBar = document.getElementById('top-address-bar');
    const homeSearchInput = document.getElementById('home-search-input');
    const homeSearchSubmitBtn = document.getElementById('home-search-submit');
    const homeSearchGearBtn = document.getElementById('home-search-gear');
    const favoritesBar = document.getElementById('favorites-bar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const toolSummarizePageBtn = document.getElementById('tool-summarize-page');
    const toolSpellcheckBtn = document.getElementById('tool-spellcheck');
    const toolMicToggleBtn = document.getElementById('tool-mic-toggle');
    const toolSummarizeMicBtn = document.getElementById('tool-summarize-mic');
    const micStatus = document.getElementById('mic-status');
    const micTranscript = document.getElementById('mic-transcript');
    const backBtn = document.getElementById('back-btn');
    const reloadBtn = document.getElementById('reload-btn');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-messages');
    const aiAttachBtn = document.getElementById('ai-attach-btn');
    const aiScreenshotBtn = document.getElementById('ai-screenshot-btn');
    const aiFileInput = document.getElementById('ai-file-input');
    const aiContextPill = document.getElementById('ai-context-pill');
    const aiContextText = document.getElementById('ai-context-text');
    const aiContextClear = document.getElementById('ai-context-clear');
    const aiModeBtn = document.getElementById('ai-mode-btn');
    const aiPageContextPill = document.getElementById('ai-page-context-pill');
    const aiPageContextText = document.getElementById('ai-page-context-text');
    const aiPageContextClear = document.getElementById('ai-page-context-clear');
    const aiModePopup = document.getElementById('ai-mode-popup');
    const aiModeToast = document.getElementById('ai-mode-toast');
    const closeAiBtn = document.getElementById('close-ai');
    const closeHistoryBtn = document.getElementById('close-history');
    const closeDownloadsBtn = document.getElementById('close-downloads');
    const closeNotesBtn = document.getElementById('close-notes');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');
    const tabsContainer = document.querySelector('.tabs-container');
    const addTabBtn = document.getElementById('add-tab-btn');
    const webviewsContainer = document.getElementById('webviews-container');
    const customContextMenu = document.getElementById('custom-context-menu');
    const aiSidebarResizer = document.getElementById('ai-sidebar-resizer');

    // --- Eigenes Logo im AI Sidebar Header einfügen ---
    if (aiSidebar) {
        const aiHeaderTitle = aiSidebar.querySelector('.ai-header h2');
        if (aiHeaderTitle && !document.getElementById('ai-custom-logo')) {
            aiHeaderTitle.style.display = 'flex';
            aiHeaderTitle.style.alignItems = 'center';
            aiHeaderTitle.style.gap = '10px';

            if (!document.getElementById('ai-orb-styles')) {
                const style = document.createElement('style');
                style.id = 'ai-orb-styles';
                style.textContent = `
                    @keyframes aetherOrbColors {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .aether-glass-orb {
                        width: 26px;
                        height: 26px;
                        border-radius: 50%;
                        background: linear-gradient(270deg, rgba(10, 132, 255, 0.7), rgba(255, 55, 120, 0.7), rgba(185, 90, 235, 0.7), rgba(10, 132, 255, 0.7));
                        background-size: 300% 300%;
                        animation: aetherOrbColors 5s ease infinite;
                        position: relative;
                        flex-shrink: 0;
                        box-shadow: 0 4px 12px rgba(10, 132, 255, 0.25), inset 0 0 8px rgba(255, 255, 255, 0.6);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                    }
                    .aether-glass-orb::before {
                        content: '';
                        position: absolute;
                        top: 12%; left: 18%;
                        width: 35%; height: 25%;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.85);
                        transform: rotate(-40deg);
                        filter: blur(0.5px);
                        pointer-events: none;
                    }
                    .aether-glass-orb::after {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        border-radius: 50%;
                        background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 75% 75%, transparent 40%, rgba(20, 30, 60, 0.2) 100%);
                        box-shadow: inset -2px -2px 6px rgba(20, 30, 60, 0.2), inset 2px 2px 8px rgba(255, 255, 255, 0.8);
                        pointer-events: none;
                    }
                `;
                document.head.appendChild(style);
            }

            const logo = document.createElement('div');
            logo.id = 'ai-custom-logo';
            logo.className = 'aether-glass-orb';
            aiHeaderTitle.insertBefore(logo, aiHeaderTitle.firstChild);
        }
    }

    let tabCounter = 0;
    let activeTabId = null;
    let splitTabId = null;
    let browserHistory = [];

    const hash = window.location.hash;
    const isStandalone = hash === '#settings' || hash === '#resources';

    if (isStandalone) {
        document.body.classList.add('standalone-window');
    }

    const addressBarCapsule = document.querySelector('.address-bar-capsule');
    if (addressBarCapsule && !document.getElementById('fav-star-btn')) {
        const starBtn = document.createElement('div');
        starBtn.id = 'fav-star-btn';
        starBtn.style.cssText = 'cursor:pointer; margin-left:8px; color:#86868b; display:flex; align-items:center;';
        addressBarCapsule.appendChild(starBtn);
    }
    function updateFavStar() {
        const starBtn = document.getElementById('fav-star-btn');
        if (!starBtn) return;
        const wv = getActiveWebview();
        let u = '';
        try { if (wv && typeof wv.getURL === 'function') u = wv.getURL(); } catch(e) {}
        if (!u && wv && wv.src) u = wv.src;
        if (!u || u === 'about:blank' || u.includes('file://')) {
            starBtn.style.display = 'none';
            return;
        }
        starBtn.style.display = 'flex';
        const isFav = favorites.some(f => f && f.url === u);
        if (isFav) {
            starBtn.style.color = '#FFD700';
            starBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            starBtn.title = 'Aus Favoriten entfernen';
            starBtn.onclick = (e) => { e.stopPropagation(); removeFavorite(u); };
        } else {
            starBtn.style.color = '#86868b';
            starBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            starBtn.title = 'Zu Favoriten hinzufügen';
            starBtn.onclick = (e) => { e.stopPropagation(); addCurrentPageToFavorites(); };
        }
    }

    const DEFAULT_TAB_ICON_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/></svg>`
    )}`;
    let favorites = [];
    // Used by showAiModeToast(); must be initialized before any toast call.
    let aiModeToastTimer = null;
    try {
        const savedFavs = JSON.parse(localStorage.getItem('aether-favorites') || '[]');
        if (Array.isArray(savedFavs)) {
            favorites = savedFavs.filter(f => {
                if (!f || !f.url) return false;
                const u = f.url.toLowerCase();
                return !(u.includes('index.html') && (u.includes('file:') || u.includes('aether')));
            });
        }
    } catch (e) {
        favorites = [];
    }
    let searchEngine = 'google';
    try {
        const savedEngine = localStorage.getItem('aether-search-engine');
        if (savedEngine && ['google', 'duckduckgo', 'bing'].includes(savedEngine)) searchEngine = savedEngine;
    } catch {
        // ignore
    }
    const APP_STATE_KEY = 'aether-app-state-v1';
    const LATER_READ_KEY = 'aether-later-read-v1';
    const EXPLORER_ROOTS_KEY = 'aether-explorer-roots-v1';
    let saveStateTimer = null;
    function scheduleSaveAppState() {
        if (saveStateTimer) window.clearTimeout(saveStateTimer);
        saveStateTimer = window.setTimeout(() => {
            saveStateTimer = null;
            saveAppState();
        }, 180);
    }
    function safeJsonParse(raw, fallback) {
        try {
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }
    function loadLaterRead() {
        const obj = safeJsonParse(localStorage.getItem(LATER_READ_KEY), {});
        return obj && typeof obj === 'object' ? obj : {};
    }
    function saveLaterRead(obj) {
        try {
            localStorage.setItem(LATER_READ_KEY, JSON.stringify(obj || {}));
        } catch {
            // ignore
        }
    }
    function loadAppState() {
        return safeJsonParse(localStorage.getItem(APP_STATE_KEY), null);
    }
    function tabSnapshotFromDom(tabEl) {
        const tabId = tabEl.id;
        const url = tabEl.dataset.url || 'about:blank';
        const title = (tabEl.querySelector('.tab-title') && tabEl.querySelector('.tab-title').textContent) ? tabEl.querySelector('.tab-title').textContent : 'Neuer Tab';
        const rawIcon = tabEl.querySelector('.tab-icon') ? tabEl.querySelector('.tab-icon').getAttribute('src') : '';
        const icon = rawIcon && rawIcon !== DEFAULT_TAB_ICON_DATA_URL ? rawIcon : '';
        const pinned = tabEl.classList.contains('pinned');
        const asleep = tabEl.classList.contains('asleep') || tabEl.dataset.asleep === '1';
        const lastFocusedAtMs = Number(tabEl.dataset.lastFocusedAtMs || 0) || 0;
        return { id: tabId, url, title, icon, pinned, asleep, lastFocusedAtMs };
    }
    function saveAppState() {
        if (isStandalone) return;
        try {
            const tabs = Array.from(document.querySelectorAll('.tab')).map(tabSnapshotFromDom);
            const state = {
                v: 1,
                activeTabId,
                tabCounter,
                tabs,
            };
            localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
        } catch (e) {
            // ignore
        }
    }
    // Universal Explorer (Tabs + History + Files)
    let explorerRoots = [];
    try {
        const savedRoots = safeJsonParse(localStorage.getItem(EXPLORER_ROOTS_KEY), []);
        if (Array.isArray(savedRoots)) explorerRoots = savedRoots.filter((p) => typeof p === 'string' && p.trim()).slice(0, 8);
    } catch {
        explorerRoots = [];
    }
    function saveExplorerRoots() {
        try {
            localStorage.setItem(EXPLORER_ROOTS_KEY, JSON.stringify(explorerRoots.slice(0, 8)));
        } catch {
            // ignore
        }
    }
    function renderExplorerRoots() {
        if (!explorerRootsEl) return;
        explorerRootsEl.innerHTML = '';
        const roots = explorerRoots.slice(0, 8);
        if (!roots.length) {
            const pill = document.createElement('div');
            pill.className = 'explorer-root-pill';
            pill.textContent = 'Standard: Dokumente';
            explorerRootsEl.appendChild(pill);
            return;
        }
        for (const r of roots) {
            const pill = document.createElement('div');
            pill.className = 'explorer-root-pill';
            pill.textContent = r;
            pill.title = r;
            explorerRootsEl.appendChild(pill);
        }
    }
    function clearExplorerResults() {
        if (!explorerResults) return;
        explorerResults.innerHTML = '';
    }
    function addExplorerSection(title) {
        if (!explorerResults) return null;
        const h = document.createElement('div');
        h.className = 'search-section-title';
        h.textContent = title;
        explorerResults.appendChild(h);
        return h;
    }
    function addExplorerItem(name, meta, onClick) {
        if (!explorerResults) return;
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `<div class="result-info"><div class="result-name"></div><div class="result-meta"></div></div>`;
        const n = item.querySelector('.result-name');
        const m = item.querySelector('.result-meta');
        if (n) n.textContent = name || '';
        if (m) m.textContent = meta || '';
        if (onClick) item.addEventListener('click', onClick);
        explorerResults.appendChild(item);
    }
    function filePathToFileUrl(p) {
        const norm = String(p || '').replace(/\\/g, '/');
        // Ensure file:///C:/...
        const prefixed = norm.match(/^[A-Za-z]:\//) ? `file:///${norm}` : `file://${norm}`;
        return encodeURI(prefixed);
    }
    async function runExplorerSearch(q) {
        const query = String(q || '').trim();
        clearExplorerResults();
        if (!query) {
            if (explorerResults) {
                explorerResults.innerHTML = '<div style="padding:12px; color:#86868b; font-size:13px; text-align:center;">Tippe etwas zum Suchen (Dateien, Tabs, Verlauf).</div>';
            }
            return;
        }
        // Tabs
        const tabs = Array.from(document.querySelectorAll('.tab'))
            .map(tabSnapshotFromDom)
            .filter((t) => (t.title || '').toLowerCase().includes(query.toLowerCase()) || (t.url || '').toLowerCase().includes(query.toLowerCase()))
            .slice(0, 12);
        addExplorerSection('Tabs');
        if (!tabs.length) {
            addExplorerItem('Keine Tabs', '', null);
        } else {
            for (const t of tabs) {
                addExplorerItem(t.title || t.url, t.url, () => switchTab(t.id));
            }
        }
        // History
        const hist = (Array.isArray(browserHistory) ? browserHistory : [])
            .filter((h) => (h.title || '').toLowerCase().includes(query.toLowerCase()) || (h.url || '').toLowerCase().includes(query.toLowerCase()))
            .slice(0, 12);
        addExplorerSection('Verlauf');
        if (!hist.length) {
            addExplorerItem('Kein Treffer im Verlauf', '', null);
        } else {
            for (const h of hist) {
                addExplorerItem(h.title || h.url, h.url, () => navigate(h.url));
            }
        }
        // Files (IPC to main)
        addExplorerSection('Dateien');
        addExplorerItem('Suche läuft...', '', null);
        try {
            const files = window.electronAPI && window.electronAPI.searchFiles
                ? await window.electronAPI.searchFiles({ query, roots: explorerRoots })
                : [];
            // Replace the loading marker by clearing only the "Dateien" section tail.
            clearExplorerResults();
            // Re-render sections to keep ordering stable.
            addExplorerSection('Tabs');
            if (!tabs.length) addExplorerItem('Keine Tabs', '', null);
            else for (const t of tabs) addExplorerItem(t.title || t.url, t.url, () => switchTab(t.id));
            addExplorerSection('Verlauf');
            if (!hist.length) addExplorerItem('Kein Treffer im Verlauf', '', null);
            else for (const h of hist) addExplorerItem(h.title || h.url, h.url, () => navigate(h.url));
            addExplorerSection('Dateien');
            const list = Array.isArray(files) ? files.slice(0, 20) : [];
            if (!list.length) {
                addExplorerItem('Keine Dateien gefunden', '', null);
            } else {
                for (const f of list) {
                    const meta = f.type === 'folder' ? 'Ordner' : 'Datei';
                    addExplorerItem(f.title || f.path, `${meta} · ${f.path}`, () => {
                        if (f.type === 'folder') {
                            if (window.electronAPI && window.electronAPI.openFile) window.electronAPI.openFile(f.path);
                            return;
                        }
                        createTab(filePathToFileUrl(f.path));
                    });
                }
            }
        } catch (e) {
            clearExplorerResults();
            addExplorerSection('Dateien');
            addExplorerItem('Fehler bei der Dateisuche', String(e && e.message ? e.message : e), null);
        }
    }
    function saveFavorites() {
        try {
            localStorage.setItem('aether-favorites', JSON.stringify(favorites.slice(0, 30)));
        } catch (e) {
            // ignore
        }
    }
    function getActiveWebview() {
        if (!activeTabId) return null;
        return document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
    }
    function addCurrentPageToFavorites() {
        const activeWebview = getActiveWebview();
        if (!activeWebview) return;
        let url = '';
        try { if (typeof activeWebview.getURL === 'function') url = activeWebview.getURL(); } catch(e) {}
        if (!url && activeWebview.src) url = activeWebview.src;
        if (!url || url === 'about:blank' || url.includes('file://')) return;
        let title = url;
        try { if (typeof activeWebview.getTitle === 'function') title = activeWebview.getTitle() || url; } catch(e) {}
        addFavorite(url, title);
    }
    function addFavorite(url, title) {
        const u = String(url || '').trim();
        if (!u || u === 'about:blank') return false;
        if (u.toLowerCase().includes('index.html') && (u.toLowerCase().includes('file:') || u.toLowerCase().includes('aether'))) return false;
        if (favorites.some((f) => f && f.url === u)) return false;
        favorites.unshift({ title: title || u, url: u, addedAt: Date.now() });
        saveFavorites();
        renderFavoritesBar();
        return true;
    }
    function removeFavorite(url) {
        favorites = favorites.filter((f) => f && f.url !== url);
        saveFavorites();
        renderFavoritesBar();
    }
    function renderFavoritesBar() {
        if (!favoritesBar) return;
        const items = favorites.slice(0, 10).filter((f) => f && f.url);
        favoritesBar.innerHTML = '';
        for (const fav of items) {
            const pill = document.createElement('div');
            pill.className = 'favorite-pill';
            pill.dataset.url = fav.url;
            pill.title = fav.url;
            pill.addEventListener('click', () => navigate(fav.url));
            const t = document.createElement('span');
            t.className = 'fav-title';
            t.textContent = fav.title || fav.url;
            pill.appendChild(t);
            favoritesBar.appendChild(pill);
        }
        favoritesBar.classList.toggle('is-visible', true);
    updateFavStar();
    }
    // Load history from localStorage
    try {
        browserHistory = JSON.parse(localStorage.getItem('aether-history') || '[]');
        if (!Array.isArray(browserHistory)) browserHistory = [];
    } catch (e) {
        console.error('Error loading history:', e);
    }
    // Init UI state
    renderFavoritesBar();
    // Favorites: add/remove via right-click (no dedicated "+ Favorit" button).
    if (favoritesBar) {
        favoritesBar.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const pill = e.target && e.target.closest ? e.target.closest('.favorite-pill') : null;
            if (pill && pill.dataset && pill.dataset.url) {
                buildAndShowMenu('favorite-pill', { url: pill.dataset.url, x: e.clientX, y: e.clientY });
                return;
            }
            buildAndShowMenu('favorites-bar', { x: e.clientX, y: e.clientY });
        });
    }
    // Sidebar collapse
    function setSidebarCollapsed(collapsed) {
        if (!sidebar) return;
        sidebar.classList.toggle('collapsed', !!collapsed);
        try {
            localStorage.setItem('aether-sidebar-collapsed', collapsed ? '1' : '0');
        } catch (e) {
            // ignore
        }
    }
    try {
        const savedCollapsed = localStorage.getItem('aether-sidebar-collapsed');
        setSidebarCollapsed(savedCollapsed === '1');
    } catch (e) {
        // ignore
    }
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            setSidebarCollapsed(!sidebar.classList.contains('collapsed'));
        });
    }
    // Workspace tools: summarize / spellcheck / mic transcript (best-effort)
    if (toolSummarizePageBtn) {
        toolSummarizePageBtn.addEventListener('click', () => {
            if (aiSidebar) aiSidebar.classList.remove('hidden');
            // Triggers existing "page scan" path in sendToAI
            sendToAI('Fasse diese Seite zusammen');
        });
    }
    if (toolSpellcheckBtn) {
        toolSpellcheckBtn.addEventListener('click', () => {
            const seed = (micTranscript && micTranscript.textContent ? micTranscript.textContent.trim() : '');
            const text = window.prompt('Text fuer Rechtschreibpruefung:', seed);
            if (!text) return;
            if (aiSidebar) aiSidebar.classList.remove('hidden');
            sendToAI(`Korrigiere Rechtschreibung und Grammatik. Gib nur die korrigierte Version zurueck:\n\n${text}`);
        });
    }
    let recognition = null;
    let micIsOn = false;
    function setMicUi(statusText) {
        if (micStatus) micStatus.textContent = statusText || '';
    }
    function ensureSpeechRecognition() {
        const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Rec) return null;
        const r = new Rec();
        r.continuous = true;
        r.interimResults = true;
        r.lang = 'de-CH';
        return r;
    }
    if (toolMicToggleBtn) {
        toolMicToggleBtn.addEventListener('click', () => {
            if (!recognition) recognition = ensureSpeechRecognition();
            if (!recognition) {
                setMicUi('Mic nicht verfuegbar (SpeechRecognition fehlt).');
                return;
            }
            if (!micIsOn) {
                micIsOn = true;
                setMicUi('Mic an...');
                try {
                    recognition.start();
                } catch (e) {
                    // start can throw if already started
                }
            } else {
                micIsOn = false;
                setMicUi('Mic aus.');
                try {
                    recognition.stop();
                } catch (e) {
                    // ignore
                }
            }
        });
    }
    if (toolSummarizeMicBtn) {
        toolSummarizeMicBtn.addEventListener('click', () => {
            const text = micTranscript && micTranscript.textContent ? micTranscript.textContent.trim() : '';
            if (!text) return;
            if (aiSidebar) aiSidebar.classList.remove('hidden');
            sendToAI(`Fasse folgendes Transkript in Stichpunkten zusammen:\n\n${text}`);
        });
    }
    // Wire recognition callbacks if supported
    try {
        recognition = ensureSpeechRecognition();
        if (recognition) {
            recognition.onresult = (event) => {
                let finalText = '';
                let interimText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const res = event.results[i];
                    const t = res && res[0] && res[0].transcript ? res[0].transcript : '';
                    if (res.isFinal) finalText += t;
                    else interimText += t;
                }
                if (micTranscript) {
                    const base = (micTranscript.dataset.finalText || '').toString();
                    const nextFinal = (base + finalText).trim();
                    micTranscript.dataset.finalText = nextFinal;
                    micTranscript.textContent = `${nextFinal}${interimText ? ('\n' + interimText.trim()) : ''}`.trim();
                }
                setMicUi('Mic laeuft...');
            };
            recognition.onend = () => {
                if (micIsOn) {
                    // Browser may stop recognition automatically; reflect state.
                    micIsOn = false;
                }
                setMicUi('Mic aus.');
            };
            recognition.onerror = () => {
                setMicUi('Mic Fehler.');
            };
        }
    } catch (e) {
        // ignore
    }
    // --- Resizable Sidebar ---
    if (aiSidebarResizer) {
        aiSidebarResizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            aiSidebar.style.transition = 'none'; // Disable smooth transition during drag
            const mouseMoveHandler = (moveEvent) => {
                const newWidth = document.body.clientWidth - moveEvent.clientX;
                // Respect min/max width from CSS
                const minWidth = parseInt(getComputedStyle(aiSidebar).minWidth, 10);
                const maxWidth = parseInt(getComputedStyle(aiSidebar).maxWidth, 10);
                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    aiSidebar.style.width = newWidth + 'px';
                }
            };
            const mouseUpHandler = () => {
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
                aiSidebar.style.transition = ''; // Re-enable smooth transition
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    }

    // --- AI File Attachment ---
    if (aiAttachBtn && aiFileInput) {
        aiAttachBtn.addEventListener('click', () => aiFileInput.click());
        aiFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileContent = e.target.result;
                    if (aiContextPill && aiContextText) {
                        aiContextText.textContent = file.name;
                        aiContextPill.dataset.fileContent = fileContent;
                        delete aiContextPill.dataset.imageDataUrl;
                        aiContextPill.classList.remove('hidden');
                    }
                };
                reader.readAsText(file);
                aiFileInput.value = ''; // Allow re-selecting the same file
            }
        });
    }

    if (aiScreenshotBtn) {
        aiScreenshotBtn.addEventListener('click', async () => {
            const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
            if (!activeWebview || activeWebview.src === 'about:blank' || activeWebview.style.display === 'none') {
                return;
            }
            try {
                const image = await activeWebview.capturePage();
                const imageUrl = image.toDataURL();
                if (aiContextPill && aiContextText) {
                    aiContextText.textContent = "Screenshot.png";
                    aiContextPill.dataset.imageDataUrl = imageUrl;
                    delete aiContextPill.dataset.fileContent;
                    aiContextPill.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error capturing page for AI:', error);
            }
        });
    }

    if (aiContextClear && aiContextPill) {
        aiContextClear.addEventListener('click', () => {
            aiContextPill.classList.add('hidden');
            delete aiContextPill.dataset.fileContent;
            delete aiContextPill.dataset.imageDataUrl;
            aiContextText.textContent = '';
        });
    }
    // Analyze the currently active page by taking a screenshot
    async function analyzeActivePage() {
        const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
        if (!activeWebview || activeWebview.src === 'about:blank' || activeWebview.style.display === 'none') {
            appendMessage('bot', 'Es gibt keine aktive Seite zum Analysieren.');
            return;
        }
        appendMessage('user', 'Analysiere diese Seite');
        const loadingId = 'loading-' + Date.now();
        appendMessage('bot', 'Mache einen Screenshot und analysiere die Seite...', loadingId);
        try {
            const image = await activeWebview.capturePage();
            const imageUrl = image.toDataURL();
            await sendToAI("Beschreibe diese Seite. Fasse zusammen, was zu sehen ist und was der Hauptzweck der Seite sein könnte.", { imageDataUrl: imageUrl, loadingId: loadingId });
        } catch (error) {
            console.error('Error capturing page:', error);
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.textContent = 'Fehler beim Erfassen der Seite.';
        }
    }
    // Window Controls
    const minBtn = document.getElementById('min-btn');
    const maxBtn = document.getElementById('max-btn');
    const closeBtn = document.getElementById('close-btn');
    if (minBtn) {
        minBtn.onclick = () => {
            if (window.electronAPI && window.electronAPI.minimizeWindow) window.electronAPI.minimizeWindow();
        };
    }
    if (maxBtn) {
        maxBtn.onclick = () => {
            if (window.electronAPI && window.electronAPI.maximizeWindow) window.electronAPI.maximizeWindow();
        };
    }
    if (closeBtn) {
        closeBtn.onclick = () => {
            if (window.electronAPI && window.electronAPI.closeWindow) window.electronAPI.closeWindow();
            else window.close();
        };
    }
    // --- History List Event Delegation ---
    if (historyList) {
        historyList.addEventListener('click', (e) => {
            const item = e.target.closest('.history-item');
            if (item && item.dataset.url) {
                navigate(item.dataset.url);
                if (historySidebar) historySidebar.classList.add('hidden');
            }
        });
    }

    function getHistoryGroup(timestamp, now) {
        const diff = now - timestamp;
        if (diff < 60 * 60 * 1000) return 'Letzte Stunde';
        const date = new Date(timestamp);
        const today = new Date(now);
        if (date.toDateString() === today.toDateString()) return 'Heute';
        const yesterday = new Date(now);
        yesterday.setDate(today.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return 'Gestern';
        const weekAgo = new Date(now);
        weekAgo.setDate(today.getDate() - 7);
        if (timestamp > weekAgo.getTime()) return 'Diese Woche';
        return 'Älter';
    }

    // Render history list
    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        if (browserHistory.length === 0) {
            historyList.innerHTML = '<div style="padding:12px; color:#86868b; font-size:13px; text-align:center;">Kein Verlauf vorhanden.</div>';
            return;
        }
        const fragment = document.createDocumentFragment();
        const now = Date.now();
        const groups = {
            'Letzte Stunde': [],
            'Heute': [],
            'Gestern': [],
            'Diese Woche': [],
            'Älter': []
        };
        browserHistory.slice(0, 300).forEach((item) => {
            const groupName = getHistoryGroup(item.time || 0, now);
            groups[groupName].push(item);
        });
        for (const [groupName, items] of Object.entries(groups)) {
            if (items.length === 0) continue;
            const header = document.createElement('div');
            header.style.cssText = 'padding: 12px 16px 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6;';
            header.textContent = groupName;
            fragment.appendChild(header);
            items.forEach((item) => {
                const div = document.createElement('div');
                div.className = 'history-item';
                div.dataset.url = item.url;
                let domain = '';
                try { domain = new URL(item.url).hostname; } catch(e) {}
                const iconSrc = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : DEFAULT_TAB_ICON_DATA_URL;
                div.innerHTML = `<div style="display:flex; align-items:center; width:100%; gap:12px;"><img src="${iconSrc}" style="width:16px; height:16px; border-radius:3px; flex-shrink:0;" alt="" onerror="this.src='${DEFAULT_TAB_ICON_DATA_URL}'"><div style="min-width:0; flex:1;"><div class="history-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500;">${item.title || item.url}</div><div class="history-url" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:0.85em; opacity:0.7;">${item.url}</div></div></div>`;
                fragment.appendChild(div);
            });
        }
        historyList.appendChild(fragment); // Single append to the DOM
    }
    renderHistory();
    // Save history
    function saveHistory(url, title) {
        if (!url || url === 'about:blank') return;
        if (browserHistory.length > 0 && browserHistory[0].url === url) return;
        browserHistory.unshift({ url, title: title || url, time: Date.now() });
        if (browserHistory.length > 1000) browserHistory.pop();
        localStorage.setItem('aether-history', JSON.stringify(browserHistory));
        renderHistory();
    }
    // View Management
    function resetViews(keepWebview = false) {
        if (splashView) splashView.style.display = 'none';
        if (settingsView) settingsView.classList.add('hidden');
        if (resourcesView) resourcesView.classList.add('hidden');
        if (newsView) newsView.classList.add('hidden');
        const aView = document.getElementById('addons-view');
        if (aView) aView.classList.add('hidden');
        if (aiSidebar) aiSidebar.classList.add('hidden');
        if (historySidebar) historySidebar.classList.add('hidden');
        
        // Stelle Suchleiste und Tabs standardmäßig wieder her
        const tabsCont = document.querySelector('.tabs-container');
        const headerCont = document.querySelector('.app-header');
        if (tabsCont) tabsCont.style.display = 'flex';
        if (headerCont) headerCont.style.display = 'flex';
        
        if (!keepWebview) {
            if (aiSidebar) aiSidebar.classList.add('hidden');
            if (historySidebar) historySidebar.classList.add('hidden');
        }
        
        if (homeNavBtn) homeNavBtn.classList.remove('active');
        if (settingsNavBtn) settingsNavBtn.classList.remove('active');
        if (resourcesNavBtn) resourcesNavBtn.classList.remove('active');
        if (newsNavBtn) newsNavBtn.classList.remove('active');
        const aNavBtn = document.getElementById('addons-nav-btn');
        if (aNavBtn) aNavBtn.classList.remove('active');
        
        if (!keepWebview) {
            const webviews = document.querySelectorAll('webview');
            webviews.forEach(webview => webview.style.display = 'none');
        }
    }
    // Navigation
    window.navigate = function(url) {
        if (!url) return;
        resetViews(true);
        
        let target = url;
        if (!url.startsWith('http')) {
            if (url.includes('.') && !url.includes(' ')) {
                target = 'https://' + url;
            } else {
                if (searchEngine === 'duckduckgo') {
                    target = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
                } else if (searchEngine === 'bing') {
                    target = 'https://www.bing.com/search?q=' + encodeURIComponent(url);
                } else {
                    target = 'https://www.google.com/search?q=' + encodeURIComponent(url) + '&udm=14';
                }
            }
        }
        
        // Ensure there is an active tab to navigate in.
        if (!activeTabId || !document.getElementById(activeTabId)) {
            createTab(target);
        } else {
            let activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
            if (!activeWebview) {
                const tabEl = document.getElementById(activeTabId);
                if (tabEl) tabEl.dataset.url = target;
                activeWebview = wakeTab(activeTabId);
                if (activeWebview) activeWebview.style.display = 'flex';
            } else {
                activeWebview.style.display = 'flex';
                if (activeWebview.src !== target) activeWebview.src = target;
            }
        }
        if (topAddressBar) topAddressBar.value = target;
        saveHistory(target, url);
        scheduleSaveAppState();
    };
    function appendMessage(role, content, id) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + role;
        if (id) msgDiv.id = id;
        msgDiv.textContent = content;
        if (aiMessages) {
            aiMessages.appendChild(msgDiv);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }
        return msgDiv;
    }
    // --- AI Mode Selection ---
    const aiModes = ['standard', 'creative', 'precise'];
    const aiModeLabels = {
        standard: 'Standard',
        creative: 'Kreativ',
        precise: 'Präzise'
    };
    const aiModeIcons = {
        standard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`,
        creative: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,
        precise: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`
    };
    let currentAiModeIndex = 0;
    function showAiModeToast(text) {
        if (!aiModeToast) return;
        if (aiModeToastTimer) window.clearTimeout(aiModeToastTimer);
        aiModeToast.textContent = text;
        aiModeToast.classList.remove('hidden');
        requestAnimationFrame(() => aiModeToast.classList.add('show'));
        aiModeToastTimer = window.setTimeout(() => {
            aiModeToast.classList.remove('show');
            window.setTimeout(() => aiModeToast.classList.add('hidden'), 180);
        }, 1200);
    }
    function applyAiMode(newMode, opts = {}) {
        if (!aiModes.includes(newMode)) return;
        currentAiModeIndex = aiModes.indexOf(newMode);
        try {
            localStorage.setItem('aether-ai-mode', newMode);
        } catch (e) {
            // ignore
        }
        if (aiModeBtn) {
            aiModeBtn.title = `Modus: ${aiModeLabels[newMode]}`;
            aiModeBtn.innerHTML = aiModeIcons[newMode];
        }
        if (!opts.silent) showAiModeToast(`Modus: ${aiModeLabels[newMode]}`);
    }
    // Restore persisted AI mode (fallback: standard)
    try {
        const savedMode = localStorage.getItem('aether-ai-mode');
        if (savedMode && aiModes.includes(savedMode)) currentAiModeIndex = aiModes.indexOf(savedMode);
    } catch (e) {
        // ignore
    }
    applyAiMode(aiModes[currentAiModeIndex], { silent: true });
    if (aiModeBtn) {
        aiModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (aiModePopup) {
                aiModePopup.classList.toggle('hidden');
                // Highlight the currently active mode
                const currentMode = aiModes[currentAiModeIndex];
                document.querySelectorAll('.ai-mode-option').forEach(opt => {
                    opt.classList.toggle('active', opt.dataset.mode === currentMode);
                });
            }
        });
    }
    if (aiModePopup) {
        aiModePopup.addEventListener('click', (e) => {
            const option = e.target.closest('.ai-mode-option');
            if (option) {
                const newMode = option.dataset.mode;
                applyAiMode(newMode);
                aiModePopup.classList.add('hidden');
            }
        });
    }
    // Hide popups when clicking outside
    document.addEventListener('click', (e) => {
        if (aiModePopup && !aiModePopup.classList.contains('hidden')) {
            if (!aiModeBtn.contains(e.target) && !aiModePopup.contains(e.target)) {
                aiModePopup.classList.add('hidden');
            }
        }
    });
    // --- AI Page Context ---
    function updatePageContext() {
        const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
        let url = null;
        let title = null;
        try {
            url = activeWebview && activeWebview.getURL ? activeWebview.getURL() : null;
            title = activeWebview && activeWebview.getTitle ? activeWebview.getTitle() : null;
        } catch {
            url = null;
            title = null;
        }
        if (!aiPageContextPill || !activeWebview || !url || url === 'about:blank') {
            if (aiPageContextPill) {
                aiPageContextPill.classList.add('hidden');
                delete aiPageContextPill.dataset.url;
                delete aiPageContextPill.dataset.title;
            }
            return;
        }
        if (aiPageContextText && aiPageContextPill) {
            aiPageContextText.textContent = title || url;
            aiPageContextPill.dataset.url = url;
            aiPageContextPill.dataset.title = title;
            aiPageContextPill.classList.remove('hidden');
        }
    }
    if (aiPageContextClear) {
        aiPageContextClear.addEventListener('click', (e) => {
            e.stopPropagation();
            if (aiPageContextPill) {
                aiPageContextPill.classList.add('hidden');
                delete aiPageContextPill.dataset.url;
                delete aiPageContextPill.dataset.title;
            }
        });
    }
    const systemPrompts = {
        standard: 'Du bist Aether AI, der hochintelligente und tief in den Browser integrierte Co-Pilot.\n\nDU KANNST DEN BROWSER STEUERN:\nWenn der Nutzer dich bittet, Aktionen auszuführen, antworte natürlich und füge am Ende Tags ein:\n- Leeren neuen Tab öffnen: [ACTION:NEW_TAB]\n- Aktuellen Tab schließen: [ACTION:CLOSE_TAB]\n- Verlauf löschen: [ACTION:CLEAR_HISTORY]\n- Browser optimieren: [ACTION:OPTIMIZE_RAM]\n- Dark Mode: [ACTION:DARK_MODE]\n- Light Mode: [ACTION:LIGHT_MODE]\n\nWICHTIG FÜR WEBSEITEN (SUGGEST vs. OPEN):\n1. Webseiten VORSCHLAGEN: Nutze zwingend am Ende [SUGGEST_LINK:https://url.com|Seitenname]. Der Browser rendert diese als schicke Buttons unter deiner Nachricht. Bevorzuge dies bei Recherchen und Links.\n2. Webseiten DIREKT ÖFFNEN: Nutze [ACTION:OPEN_TAB:https://url.com] WIRKLICH NUR, wenn der Nutzer explizit sagt "öffne...", "gehe zu..." oder "erstelle einen tab".\n\n1. Suche stets aktuell. 2. Keine langen Erklärungen.',
        creative: 'Du bist Aether AI, ein kreativer Browser-Assistent. Befehle wie [ACTION:NEW_TAB], [ACTION:CLOSE_TAB] etc. per Tags am Ende ausführen. Tabs DIREKT öffnen ([ACTION:OPEN_TAB:url]) NUR auf ausdrücklichen Befehl! Wenn du Links nur vorschlägst, nutze IMMER [SUGGEST_LINK:https://url.com|Titel], damit sie als Buttons unter der Nachricht erscheinen. Antworte ausführlich auf Deutsch.',
        precise: 'Du bist Aether AI, ein präziser Assistent. Befehle über Tags: [ACTION:NEW_TAB], [ACTION:CLOSE_TAB]. Webseiten NUR direkt öffnen ([ACTION:OPEN_TAB:url]), wenn explizit gefordert. Zum Vorschlagen von Links nutze zwingend [SUGGEST_LINK:https://url.com|Titel]. Kurze Fakten auf Deutsch.'
    };
    // AI Messaging & Command Execution
    async function sendToAI(text, options = {}) {
        let commandText = text || (aiInput ? aiInput.value.trim() : '');
        if (!commandText) return;
        const lowerText = commandText.toLowerCase();
        // --- Step 1: Command Routing & Context Gathering ---
        // This block runs only for the initial user command, not for internal recursive calls.
        if (!options.isContinuation) {
            appendMessage('user', commandText);
            if (aiInput) aiInput.value = '';
            // A. Web Search Command (for live data)
            if (lowerText.startsWith('recherchiere: ') || lowerText.startsWith('recherchiere ')) {
                const query = commandText.substring(commandText.indexOf(' ') + 1);
                const loadingId = 'loading-' + Date.now();
                appendMessage('bot', `Recherchiere im Web nach: "${query}"...`, loadingId);
                try {
                    const searchResults = await window.electronAPI.performSearch(query);
                    const searchContext = `Kontext aus der Web-Suche für "${query}":\n${searchResults}\n\n`;
                    // Re-call sendToAI with the search results as context
                    return sendToAI(commandText, { isContinuation: true, context: searchContext, loadingId });
                } catch (e) {
                    console.error("Search failed:", e);
                    const loadingEl = document.getElementById(loadingId);
                    if (loadingEl) loadingEl.textContent = 'Fehler bei der Websuche.';
                    return;
                }
            }
            // B. Page Scan Command
            if (lowerText.startsWith('scanne diese seite') || lowerText.startsWith('fasse diese seite zusammen')) {
                const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
                if (!activeWebview || !activeWebview.getURL() || activeWebview.getURL() === 'about:blank') {
                    appendMessage('bot', 'Es gibt keine aktive Seite zum Scannen.');
                    return;
                }
                const loadingId = 'loading-' + Date.now();
                appendMessage('bot', 'Scanne die aktuelle Webseite...', loadingId);
                try {
                    const pageText = await activeWebview.executeJavaScript('document.body.innerText');
                    const truncatedContent = pageText.substring(0, 6000);
                    const pageScanContext = `Basierend auf dem folgenden Text der aktuellen Webseite:\n\n---\n${truncatedContent}\n---\n\n`;
                    
                    let finalQuery = commandText;
                    if (lowerText.startsWith('fasse diese seite zusammen')) {
                        finalQuery = 'Fasse den bereitgestellten Webinhalt prägnant auf Deutsch zusammen.';
                    } else {
                        finalQuery = commandText.replace(/scanne diese seite und /i, '');
                    }
                    // Re-call sendToAI with the page content as context
                    return sendToAI(finalQuery, { isContinuation: true, context: pageScanContext, loadingId });
                } catch (e) {
                    console.error("Page scan failed:", e);
                    const loadingEl = document.getElementById(loadingId);
                    if (loadingEl) loadingEl.textContent = 'Fehler beim Scannen der Seite.';
                    return;
                }
            }
            // C. Screenshot Heuristic & Simple Commands
            const attachedScreenshot = aiContextPill && aiContextPill.dataset ? aiContextPill.dataset.imageDataUrl : null;
            if (!options.imageDataUrl && !attachedScreenshot) {
                const needsScreenshot = lowerText.includes('screenshot') || 
                                        lowerText.includes('was siehst du') || 
                                        lowerText.includes('analysiere diese seite') ||
                                        lowerText.includes('schau dir das an') ||
                                        lowerText.includes('was steht hier');

                if (needsScreenshot) {
                    const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
                    if (activeWebview && activeWebview.src !== 'about:blank' && activeWebview.style.display !== 'none') {
                        const loadingId = 'loading-' + Date.now();
                        appendMessage('bot', 'Erfasse den Bildschirm...', loadingId);
                        try {
                            const image = await activeWebview.capturePage();
                            const imageUrl = image.toDataURL();
                            return sendToAI(commandText, { isContinuation: true, imageDataUrl: imageUrl, loadingId });
                        } catch (e) {
                            console.error("Screenshot heuristic failed:", e);
                            const loadingEl = document.getElementById(loadingId);
                            if (loadingEl) loadingEl.textContent = 'Fehler beim Erfassen des Screenshots.';
                            return;
                        }
                    }
                }
                
                if (lowerText.startsWith('suche nach ') || lowerText.startsWith('suche ')) {
                    const query = commandText.substring(commandText.indexOf(' ') + 1);
                    appendMessage('bot', `Ich navigiere zur Suche für "${query}"...`);
                    const botReply = `Ich navigiere zur Suche für "${query}"...`;
                    appendMessage('bot', botReply);
                    if (typeof aiChatHistory !== 'undefined') aiChatHistory.push({ role: 'assistant', content: botReply });
                    navigate(query);
                    return;
                }
            }
        }
        // --- Step 2: Build Final Prompt ---
        const loadingId = options.loadingId || 'loading-' + Date.now();
        let finalContext = options.context || '';
        const fileContent = aiContextPill?.dataset.fileContent;
        const attachedScreenshot = aiContextPill?.dataset.imageDataUrl;

        if (aiContextPill && !aiContextPill.classList.contains('hidden')) {
            if (fileContent) {
                finalContext += `Nutze zusätzlich den folgenden Dateikontext:\n---\n${fileContent}\n---\n`;
            }
            if (attachedScreenshot && !options.imageDataUrl) {
                options.imageDataUrl = attachedScreenshot;
            }
            if (aiContextClear) aiContextClear.click();
        }
        
        const pageContextUrl = aiPageContextPill?.dataset.url;
        const pageContextTitle = aiPageContextPill?.dataset.title;
        if (aiPageContextPill && !aiPageContextPill.classList.contains('hidden') && pageContextUrl && !options.imageDataUrl) {
            finalContext += `Beziehe dich auf die aktuelle Webseite "${pageContextTitle}" (${pageContextUrl}).\n`;
        }
        if (finalContext) {
            commandText = `${finalContext}\nMeine Anweisung: ${commandText}`;
        }
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.textContent = 'Denkt nach...';
        } else {
            appendMessage('bot', 'Denkt nach...', loadingId);
        }
        // --- Step 3: Send to API ---
        try {
            let model, messages;
            const historyToUse = (typeof aiChatHistory !== 'undefined') ? aiChatHistory.slice(-11, -1) : [];
            if (options.imageDataUrl) {
                model = 'auto'; // Wird im Main-Prozess dynamisch gewählt (Vision)
                messages = [
                    ...historyToUse,
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: commandText },
                            { type: 'image_url', image_url: { url: options.imageDataUrl } }
                        ]
                    }
                ];
            } else {
                model = 'auto'; // Wird im Main-Prozess dynamisch gewählt (Günstigstes Text-Modell)
                const selectedMode = aiModes[currentAiModeIndex] || 'standard';
                const systemPrompt = systemPrompts[selectedMode] || systemPrompts.standard;
                messages = [
                    { 'role': 'system', 'content': systemPrompt },
                    ...historyToUse,
                    { 'role': 'user', 'content': commandText }
                ];
            }
            const data = await window.electronAPI.aiChat({
                model,
                messages,
                max_completion_tokens: 1024,
                temperature: 0.3,
                top_p: 1
            });
            let botMessage = data?.choices?.[0]?.message?.content || 'Keine Antwort erhalten.';
            const finalLoadingEl = document.getElementById(loadingId);
            if (finalLoadingEl) finalLoadingEl.remove();
            
            // --- Aktions-Tags analysieren und live ausführen ---
            const actionRegex = /\[ACTION:([A-Z_]+)(?::([^\]]+))?\]/g;
            let match;
            while ((match = actionRegex.exec(botMessage)) !== null) {
                const actionCmd = match[1];
                const actionArg = match[2] ? match[2].trim() : null;
                
                if (actionCmd === 'NEW_TAB') createTab();
                else if (actionCmd === 'OPEN_TAB' && actionArg) createTab(actionArg, { switchTo: false });
                else if (actionCmd === 'CLOSE_TAB') {
                    if (document.querySelectorAll('.tab').length > 1) closeTab(activeTabId);
                }
                else if (actionCmd === 'CLEAR_HISTORY' && clearHistoryBtn) clearHistoryBtn.click();
                else if (actionCmd === 'OPTIMIZE_RAM' && optimizeRamBtn) optimizeRamBtn.click();
                else if (actionCmd === 'DARK_MODE' && themeSelect) {
                    themeSelect.value = 'dark';
                    themeSelect.dispatchEvent(new Event('change'));
                }
                else if (actionCmd === 'LIGHT_MODE' && themeSelect) {
                    themeSelect.value = 'light';
                    themeSelect.dispatchEvent(new Event('change'));
                }
            }
            // Die Tags aus der sichtbaren Bot-Nachricht entfernen
            botMessage = botMessage.replace(/\[ACTION:[A-Z_]+(?::[^\]]+)?\]/g, '').trim();

            // Suggest-Tags auswerten und entfernen
            const suggestRegex = /\[SUGGEST_LINK:([^|\]]+)(?:\|([^\]]+))?\]/gi;
            let suggestMatch;
            const suggestedLinks = [];
            while ((suggestMatch = suggestRegex.exec(botMessage)) !== null) {
                const linkUrl = suggestMatch[1].trim();
                const linkTitle = suggestMatch[2] ? suggestMatch[2].trim() : linkUrl;
                suggestedLinks.push({ url: linkUrl, title: linkTitle });
            }
            botMessage = botMessage.replace(/\[SUGGEST_LINK:[^\]]+\]/gi, '').trim();

            if (typeof aiChatHistory !== 'undefined') aiChatHistory.push({ role: 'assistant', content: botMessage });

            const msgDiv = appendMessage('bot', botMessage);
            
            if (suggestedLinks.length > 0 && msgDiv) {
                const linksContainer = document.createElement('div');
                linksContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color, rgba(0,0,0,0.1));';
                suggestedLinks.forEach(link => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.style.cssText = 'background: rgba(10,132,255,0.1); border: 1px solid rgba(10,132,255,0.2); color: var(--accent-color, #0a84ff); padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;';
                    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> ${link.title}`;
                    btn.onmouseenter = () => { btn.style.background = 'rgba(10,132,255,0.2)'; btn.style.transform = 'translateY(-1px)'; };
                    btn.onmouseleave = () => { btn.style.background = 'rgba(10,132,255,0.1)'; btn.style.transform = 'translateY(0)'; };
                    btn.onclick = () => createTab(link.url);
                    linksContainer.appendChild(btn);
                });
                msgDiv.appendChild(linksContainer);
                if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;
            }
        } catch (error) {
            console.error("AI Error:", error);
            const finalLoadingEl = document.getElementById(loadingId);
            const msg = (error && error.message) ? String(error.message) : 'Fehler bei der Verbindung zu Aether.';
            if (finalLoadingEl) {
                finalLoadingEl.textContent = msg.includes('GROQ_API_KEY')
                    ? 'AI ist deaktiviert: GROQ_API_KEY fehlt.'
                    : msg;
            }
        }
    }

    function updateAudioIcon(el, isMuted) {
        if (!el) return;
        if (isMuted) {
            el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
            el.classList.add('muted');
            el.title = 'Stummschaltung aufheben';
        } else {
            el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            el.classList.remove('muted');
            el.title = 'Stummschalten';
        }
    }

    function getDomainFromUrl(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return null;
        }
    }

    let currentNotesDomain = null;
    
    function updateNotesContext() {
        const wv = getActiveWebview();
        let url = null;
        try { url = wv && typeof wv.getURL === 'function' ? wv.getURL() : null; } catch(e) {}
        if (!url && wv && wv.src) url = wv.src;
        const domain = getDomainFromUrl(url);
        if (!domain) {
            if (notesDomain) notesDomain.textContent = 'Keine Webseite';
            if (notesTextarea) { notesTextarea.value = ''; notesTextarea.disabled = true; }
            currentNotesDomain = null;
            return;
        }
        if (domain !== currentNotesDomain) {
            currentNotesDomain = domain;
            if (notesDomain) notesDomain.textContent = domain;
            if (notesTextarea) {
                notesTextarea.disabled = false;
                notesTextarea.value = localStorage.getItem(`aether-notes-${domain}`) || '';
            }
        }
    }

    if (notesTextarea) {
        notesTextarea.addEventListener('input', () => {
            if (currentNotesDomain) {
                localStorage.setItem(`aether-notes-${currentNotesDomain}`, notesTextarea.value);
            }
        });
    }

    function addWebviewEventListeners(webview) {
        const tabId = webview.getAttribute('data-tab-id');
        function updateTabUI() {
            const tabEl = document.getElementById(tabId);
            if (!tabEl) return;
            const titleEl = tabEl.querySelector('.tab-title');
            const iconEl = tabEl.querySelector('.tab-icon');
            const title = (webview.getTitle && webview.getTitle()) ? webview.getTitle() : '';
            const url = (webview.getURL && webview.getURL()) ? webview.getURL() : (webview.src || '');
            if (url) tabEl.dataset.url = url;
            if (titleEl) {
                let fallback = 'Neuer Tab';
                if (url && url !== 'about:blank') {
                    try {
                        fallback = new URL(url).hostname || url;
                    } catch {
                        fallback = url;
                    }
                }
                titleEl.textContent = (url === 'about:blank') ? 'Neuer Tab' : (title || fallback);
            }
            if (tabId === activeTabId && topAddressBar) topAddressBar.value = url === 'about:blank' ? '' : url;
            if (iconEl && !iconEl.getAttribute('src')) iconEl.setAttribute('src', DEFAULT_TAB_ICON_DATA_URL);
            scheduleSaveAppState();
            if (tabId === activeTabId) updateFavStar();
        }
        webview.addEventListener('did-finish-load', () => {
            updateTabUI();
            if (tabId === activeTabId) { updatePageContext(); updateNotesContext(); }
        });
        webview.addEventListener('page-title-updated', () => {
            updateTabUI();
            if (tabId === activeTabId) { updatePageContext(); updateNotesContext(); }
        });
        webview.addEventListener('page-favicon-updated', (event) => {
            const tabEl = document.getElementById(tabId);
            if (!tabEl) return;
            const iconEl = tabEl.querySelector('.tab-icon');
            if (!iconEl) return;
            const fav = Array.isArray(event.favicons) ? event.favicons.find((u) => typeof u === 'string' && u.trim()) : null;
            if (!fav) return;
            iconEl.setAttribute('src', fav);
            tabEl.dataset.icon = fav;
            scheduleSaveAppState();
        });
        webview.addEventListener('did-navigate', () => {
            updateTabUI();
            if (tabId === activeTabId) { updatePageContext(); updateNotesContext(); }
            const tabEl = document.getElementById(tabId);
            if (tabEl) {
                const ind = tabEl.querySelector('.tab-audio-indicator');
                if (ind && typeof webview.isAudioMuted === 'function' && !webview.isAudioMuted()) {
                    ind.classList.add('hidden');
                }
            }
        });
        webview.addEventListener('did-navigate-in-page', () => {
            updateTabUI();
            if (tabId === activeTabId) { updatePageContext(); updateNotesContext(); }
        });
        // Custom context menu requests emitted by `webview-preload.js`.
        webview.addEventListener('ipc-message', (e) => {
            try {
                if (!e || e.channel !== 'webview-context-menu') return;
                const payload = e.args && e.args[0] ? e.args[0] : null;
                if (!payload || typeof payload !== 'object') return;
                // webview-preload reports coordinates in the guest page viewport; translate to host window coords.
                const rect = webview.getBoundingClientRect();
                const menuX = rect.left + (Number(payload.x) || 0);
                const menuY = rect.top + (Number(payload.y) || 0);
                buildAndShowMenu('webview', { ...payload, menuX, menuY });
            } catch {
                // ignore
            }
        });
        
        webview.addEventListener('media-started-playing', () => {
            const tabEl = document.getElementById(tabId);
            if (!tabEl) return;
            const ind = tabEl.querySelector('.tab-audio-indicator');
            if (ind && typeof webview.isAudioMuted === 'function') {
                ind.classList.remove('hidden');
                updateAudioIcon(ind, webview.isAudioMuted());
            }
        });
        webview.addEventListener('media-paused', () => {
            const tabEl = document.getElementById(tabId);
            if (!tabEl) return;
            const ind = tabEl.querySelector('.tab-audio-indicator');
            if (ind && typeof webview.isAudioMuted === 'function' && !webview.isAudioMuted()) {
                ind.classList.add('hidden');
            }
        });
    }

    function updateWebviewDisplay() {
        const isHome = !activeTabId || (document.getElementById(activeTabId)?.dataset.url === 'about:blank');
        const hasSplit = splitTabId && splitTabId !== activeTabId && document.getElementById(splitTabId);
        
        if (webviewsContainer) {
            webviewsContainer.style.flexDirection = 'row';
        }

        document.querySelectorAll('webview').forEach(w => {
            const tid = w.dataset.tabId;
            if (tid === activeTabId) {
                w.style.display = (isHome && !hasSplit) ? 'none' : 'flex';
                w.style.flex = '1';
                w.style.borderLeft = 'none';
            } else if (tid === splitTabId && hasSplit) {
                w.style.display = 'flex';
                w.style.flex = '1';
                w.style.borderLeft = '1px solid var(--border-color, rgba(0,0,0,0.1))';
            } else {
                w.style.display = 'none';
            }
        });

        if (isHome && !hasSplit) {
            if (splashView) splashView.style.display = 'flex';
        } else {
            if (splashView) splashView.style.display = 'none';
        }
    }

    function toggleSplitView(tabId) {
        if (splitTabId === tabId) {
            splitTabId = null;
            const tabEl = document.getElementById(tabId);
            if (tabEl) tabEl.classList.remove('split-active');
        } else {
            if (splitTabId) {
                const oldTab = document.getElementById(splitTabId);
                if (oldTab) oldTab.classList.remove('split-active');
            }
            splitTabId = tabId;
            const newTab = document.getElementById(tabId);
            if (newTab) newTab.classList.add('split-active');
            wakeTab(tabId);
        }
        updateWebviewDisplay();
    }

// Tab Management (dynamic + persisted)
    function nextTabId(preferred) {
        if (preferred && !document.getElementById(preferred)) {
            const m = String(preferred).match(/^tab-(\d+)$/);
            if (m) tabCounter = Math.max(tabCounter, Number(m[1]) || 0);
            return preferred;
        }
        let id = null;
        do {
            tabCounter++;
            id = `tab-${tabCounter}`;
        } while (document.getElementById(id));
        return id;
    }
    function createWebviewForTab(tabId, url) {
        if (!webviewsContainer) return null;
        const webview = document.createElement('webview');
        webview.setAttribute('data-tab-id', tabId);
        // Enable in-webview features (e.g. custom context menu events) without exposing Node.js to pages.
        try {
            const baseDir = window.electronAPI && window.electronAPI.getAppDir ? String(window.electronAPI.getAppDir()) : '';
            const preloadPath = baseDir ? (baseDir.replace(/[\\\/]+$/, '') + '\\webview-preload.js') : 'webview-preload.js';
            webview.setAttribute('preload', preloadPath);
        } catch {
            webview.setAttribute('preload', 'webview-preload.js');
        }
        webview.style.display = 'none';
        
        // Die URL über das Attribut setzen, BEVOR wir es in den DOM einhängen (verhindert ERR_ABORTED)
        webview.setAttribute('src', url || 'about:blank');

        webviewsContainer.appendChild(webview);

        webview.addEventListener('dom-ready', () => {
            // WebView methods can throw if the element was removed before dom-ready resolves.
            if (!webview.isConnected) return;
            const tabEl = document.getElementById(tabId);
            if (!tabEl) return;
            try {
                tabEl.dataset.webContentsId = String(webview.getWebContentsId());
            } catch {
                // ignore
            }
        });
        addWebviewEventListeners(webview);
        return webview;
    }
    function createTab(url = 'about:blank', opts = {}) {
        if (!tabsContainer || !addTabBtn) return null;
        const tabId = nextTabId(opts.tabId);
        const isAsleep = !!opts.asleep;
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.id = tabId;
        tab.dataset.url = url || 'about:blank';
        tab.setAttribute('draggable', 'true');
        tab.dataset.lastFocusedAtMs = String(Number(opts.lastFocusedAtMs || Date.now()));
        tab.innerHTML = `<img class="tab-icon" src="${DEFAULT_TAB_ICON_DATA_URL}" alt=""><span class="tab-title">Neuer Tab</span><span class="tab-audio-indicator hidden" title="Stummschalten"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span><span class="close-tab">×</span>`;
        if (opts.pinned) tab.classList.add('pinned');
        if (isAsleep) {
            tab.classList.add('asleep');
            tab.dataset.asleep = '1';
        }
        tabsContainer.insertBefore(tab, addTabBtn);
        const titleEl = tab.querySelector('.tab-title');
        if (titleEl && opts.title) titleEl.textContent = opts.title;
        const iconEl = tab.querySelector('.tab-icon');
        if (iconEl && opts.icon) {
            iconEl.setAttribute('src', opts.icon);
            tab.dataset.icon = opts.icon;
        }
        if (!isAsleep) createWebviewForTab(tabId, url);
        if (opts.switchTo === false) {
            scheduleSaveAppState();
            return tabId;
        }
        switchTab(tabId);
        return tabId;
    }
    function wakeTab(tabId) {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return null;
        if (!tabEl.classList.contains('asleep') && tabEl.dataset.asleep !== '1') {
            return document.querySelector(`webview[data-tab-id="${tabId}"]`);
        }
        const url = tabEl.dataset.url || 'about:blank';
        tabEl.classList.remove('asleep');
        tabEl.dataset.asleep = '0';
        const wv = createWebviewForTab(tabId, url);
        scheduleSaveAppState();
        return wv;
    }
    function switchTab(tabId, opts = {}) {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;
        
        if (tabId === splitTabId && activeTabId !== tabId) {
            splitTabId = activeTabId;
            const oldSplit = document.getElementById(splitTabId);
            if (oldSplit) oldSplit.classList.add('split-active');
            tabEl.classList.remove('split-active');
        }
        
        activeTabId = tabId;
        wakeTab(tabId);
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tabEl.classList.add('active');
        tabEl.dataset.lastFocusedAtMs = String(Date.now());
        const activeWebview = document.querySelector(`webview[data-tab-id="${tabId}"]`);
        let url = tabEl.dataset.url || 'about:blank';
        try {
            if (activeWebview && activeWebview.getURL) {
                const u = activeWebview.getURL();
                if (u) url = u;
            } else if (activeWebview && activeWebview.src) {
                url = activeWebview.src;
            }
        } catch {
            // WebView getURL can throw if dom-ready hasn't fired yet.
        }
        if (topAddressBar) topAddressBar.value = url === 'about:blank' ? '' : url;
        resetViews(true);
        
        updateWebviewDisplay();
        
        updatePageContext();
        updateNotesContext();
        scheduleSaveAppState();
        updateFavStar();
    }
    function closeTab(tabId, opts = {}) {
        const tab = document.getElementById(tabId);
        if (!tab) return;
        const webview = document.querySelector(`webview[data-tab-id="${tabId}"]`);
        if (webview) webview.remove();
        tab.remove();
        
        if (tabId === splitTabId) {
            splitTabId = null;
        }

        if (activeTabId === tabId) {
            const tabs = Array.from(document.querySelectorAll('.tab'));
            const next = tabs[0] || null;
            if (next) {
                switchTab(next.id);
            } else {
                if (opts.noAutoCreate) {
                    activeTabId = null;
                    resetViews(true);
                    updateWebviewDisplay();
                } else {
                    createTab('about:blank');
                }
            }
        } else {
            updateWebviewDisplay();
        }
        if (!opts.skipSave) scheduleSaveAppState();
    }
    function sleepTab(tabId, force = false) {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return false;
        if (!force && tabId === activeTabId) return false;
        if (tabEl.classList.contains('asleep') || tabEl.dataset.asleep === '1') return false;
        const wv = document.querySelector(`webview[data-tab-id="${tabId}"]`);
        if (!wv) {
            tabEl.classList.add('asleep');
            tabEl.dataset.asleep = '1';
            scheduleSaveAppState();
            return true;
        }
        try {
            const url = wv.getURL ? wv.getURL() : (wv.src || 'about:blank');
            tabEl.dataset.url = url;
        } catch {
            // ignore
        }
        // Prefer the dom-ready captured id; calling getWebContentsId() too early throws.
        const wcId = Number(tabEl.dataset.webContentsId || 0) || null;
        wv.remove();
        tabEl.classList.add('asleep');
        tabEl.dataset.asleep = '1';
        if (window.electronAPI && window.electronAPI.destroyWebContents && wcId) {
            window.electronAPI.destroyWebContents(wcId).catch(() => { /* ignore */ });
        }
        scheduleSaveAppState();
        return true;
    }
    function reclaimMemory() {
        const thresholdMs = 20 * 60_000;
        const now = Date.now();
        const tabs = Array.from(document.querySelectorAll('.tab'));
        for (const t of tabs) {
            if (t.id === activeTabId) continue;
            const last = Number(t.dataset.lastFocusedAtMs || 0) || 0;
            if (!last) continue;
            if (now - last >= thresholdMs) sleepTab(t.id);
        }
    }
    
    // --- Tab Container Event Delegation ---
    let draggedTabId = null;
    if (tabsContainer) {
        tabsContainer.addEventListener('dragstart', (e) => {
            const tab = e.target.closest('.tab');
            if (tab) {
                draggedTabId = tab.id;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', tab.id);
                setTimeout(() => tab.classList.add('dragging'), 0);
            }
        });

        tabsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const draggingTab = document.getElementById(draggedTabId);
            if (!draggingTab) return;
            
            const draggableElements = [...tabsContainer.querySelectorAll('.tab:not(.dragging)')].filter(el => el.id !== draggedTabId);
            const afterElement = draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientX - box.left - box.width / 2;
                return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;

            if (afterElement == null) tabsContainer.insertBefore(draggingTab, addTabBtn);
            else tabsContainer.insertBefore(draggingTab, afterElement);
        });

        tabsContainer.addEventListener('dragend', (e) => {
            const tab = document.getElementById(draggedTabId);
            if (tab) tab.classList.remove('dragging');
            
            // Wurde es ausserhalb des Browserfensters abgeworfen?
            const isOutside = e.clientX < 0 || e.clientY < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight;
            if (isOutside && draggedTabId) {
                const dragUrl = tab ? (tab.dataset.url || 'about:blank') : 'about:blank';
                if (window.electronAPI && window.electronAPI.createNewWindow) window.electronAPI.createNewWindow(dragUrl);
                
                // Wenn der letzte Tab rausgezogen wird -> aktuelles Fenster komplett schließen wie in Chrome
                if (document.querySelectorAll('.tab').length === 1) {
                    if (window.electronAPI && window.electronAPI.closeWindow) window.electronAPI.closeWindow();
                } else {
                    closeTab(draggedTabId, { skipSave: true });
                }
            }
            draggedTabId = null;
            scheduleSaveAppState();
        });
    }

    if (tabsContainer) {
        tabsContainer.addEventListener('contextmenu', (e) => {
            const tab = e.target.closest('.tab');
            if (tab) {
                e.preventDefault();
                buildAndShowMenu('tab', { tabId: tab.id, x: e.clientX, y: e.clientY });
            }
        });

        tabsContainer.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.close-tab');
            if (closeBtn) {
                e.stopPropagation();
                const tab = e.target.closest('.tab');
                if (tab) closeTab(tab.id);
                return;
            }
            const audioBtn = e.target.closest('.tab-audio-indicator');
            if (audioBtn) {
                e.stopPropagation();
                const tab = e.target.closest('.tab');
                if (tab) {
                    const wv = document.querySelector(`webview[data-tab-id="${tab.id}"]`);
                    if (wv && typeof wv.isAudioMuted === 'function') {
                        const isMuted = !wv.isAudioMuted();
                        wv.setAudioMuted(isMuted);
                        updateAudioIcon(audioBtn, isMuted);
                    }
                }
                return;
            }
            const tab = e.target.closest('.tab');
            if (tab) {
                switchTab(tab.id);
            }
        });
    }
    function restoreTabsFromState() {
        if (isStandalone) return;
        const state = loadAppState();
        // Clean slate (index.html doesn't ship a static tab/webview anymore, but keep this robust).
        document.querySelectorAll('.tab').forEach((t) => t.remove());
        document.querySelectorAll('webview').forEach((w) => w.remove());
        if (state && state.v === 1 && Array.isArray(state.tabs) && state.tabs.length) {
            tabCounter = Number(state.tabCounter || 0) || 0;
            for (const t of state.tabs) {
                if (!t || typeof t !== 'object') continue;
                createTab(t.url || 'about:blank', {
                    tabId: t.id,
                    switchTo: false,
                    title: t.title,
                    icon: t.icon,
                    pinned: !!t.pinned,
                    asleep: !!t.asleep,
                    lastFocusedAtMs: Number(t.lastFocusedAtMs || 0) || 0,
                });
            }
            activeTabId = state.activeTabId || null;
            if (activeTabId && document.getElementById(activeTabId)) {
                switchTab(activeTabId);
            }
            return;
        }
        // Default: one blank tab.
        createTab('about:blank');
    }
    try {
        restoreTabsFromState();
    } catch (e) {
        console.error('restoreTabsFromState failed:', e);
        // Continue wiring events so UI doesn't go dead.
    }

    // Wenn das Fenster als neuer Tab geöffnet wurde (durch Rausziehen)
    if (window.electronAPI && window.electronAPI.onOpenInitialUrl) {
        window.electronAPI.onOpenInitialUrl((url) => {
            setTimeout(() => {
                const existingTabs = Array.from(document.querySelectorAll('.tab'));
                existingTabs.forEach(t => closeTab(t.id, { skipSave: true, noAutoCreate: true }));
                createTab(url);
            }, 50);
        });
    }
    window.addEventListener('beforeunload', () => saveAppState());
    window.setInterval(reclaimMemory, 60_000);

    // --- Systemwarnung Popup Logik ---
    function ensureSystemWarningPopup() {
        let popup = document.getElementById('system-warning-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'system-warning-popup';
            popup.innerHTML = `
                <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #ff3b30; display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Systemwarnung
                </div>
                <div id="sys-warn-msg" style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">Hoher Ressourcenverbrauch erkannt.</div>
                <button id="sys-warn-optimize-btn" class="settings-button" style="width: 100%; justify-content: center; background: var(--bg-tertiary); color: var(--text-primary); border-color: var(--border-color);">Jetzt optimieren</button>
                <div id="sys-warn-close" style="position: absolute; top: 12px; right: 12px; cursor: pointer; color: var(--text-secondary); opacity: 0.7;">
                    <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            `;
            document.body.appendChild(popup);

            popup.querySelector('#sys-warn-close').addEventListener('click', () => {
                hideSystemWarning(true);
            });
            
            popup.querySelector('#sys-warn-optimize-btn').addEventListener('click', () => {
                if (optimizeRamBtn) optimizeRamBtn.click();
                else {
                    const tabs = Array.from(document.querySelectorAll('.tab'));
                    for (const t of tabs) {
                        if (t.id !== activeTabId && !t.classList.contains('asleep')) sleepTab(t.id, true);
                    }
                }
                hideSystemWarning(true);
            });
        }
        return popup;
    }

    let warningDismissed = false;
    function showSystemWarning(ram, tabs) {
        if (warningDismissed) return;
        const popup = ensureSystemWarningPopup();
        const msgEl = document.getElementById('sys-warn-msg');
        let reasons = [];
        if (ram > 3000) reasons.push(`RAM-Verbrauch über 3000 MB (${Math.round(ram)} MB)`);
        if (tabs >= 10) reasons.push(`Zu viele offene Tabs (${tabs})`);
        if (msgEl) msgEl.textContent = reasons.join(' & ') + '. Optimiere das System, um die Performance zu verbessern.';
        
        popup.classList.add('show');
    }

    function hideSystemWarning(dismiss = false) {
        const popup = document.getElementById('system-warning-popup');
        if (popup) popup.classList.remove('show');
        if (dismiss) {
            warningDismissed = true;
            setTimeout(() => { warningDismissed = false; }, 5 * 60 * 1000); // 5 Minuten stumm schalten
        }
    }

    async function checkSystemResourcesGlobally() {
        let totalRam = 0;
        if (window.electronAPI && window.electronAPI.getProcessMetrics) {
            try {
                const metrics = await window.electronAPI.getProcessMetrics();
                for (const p of metrics) {
                    totalRam += (p.memory.workingSetSize / 1024); // KB to MB
                }
            } catch(e) {}
        }
        const tabCount = document.querySelectorAll('.tab').length;
        if (totalRam > 3000 || tabCount >= 10) {
            showSystemWarning(totalRam, tabCount);
        } else {
            hideSystemWarning();
        }
    }
    window.setInterval(checkSystemResourcesGlobally, 10000);

    // --- Speedtest Mock Funktion ---
    function runSpeedtest() {
        const btn = document.getElementById('start-speedtest-btn');
        const pPing = document.getElementById('st-ping');
        const pDown = document.getElementById('st-down');
        const pUp = document.getElementById('st-up');
        if (!btn || btn.disabled) return;
        
        btn.disabled = true;
        btn.textContent = 'Test läuft...';
        pPing.textContent = 'Messe...';
        pDown.textContent = '-- Mbps';
        pUp.textContent = '-- Mbps';

        setTimeout(() => {
            pPing.textContent = (Math.floor(Math.random() * 20) + 10) + ' ms';
            pDown.textContent = 'Messe...';
            setTimeout(() => {
                let down = 0;
                const downInt = setInterval(() => {
                    down += Math.random() * 50;
                    pDown.textContent = down.toFixed(1) + ' Mbps';
                }, 100);
                setTimeout(() => {
                    clearInterval(downInt);
                    pDown.textContent = (Math.random() * 200 + 50).toFixed(1) + ' Mbps';
                    pUp.textContent = 'Messe...';
                    setTimeout(() => {
                        let up = 0;
                        const upInt = setInterval(() => {
                            up += Math.random() * 20;
                            pUp.textContent = up.toFixed(1) + ' Mbps';
                        }, 100);
                        setTimeout(() => {
                            clearInterval(upInt);
                            pUp.textContent = (Math.random() * 50 + 20).toFixed(1) + ' Mbps';
                            btn.disabled = false;
                            btn.textContent = 'Test starten';
                        }, 1500);
                    }, 500);
                }, 2000);
            }, 500);
        }, 1000);
    }
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'start-speedtest-btn') runSpeedtest();
    });

    let resourceMonitorInterval = null;
    if (resourcesNavBtn) {
        resourcesNavBtn.onclick = () => {
            resetViews();
            if (resourcesView) resourcesView.classList.remove('hidden');
            resourcesNavBtn.classList.add('active');
            renderResources();
            if (!resourceMonitorInterval) resourceMonitorInterval = setInterval(renderResources, 2000);
        };
    }

    async function renderResources() {
        if (!resourcesView || resourcesView.classList.contains('hidden')) {
            if (resourceMonitorInterval) { clearInterval(resourceMonitorInterval); resourceMonitorInterval = null; }
            return;
        }
        if (!window.electronAPI || !window.electronAPI.getProcessMetrics) return;
        try {
            const metrics = await window.electronAPI.getProcessMetrics();
            if (!resourcesList) return;
            resourcesList.innerHTML = '';
            let totalRam = 0;
            for (const p of metrics) {
                const card = document.createElement('div');
                card.className = 'settings-card';
                card.style.padding = '12px 16px';
                let title = p.type === 'Browser' ? 'Main Process' : p.type;
                if (p.name) title += ` (${p.name})`;
                const memMB = (p.memory.workingSetSize / 1024).toFixed(1);
                totalRam += (p.memory.workingSetSize / 1024);
                const cpu = p.cpu.percentCPUUsage.toFixed(1);
                card.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center;"><div style="font-weight:600; font-size:14px;">${title} <span style="font-size:10px; color:var(--text-secondary, #86868b);">PID: ${p.pid}</span></div><div style="font-size:13px; font-family:monospace;">CPU: ${cpu}% | RAM: ${memMB} MB</div></div>`;
                resourcesList.appendChild(card);
            }
            if (totalRamUsageEl) {
                totalRamUsageEl.textContent = totalRam.toFixed(1) + ' MB';
            }
        } catch (e) {}
    }

    if (optimizeRamBtn) {
        optimizeRamBtn.addEventListener('click', () => {
            const tabs = Array.from(document.querySelectorAll('.tab'));
            let count = 0;
            for (const t of tabs) {
                if (t.id !== activeTabId && !t.classList.contains('asleep')) {
                    const success = sleepTab(t.id, true);
                    if (success) count++;
                }
            }
            const oldText = optimizeRamBtn.textContent;
            optimizeRamBtn.textContent = count > 0 ? `${count} Tabs pausiert!` : 'Bereits optimiert!';
            optimizeRamBtn.style.background = '#34c759';
            setTimeout(() => {
                optimizeRamBtn.textContent = oldText;
                optimizeRamBtn.style.background = '';
            }, 2000);
        });
    }

    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => createTab());
    }
    
    // Navigation Event Listeners
    if (homeNavBtn) {
        homeNavBtn.onclick = () => {
            resetViews();
            splashView.style.display = 'flex';
            homeNavBtn.classList.add('active');
            topAddressBar.value = '';
        };
    }
    if (newsNavBtn) {
        newsNavBtn.onclick = () => {
            resetViews();
            if (newsView) newsView.classList.remove('hidden');
            newsNavBtn.classList.add('active');
            loadNewsFeeds();
        };
    }
    if (settingsNavBtn) {
        settingsNavBtn.onclick = () => {
            resetViews();
            if (settingsView) settingsView.classList.remove('hidden');
            settingsNavBtn.classList.add('active');
            refreshGroqKeyStatus();
        };
    }

    // Settings wiring (these controls existed but were previously not bound)
    async function refreshGroqKeyStatus() {
        if (!groqApiKeyStatus) return;
        try {
            if (!window.electronAPI || !window.electronAPI.groqKeyStatus) {
                groqApiKeyStatus.textContent = 'AI: nicht verfÃ¼gbar';
                return;
            }
            const s = await window.electronAPI.groqKeyStatus();
            if (!s || !s.hasKey) {
                groqApiKeyStatus.textContent = 'AI: nicht konfiguriert';
                return;
            }
            if (s.source === 'env') {
                groqApiKeyStatus.textContent = 'AI: aktiv (GROQ_API_KEY)';
                return;
            }
            const enc = s.encryptionAvailable ? 'verschlÃ¼sselt' : 'unverschlÃ¼sselt';
            groqApiKeyStatus.textContent = `AI: aktiv (lokal gespeichert, ${enc})`;
        } catch (e) {
            groqApiKeyStatus.textContent = 'AI: Statusfehler';
        }
    }

    try {
        const savedTheme = localStorage.getItem('aether-theme') || 'light';
        if (themeSelect) themeSelect.value = savedTheme;
        document.documentElement.classList.toggle('theme-dark', savedTheme === 'dark');
        if (window.electronAPI && window.electronAPI.setTheme) window.electronAPI.setTheme(savedTheme);
    } catch {
        // ignore
    }
    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            const v = themeSelect.value === 'dark' ? 'dark' : 'light';
            try { localStorage.setItem('aether-theme', v); } catch { /* ignore */ }
            document.documentElement.classList.toggle('theme-dark', v === 'dark');
            if (window.electronAPI && window.electronAPI.setTheme) window.electronAPI.setTheme(v);
        });
    }
    if (searchEngineSelect) {
        searchEngineSelect.value = searchEngine;
        searchEngineSelect.addEventListener('change', () => {
            const v = ['google', 'duckduckgo', 'bing'].includes(searchEngineSelect.value) ? searchEngineSelect.value : 'google';
            searchEngine = v;
            try { localStorage.setItem('aether-search-engine', v); } catch { /* ignore */ }
        });
    }

    // Browser Data Import (Passwords/Bookmarks)
    if (importBrowserBtn) {
        importBrowserBtn.addEventListener('click', async () => {
            const browser = importBrowserSelect ? importBrowserSelect.value : 'chrome';
            if (importStatus) { importStatus.textContent = 'Importiere Daten, bitte warten...'; importStatus.style.color = 'inherit'; }
            importBrowserBtn.disabled = true;
            try {
                if (window.electronAPI && window.electronAPI.importBrowserData) {
                    const data = await window.electronAPI.importBrowserData(browser);
                    const passCount = data.passwordsCount || 0;
                    const histItems = data.history || [];

                    if (histItems.length > 0) {
                        let existingUrls = new Set(browserHistory.map(h => h.url));
                        histItems.forEach(item => {
                            if (!existingUrls.has(item.url)) {
                                browserHistory.push(item);
                                existingUrls.add(item.url);
                            }
                        });
                        browserHistory.sort((a, b) => b.time - a.time);
                        if (browserHistory.length > 1000) browserHistory.length = 1000;
                        localStorage.setItem('aether-history', JSON.stringify(browserHistory));
                        renderHistory();
                    }

                    if (importStatus) { importStatus.textContent = `Erfolgreich! ${passCount} Passwörter und ${histItems.length} Verlaufseinträge importiert.`; importStatus.style.color = '#34c759'; }
                } else {
                    if (importStatus) { importStatus.textContent = 'Fehler: API nicht verfügbar. Hast du preload.js aktualisiert?'; importStatus.style.color = '#ff3b30'; }
                }
            } catch (e) {
                console.error("Import Error:", e);
                if (importStatus) { importStatus.textContent = `Fehler: ${e.message}`; importStatus.style.color = '#ff3b30'; }
            } finally {
                importBrowserBtn.disabled = false;
            }
        });
    }

    // Groq API key (stored in main process; never read back into the renderer)
    refreshGroqKeyStatus();
    if (groqApiKeySaveBtn) {
        groqApiKeySaveBtn.addEventListener('click', async () => {
            const key = groqApiKeyInput ? String(groqApiKeyInput.value || '').trim() : '';
            if (!key) return;
            try {
                if (window.electronAPI && window.electronAPI.setGroqKey) {
                    await window.electronAPI.setGroqKey(key);
                }
                if (groqApiKeyInput) groqApiKeyInput.value = '';
            } catch (e) {
                if (groqApiKeyStatus) groqApiKeyStatus.textContent = 'AI: Speichern fehlgeschlagen';
            } finally {
                refreshGroqKeyStatus();
            }
        });
    }
    if (groqApiKeyInput && groqApiKeySaveBtn) {
        groqApiKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                e.preventDefault();
                groqApiKeySaveBtn.click();
            }
        });
    }
    if (groqApiKeyClearBtn) {
        groqApiKeyClearBtn.addEventListener('click', async () => {
            try {
                if (window.electronAPI && window.electronAPI.clearGroqKey) {
                    await window.electronAPI.clearGroqKey();
                }
                if (groqApiKeyInput) groqApiKeyInput.value = '';
            } catch (e) {
                if (groqApiKeyStatus) groqApiKeyStatus.textContent = 'AI: Entfernen fehlgeschlagen';
            } finally {
                refreshGroqKeyStatus();
            }
        });
    }
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', async () => {
            const ok = window.confirm('Browserdaten löschen? Verlauf, Favoriten, Tabs, Cookies und Cache werden entfernt.');
            if (!ok) return;
            try {
                if (window.electronAPI && window.electronAPI.clearBrowserData) await window.electronAPI.clearBrowserData();
            } catch (e) {
                console.error('clearBrowserData failed:', e);
            }
            try {
                localStorage.removeItem('aether-history');
                localStorage.removeItem('aether-favorites');
                localStorage.removeItem(APP_STATE_KEY);
            } catch {
                // ignore
            }
            browserHistory = [];
            favorites = [];
            renderFavoritesBar();
            renderHistory();
            restoreTabsFromState();
            if (isStandalone) {
                refreshGroqKeyStatus();
            } else if (settingsNavBtn) {
                settingsNavBtn.click();
            }
        });
    }
    // App updates (GitHub Releases via electron-updater; only works in packaged builds)
    function setUpdateStatus(text) {
        if (updateStatusEl) updateStatusEl.textContent = String(text || '');
    }

    async function refreshVersionHint() {
        try {
            if (window.electronAPI && window.electronAPI.appVersion) {
                const v = await window.electronAPI.appVersion();
                const ver = v && v.version ? String(v.version) : '';
                const tag = v && v.tag ? String(v.tag) : '';
                const buildSha = v && v.buildSha ? String(v.buildSha) : '';
                const displayTag = tag || (ver ? `v${ver}` : '');
                if (appVersionEl && displayTag) {
                    const shortSha = buildSha ? buildSha.slice(0, 7) : '';
                    appVersionEl.textContent = shortSha ? `Version: ${displayTag} (${shortSha})` : `Version: ${displayTag}`;
                }
            }
        } catch {
            // ignore
        }
    }

    refreshVersionHint();

    if (window.electronAPI && window.electronAPI.onUpdateStatus) {
        window.electronAPI.onUpdateStatus((payload) => {
            const state = payload && payload.state ? String(payload.state) : '';
            if (state === 'checking') setUpdateStatus('Update: suche...');
            else if (state === 'available') setUpdateStatus('Update: verfÃ¼gbar (Download lÃ¤uft)');
            else if (state === 'none') setUpdateStatus('Update: aktuell');
            else if (state === 'downloading') {
                const p = payload && payload.progress ? payload.progress : null;
                const pct = p && typeof p.percent === 'number' ? Math.max(0, Math.min(100, p.percent)) : null;
                setUpdateStatus(pct == null ? 'Update: lade herunter...' : `Update: lade herunter... ${pct.toFixed(0)}%`);
            } else if (state === 'downloaded') {
                setUpdateStatus('Update: bereit zur Installation');
                if (updateInstallBtn) updateInstallBtn.disabled = false;
            } else if (state === 'installing') setUpdateStatus('Update: installiere...');
            else if (state === 'error') setUpdateStatus(`Update: Fehler (${payload && payload.error ? payload.error : 'unbekannt'})`);
        });
    }

    if (updateCheckBtn) {
        updateCheckBtn.addEventListener('click', async () => {
            setUpdateStatus('Update: suche...');
            try {
                if (!window.electronAPI || !window.electronAPI.checkForUpdates) throw new Error('no api');
                await window.electronAPI.checkForUpdates();
            } catch {
                setUpdateStatus('Update: nur in installierter App verfÃ¼gbar');
            }
        });
    }

    if (updateInstallBtn) {
        updateInstallBtn.addEventListener('click', async () => {
            try {
                if (!window.electronAPI || !window.electronAPI.installUpdate) return;
                await window.electronAPI.installUpdate();
            } catch {
                setUpdateStatus('Update: Installation fehlgeschlagen');
            }
        });
    }

    function hideAllRightSidebars() {
        if (aiSidebar) aiSidebar.classList.add('hidden');
        if (historySidebar) historySidebar.classList.add('hidden');
        if (downloadsSidebar) downloadsSidebar.classList.add('hidden');
        if (notesSidebar) notesSidebar.classList.add('hidden');
    }

    if (aiToggleBtn) {
        aiToggleBtn.onclick = () => {
            const isHidden = aiSidebar && aiSidebar.classList.contains('hidden');
            hideAllRightSidebars();
            if (isHidden && aiSidebar) {
                aiSidebar.classList.remove('hidden');
                updatePageContext();
            }
        };
    }
    if (historyToggleBtn) {
        historyToggleBtn.onclick = () => {
            const isHidden = historySidebar && historySidebar.classList.contains('hidden');
            hideAllRightSidebars();
            if (isHidden && historySidebar) historySidebar.classList.remove('hidden');
        };
    }
    if (downloadsToggleBtn) {
        downloadsToggleBtn.onclick = () => {
            const isHidden = downloadsSidebar && downloadsSidebar.classList.contains('hidden');
            hideAllRightSidebars();
            if (isHidden && downloadsSidebar) downloadsSidebar.classList.remove('hidden');
        };
    }
    if (notesToggleBtn) {
        notesToggleBtn.onclick = () => {
            const isHidden = notesSidebar && notesSidebar.classList.contains('hidden');
            hideAllRightSidebars();
            if (isHidden && notesSidebar) {
                notesSidebar.classList.remove('hidden');
                updateNotesContext();
            }
        };
    }
    if (closeAiBtn) {
        closeAiBtn.onclick = () => {
            if (aiSidebar) aiSidebar.classList.add('hidden');
        };
    }
    if (closeHistoryBtn) {
        closeHistoryBtn.onclick = () => {
            if (historySidebar) historySidebar.classList.add('hidden');
        };
    }
    if (closeDownloadsBtn) {
        closeDownloadsBtn.onclick = () => {
            if (downloadsSidebar) downloadsSidebar.classList.add('hidden');
        };
    }
    if (closeNotesBtn) {
        closeNotesBtn.onclick = () => {
            if (notesSidebar) notesSidebar.classList.add('hidden');
        };
    }
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = () => {
            browserHistory = [];
            localStorage.removeItem('aether-history');
            renderHistory();
        };
    }
    // Input Event Listeners
    const addressSuggestions = document.getElementById('address-suggestions');
    let suggestionSelectedIndex = -1;
    let currentSuggestions = [];
    let suggestionTimeout;

    async function fetchAndShowSuggestions(query) {
        if (!query.trim()) {
            if (addressSuggestions) addressSuggestions.classList.add('hidden');
            return;
        }
        try {
            let results = [];
            if (window.electronAPI && window.electronAPI.getSearchSuggestions) {
                results = await window.electronAPI.getSearchSuggestions(query);
            }
            const histMatches = (browserHistory || [])
                .filter(h => (h.title || '').toLowerCase().includes(query.toLowerCase()) || (h.url || '').toLowerCase().includes(query.toLowerCase()))
                .slice(0, 3)
                .map(h => ({ isHistory: true, text: h.title || h.url, url: h.url }));

            currentSuggestions = [...histMatches, ...(results || []).slice(0, 6).map(r => ({ isHistory: false, text: r }))];
            
            if (currentSuggestions.length === 0) {
                if (addressSuggestions) addressSuggestions.classList.add('hidden');
                return;
            }
            if (addressSuggestions) {
                addressSuggestions.innerHTML = '';
                currentSuggestions.forEach((sugg, index) => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.dataset.index = index;
                    
                    const icon = sugg.isHistory 
                        ? `<svg class="suggestion-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
                        : `<svg class="suggestion-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
                    
                    const textSpan = document.createElement('span');
                    textSpan.style.whiteSpace = 'nowrap';
                    textSpan.style.overflow = 'hidden';
                    textSpan.style.textOverflow = 'ellipsis';
                    textSpan.textContent = sugg.text;
                    
                    item.innerHTML = icon;
                    item.appendChild(textSpan);
                    
                    if (sugg.isHistory) {
                        const urlSpan = document.createElement('span');
                        urlSpan.style.fontSize = '11px';
                        urlSpan.style.color = 'var(--text-secondary, #86868b)';
                        urlSpan.style.marginLeft = 'auto';
                        urlSpan.style.whiteSpace = 'nowrap';
                        urlSpan.style.overflow = 'hidden';
                        urlSpan.style.textOverflow = 'ellipsis';
                        urlSpan.style.maxWidth = '150px';
                        urlSpan.textContent = sugg.url;
                        item.appendChild(urlSpan);
                    }

                    item.addEventListener('mousedown', (e) => {
                        e.preventDefault(); // Prevents blur from hiding suggestions
                    });
                    item.addEventListener('click', () => {
                        topAddressBar.value = sugg.isHistory ? sugg.url : sugg.text;
                        addressSuggestions.classList.add('hidden');
                        navigate(topAddressBar.value);
                    });

                    addressSuggestions.appendChild(item);
                });
                
                suggestionSelectedIndex = -1;
                addressSuggestions.classList.remove('hidden');
            }
        } catch (e) {
            console.error("Failed to fetch suggestions", e);
        }
    }

    if (topAddressBar) {
        topAddressBar.addEventListener('input', () => {
            clearTimeout(suggestionTimeout);
            suggestionTimeout = setTimeout(() => {
                fetchAndShowSuggestions(topAddressBar.value);
            }, 150);
        });

        topAddressBar.addEventListener('focus', () => {
            if (topAddressBar.value.trim() && currentSuggestions.length > 0) {
                if (addressSuggestions) addressSuggestions.classList.remove('hidden');
            } else {
                topAddressBar.select();
            }
        });

        topAddressBar.addEventListener('blur', () => {
            if (addressSuggestions) addressSuggestions.classList.add('hidden');
        });

        topAddressBar.addEventListener('keydown', (e) => {
            if (addressSuggestions && !addressSuggestions.classList.contains('hidden') && currentSuggestions.length > 0) {
                const items = addressSuggestions.querySelectorAll('.suggestion-item');
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    suggestionSelectedIndex = (suggestionSelectedIndex + 1) % currentSuggestions.length;
                    items.forEach((item, idx) => item.classList.toggle('selected', idx === suggestionSelectedIndex));
                    if (suggestionSelectedIndex >= 0) {
                        const sugg = currentSuggestions[suggestionSelectedIndex];
                        topAddressBar.value = sugg.isHistory ? sugg.url : sugg.text;
                    }
                    return;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    suggestionSelectedIndex = suggestionSelectedIndex - 1;
                    if (suggestionSelectedIndex < 0) suggestionSelectedIndex = currentSuggestions.length - 1;
                    items.forEach((item, idx) => item.classList.toggle('selected', idx === suggestionSelectedIndex));
                    if (suggestionSelectedIndex >= 0) {
                        const sugg = currentSuggestions[suggestionSelectedIndex];
                        topAddressBar.value = sugg.isHistory ? sugg.url : sugg.text;
                    }
                    return;
                } else if (e.key === 'Escape') {
                    addressSuggestions.classList.add('hidden');
                    return;
                }
            }
            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                e.preventDefault();
                if (addressSuggestions) addressSuggestions.classList.add('hidden');
                navigate(topAddressBar.value);
            }
        });
    }
    if (homeSearchInput) {
        homeSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                e.preventDefault();
                navigate(homeSearchInput.value);
                homeSearchInput.value = '';
            }
        });
    }
    if (homeSearchSubmitBtn && homeSearchInput) {
        homeSearchSubmitBtn.addEventListener('click', () => {
            navigate(homeSearchInput.value);
            homeSearchInput.value = '';
        });
    }
    if (homeSearchGearBtn && settingsNavBtn) {
        homeSearchGearBtn.addEventListener('click', () => settingsNavBtn.click());
    }
    if (backBtn) {
        backBtn.onclick = () => {
            let activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
            if (!activeWebview) activeWebview = wakeTab(activeTabId);
            try {
                if (activeWebview && activeWebview.canGoBack && activeWebview.canGoBack()) activeWebview.goBack();
            } catch {
                // ignore
            }
        };
    }
    if (reloadBtn) {
        reloadBtn.onclick = () => {
            let activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
            if (!activeWebview) activeWebview = wakeTab(activeTabId);
            if (activeWebview) activeWebview.reload();
        };
    }
    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                e.preventDefault();
                sendToAI();
            }
        });
    }
    if (aiSendBtn) {
        aiSendBtn.onclick = () => sendToAI();
    }
    // Handle clicks on AI suggestion buttons
    if (aiMessages) {
        aiMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('ai-suggestion-btn')) {
                sendToAI(e.target.dataset.command);
            }
        });
    }
    // Show home on load if not standalone
    if (!isStandalone && homeNavBtn) homeNavBtn.click();

    if (isStandalone) {
        resetViews(true);
        if (hash === '#settings' && settingsView) {
            settingsView.classList.remove('hidden');
            refreshGroqKeyStatus();
        } else if (hash === '#resources' && resourcesView) {
            resourcesView.classList.remove('hidden');
            renderResources();
            if (!resourceMonitorInterval) resourceMonitorInterval = setInterval(renderResources, 2000);
        }
    }

    const hideContextMenu = () => {
        if (customContextMenu) customContextMenu.classList.add('hidden');
    };

    // --- Custom Context Menu ---
    function buildAndShowMenu(type, params) {
        const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
        if (!customContextMenu) return;
        
        if (!document.getElementById('aether-context-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'aether-context-menu-styles';
            style.textContent = `
                #custom-context-menu {
                    position: fixed !important;
                    z-index: 999999 !important;
                    background: rgba(255, 255, 255, 0.75) !important;
                    backdrop-filter: blur(16px) saturate(180%) !important;
                    -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
                    border: 1px solid rgba(0, 0, 0, 0.15) !important;
                    border-radius: 12px !important;
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
                    padding: 8px 0 !important;
                    min-width: 240px !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                    font-size: 14px !important;
                    color: #1d1d1f !important;
                    display: flex;
                    flex-direction: column;
                }
                .theme-dark #custom-context-menu {
                    background: rgba(30, 30, 30, 0.75) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    color: #f5f5f7 !important;
                }
                #custom-context-menu.hidden {
                    display: none !important;
                }
                #custom-context-menu .context-menu-item {
                    padding: 6px 10px !important;
                    margin: 2px 8px !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    transition: background 0.1s, color 0.1s !important;
                }
                #custom-context-menu .context-menu-item:hover {
                    background: rgba(0, 0, 0, 0.08) !important;
                    color: inherit !important;
                }
                .theme-dark #custom-context-menu .context-menu-item:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: #f5f5f7 !important;
                }
                #custom-context-menu .context-menu-separator {
                    height: 1px !important;
                    background: rgba(0, 0, 0, 0.1) !important;
                    margin: 4px 8px !important;
                }
                .theme-dark #custom-context-menu .context-menu-separator {
                    background: rgba(255, 255, 255, 0.1) !important;
                }
                #custom-context-menu .context-menu-item.ai-menu-item {
                    border: 1px solid rgba(175, 82, 222, 0.5) !important;
                    margin: 4px 12px !important;
                    padding: 6px 8px !important;
                    border-radius: 8px !important;
                    background: rgba(175, 82, 222, 0.04) !important;
                }
                #custom-context-menu .context-menu-item.ai-menu-item:hover {
                    background: rgba(175, 82, 222, 0.15) !important;
                    color: #1d1d1f !important;
                }
                .theme-dark #custom-context-menu .context-menu-item.ai-menu-item:hover {
                    background: rgba(175, 82, 222, 0.3) !important;
                    color: #f5f5f7 !important;
                }
                #custom-context-menu .context-menu-item.icon-only {
                    display: flex !important;
                    justify-content: center !important;
                    padding: 8px !important;
                    margin-top: 4px !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        let menuTemplate = [];
        const aiIconHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#ai-menu-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><defs><linearGradient id="ai-menu-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0a84ff" /><stop offset="100%" stop-color="#ff2a6d" /></linearGradient></defs><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;

        if (type === 'webview' || type === 'app-ui') {
            if (params.linkURL && !params.selectionText) {
                menuTemplate.push({ label: 'Link in neuem Tab öffnen', action: () => createTab(params.linkURL) });
                menuTemplate.push({ label: 'Link-Adresse kopieren', action: () => navigator.clipboard.writeText(params.linkURL) });
                menuTemplate.push({ type: 'separator' });
            }
            if (params.srcURL) {
                menuTemplate.push({ label: 'Bild in neuem Tab öffnen', action: () => createTab(params.srcURL) });
                menuTemplate.push({ label: 'Bildadresse kopieren', action: () => navigator.clipboard.writeText(params.srcURL) });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ 
                    label: 'Bild analysieren', 
                    icon: aiIconHTML,
                    isAi: true,
                    action: () => { 
                        if (aiSidebar) aiSidebar.classList.remove('hidden');
                        sendToAI('Was ist auf diesem Bild zu sehen? Bitte beschreibe es im Detail.', { imageDataUrl: params.srcURL });
                    }
                });
                menuTemplate.push({ type: 'separator' });
            }
            if (params.selectionText) {
                menuTemplate.push({ label: 'Kopieren', action: () => { if (type === 'webview' && activeWebview) activeWebview.copy(); else navigator.clipboard.writeText(params.selectionText); } });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Auswahl zusammenfassen', icon: aiIconHTML, isAi: true, action: () => { if (aiSidebar) aiSidebar.classList.remove('hidden'); sendToAI(`Fasse zusammen: "${params.selectionText}"`); } });
                menuTemplate.push({ label: 'Auswahl erklären', icon: aiIconHTML, isAi: true, action: () => { if (aiSidebar) aiSidebar.classList.remove('hidden'); sendToAI(`Erkläre: "${params.selectionText}"`); } });
                menuTemplate.push({ type: 'separator' });
            }
            if (params.isEditable) {
                menuTemplate.push({ label: 'Rückgängig', action: () => { if (type === 'webview' && activeWebview) activeWebview.undo(); else document.execCommand('undo'); } });
                menuTemplate.push({ label: 'Wiederholen', action: () => { if (type === 'webview' && activeWebview) activeWebview.redo(); else document.execCommand('redo'); } });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Ausschneiden', action: () => { if (type === 'webview' && activeWebview) activeWebview.cut(); else { navigator.clipboard.writeText(params.selectionText || ''); document.execCommand('delete'); } } });
                menuTemplate.push({ label: 'Kopieren', action: () => { if (type === 'webview' && activeWebview) activeWebview.copy(); else navigator.clipboard.writeText(params.selectionText || ''); } });
                menuTemplate.push({ label: 'Einfügen', action: () => { 
                    if (type === 'webview' && activeWebview) activeWebview.paste(); 
                    else { 
                        navigator.clipboard.readText().then(t => { 
                            if (document.activeElement && typeof document.activeElement.setRangeText === 'function') { document.activeElement.setRangeText(t); document.activeElement.selectionStart += t.length; } 
                            else document.execCommand('insertText', false, t); 
                        }); 
                    } 
                }});
                menuTemplate.push({ label: 'Alles auswählen', action: () => { if (type === 'webview' && activeWebview) activeWebview.selectAll(); else if (document.activeElement && document.activeElement.select) document.activeElement.select(); } });
                menuTemplate.push({ type: 'separator' });
            }
            if (!params.selectionText && !params.linkURL && !params.srcURL && !params.isEditable && type === 'webview') {
                if (activeWebview && activeWebview.canGoBack && activeWebview.canGoBack()) menuTemplate.push({ label: 'Zurück', action: () => activeWebview.goBack() });
                if (activeWebview && activeWebview.canGoForward && activeWebview.canGoForward()) menuTemplate.push({ label: 'Vorwärts', action: () => activeWebview.goForward() });
                if (activeWebview && activeWebview.reload) menuTemplate.push({ label: 'Neu laden', action: () => activeWebview.reload() });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Diese Seite analysieren', icon: aiIconHTML, isAi: true, action: () => { if (aiSidebar) aiSidebar.classList.remove('hidden'); analyzeActivePage(); } });
                menuTemplate.push({ type: 'separator' });
                if (activeWebview && activeWebview.inspectElement) menuTemplate.push({ label: 'Untersuchen', action: () => activeWebview.inspectElement(params.x, params.y) });
            }
            if (type === 'app-ui' && !params.selectionText && !params.isEditable) {
                menuTemplate.push({ label: 'Einstellungen öffnen', action: () => { if (settingsNavBtn) settingsNavBtn.click(); } });
            }
        }

        if (type === 'tab') {
            const tabEl = document.getElementById(params.tabId);
            if (tabEl) {
                const url = tabEl.dataset.url;
                if (url && url !== 'about:blank' && !url.includes('file://')) {
                    const isFav = favorites.some((f) => f && f.url === url);
                    let title = url;
                    const titleEl = tabEl.querySelector('.tab-title');
                    if (titleEl) title = titleEl.textContent;

                    menuTemplate.push({
                        label: isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen',
                        action: () => (isFav ? removeFavorite(url) : addFavorite(url, title)),
                    });
                    menuTemplate.push({ type: 'separator' });
                }
                
                menuTemplate.push({ label: 'Tab schließen', action: () => closeTab(params.tabId) });

                const isSplit = splitTabId === params.tabId;
                if (params.tabId !== activeTabId || isSplit) {
                    menuTemplate.push({ type: 'separator' });
                    menuTemplate.push({
                        label: '',
                        title: isSplit ? 'Split-View beenden' : 'Als Split-View öffnen',
                        isIconOnly: true,
                        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>`,
                        action: () => toggleSplitView(params.tabId)
                    });
                }
            }
        }

        if (type === 'favorites-bar') {
            const wv = getActiveWebview();
            let url = null;
            try {
                if (wv && typeof wv.getURL === 'function') url = wv.getURL();
                if (!url && wv && wv.src) url = wv.src;
            } catch {
                url = null;
            }
            if (url && url !== 'about:blank' && !url.includes('file://')) {
                menuTemplate.push({ label: 'Adresse kopieren', action: () => navigator.clipboard.writeText(String(url)) });
            }
        }

        if (type === 'favorite-pill') {
            const url = params && params.url ? String(params.url) : '';
            if (url) {
                menuTemplate.push({ label: 'In neuem Tab öffnen', action: () => createTab(url) });
                menuTemplate.push({ label: 'Adresse kopieren', action: () => navigator.clipboard.writeText(url) });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Aus Favoriten entfernen', action: () => removeFavorite(url) });
            }
        }

        if (type === 'news-feed') {
            menuTemplate.push({ label: 'Feed entfernen', action: params.removeAction });
        }

        if (menuTemplate.length === 0) return;
        
        document.removeEventListener('click', hideContextMenu);
        document.removeEventListener('contextmenu', hideContextMenu);
        window.removeEventListener('blur', hideContextMenu);

        customContextMenu.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (const item of menuTemplate) {
            if (item.type === 'separator') {
                const sep = document.createElement('div');
                sep.className = 'context-menu-separator';
                fragment.appendChild(sep);
                continue;
            }
            const itemEl = document.createElement('div');
            itemEl.className = 'context-menu-item';
            if (item.isAi) {
                itemEl.classList.add('ai-menu-item');
            }
            if (item.isIconOnly) {
                itemEl.classList.add('icon-only');
                itemEl.title = item.title || '';
            }
            if (item.icon) {
                const iconSpan = document.createElement('span');
                iconSpan.style.cssText = 'display:flex; align-items:center; justify-content:center;';
                iconSpan.innerHTML = item.icon;
                itemEl.appendChild(iconSpan);
                if (item.label) {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = item.label;
                    itemEl.appendChild(textSpan);
                }
            } else {
                itemEl.textContent = item.label;
            }
            itemEl.addEventListener('click', (e) => {
                e.stopPropagation();
                try { item.action(); } finally { hideContextMenu(); }
            });
            fragment.appendChild(itemEl);
        }
        customContextMenu.appendChild(fragment);
        customContextMenu.classList.remove('hidden');
        const menuX = Number((params && (params.menuX ?? params.x)) ?? 0) || 0;
        const menuY = Number((params && (params.menuY ?? params.y)) ?? 0) || 0;
        const menuRect = customContextMenu.getBoundingClientRect();
        customContextMenu.style.left = (menuX + menuRect.width > window.innerWidth ? window.innerWidth - menuRect.width - 5 : menuX) + 'px';
        customContextMenu.style.top = (menuY + menuRect.height > window.innerHeight ? window.innerHeight - menuRect.height - 5 : menuY) + 'px';
        setTimeout(() => {
            document.addEventListener('click', hideContextMenu, { once: true });
            document.addEventListener('contextmenu', hideContextMenu, { once: true });
            window.addEventListener('blur', hideContextMenu, { once: true });
        }, 0);
    }
    // Listen for actions from the main process (context menus)
    if (window.electronAPI && window.electronAPI.onContextMenuAction) {
        window.electronAPI.onContextMenuAction((action, _params) => {
            const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
            if (!activeWebview) return;
            if (action === 'go-back' && activeWebview.canGoBack()) activeWebview.goBack();
            if (action === 'go-forward' && activeWebview.canGoForward()) activeWebview.goForward();
            if (action === 'reload') activeWebview.reload();
            if (action === 'ai-analyze-page') {
                aiSidebar.classList.remove('hidden');
                analyzeActivePage();
            }
        });
    }

    if (window.electronAPI && window.electronAPI.onShowCustomContextMenu) {
        window.electronAPI.onShowCustomContextMenu((type, params) => buildAndShowMenu(type, params));
    }

    // --- News Implementation ---
    async function loadNewsFeeds() {
        const sourcesList = document.getElementById('news-sources-list');
        const articlesGrid = document.getElementById('news-articles-grid');
        if (!sourcesList || !articlesGrid) return;
        
        let sources = JSON.parse(localStorage.getItem('aether-news-sources') || '[]');
        if (sources.length === 0) {
            sources = [
                { name: 'SRF News', url: 'https://www.srf.ch/news/bnf/rss/1646' },
                { name: 'Tagesschau', url: 'https://www.tagesschau.de/xml/rss2' }
            ];
            localStorage.setItem('aether-news-sources', JSON.stringify(sources));
        }

        sourcesList.innerHTML = '';
        sources.forEach((src, idx) => {
            const pill = document.createElement('div');
            pill.className = 'favorite-pill';
            pill.innerHTML = `<span class="fav-title">${src.name}</span>`;
            pill.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                buildAndShowMenu('news-feed', {
                    x: e.clientX,
                    y: e.clientY,
                    removeAction: () => {
                        sources.splice(idx, 1);
                        localStorage.setItem('aether-news-sources', JSON.stringify(sources));
                        loadNewsFeeds();
                    }
                });
            });
            sourcesList.appendChild(pill);
        });

        articlesGrid.innerHTML = '<div style="color: var(--text-secondary);">Lade News...</div>';
        
        let allArticles = [];
        for (const src of sources) {
            try {
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(src.url)}`;
                const resp = await fetch(apiUrl);
                const data = await resp.json();
                if (data && data.status === 'ok') {
                    data.items.forEach(item => {
                        allArticles.push({
                            srcName: src.name,
                            title: item.title,
                            link: item.link,
                            timestamp: new Date(item.pubDate).getTime() || 0,
                            desc: item.description,
                            imgUrl: item.thumbnail || (item.enclosure && item.enclosure.link) || ''
                        });
                    });
                }
            } catch (e) {
                console.error("News fetch error:", e);
            }
        }
        
        allArticles.sort((a, b) => b.timestamp - a.timestamp);
        
        articlesGrid.innerHTML = '';
        if (allArticles.length === 0) {
            articlesGrid.innerHTML = '<div style="color: var(--text-secondary);">Keine Artikel gefunden oder Fehler beim Laden.</div>';
            return;
        }

        allArticles.slice(0, 40).forEach(art => {
            const card = document.createElement('div');
            card.className = 'settings-card';
            card.style.cssText = 'padding: 16px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; transition: transform 0.2s, box-shadow 0.2s;';
            card.onmouseenter = () => card.style.transform = 'translateY(-2px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';
            let imgHtml = art.imgUrl ? `<img src="${art.imgUrl}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" onerror="this.style.display='none'">` : '';
            const tmp = document.createElement('div'); tmp.innerHTML = art.desc;
            const cleanDesc = tmp.textContent || tmp.innerText || "";
            const snippet = cleanDesc.length > 120 ? cleanDesc.substring(0, 120) + '...' : cleanDesc;
            let timeStr = art.timestamp ? new Date(art.timestamp).toLocaleString([], {day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'}) : '';
            card.innerHTML = `${imgHtml}<div style="font-size: 11px; color: var(--accent-color); font-weight: 700; text-transform: uppercase;">${art.srcName}</div><div style="font-size: 15px; font-weight: 600; color: var(--text-primary); line-height: 1.3;">${art.title}</div><div style="font-size: 12px; color: var(--text-secondary);">${timeStr}</div><div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${snippet}</div>`;
            card.addEventListener('click', () => { if (art.link) createTab(art.link); });
            articlesGrid.appendChild(card);
        });
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'news-add-source-btn') {
            const url = document.getElementById('news-source-url').value.trim();
            const name = document.getElementById('news-source-name').value.trim() || 'News Feed';
            if (url) {
                const sources = JSON.parse(localStorage.getItem('aether-news-sources') || '[]');
                sources.push({ name, url });
                localStorage.setItem('aether-news-sources', JSON.stringify(sources));
                document.getElementById('news-source-url').value = '';
                document.getElementById('news-source-name').value = '';
                loadNewsFeeds();
            }
        }
    });

    // --- Clips Integration (Echte Hintergrundaufnahme) ---
    const addonsNavBtn = document.createElement('div');
    addonsNavBtn.className = 'nav-item';
    addonsNavBtn.id = 'addons-nav-btn';
    addonsNavBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 2px;"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg><span class="nav-text">Addons</span>`;
    
    if (newsNavBtn && newsNavBtn.parentNode) {
        newsNavBtn.parentNode.insertBefore(addonsNavBtn, newsNavBtn.nextSibling);
    }

    let clipFolder = localStorage.getItem('aether-clip-folder') || '';
    let clipDurationMs = parseInt(localStorage.getItem('aether-clip-duration') || '300000'); // Default 5 mins
    let clipHotkey = localStorage.getItem('aether-clip-hotkey') || 'F12';
    let publishedClips = JSON.parse(localStorage.getItem('aether-clips') || '[]');
    let clipsAddonInstalled = localStorage.getItem('aether-clips-addon-installed') === 'true';
    
    window.clipModeActive = localStorage.getItem('aether-clips-addon-active') === 'true';
    let clipRecorder = null;
    let clipChunks = [];
    let isRecording = false;

    let blockedTrackers = JSON.parse(localStorage.getItem('aether-blocked-trackers') || '[]');
    
    let currentAddonView = 'main'; // 'main', 'clips', 'privacy'

    // --- Privatsphäre Add-on Initialisierung ---
    let privacyAddonActive = localStorage.getItem('aether-privacy-addon') === 'true';
    if (window.electronAPI && window.electronAPI.togglePrivacyFilter) {
        window.electronAPI.togglePrivacyFilter(privacyAddonActive);
    }

    // Hotkey an Main Process senden, damit er auch in Spielen (Global) funktioniert
    if (window.electronAPI && window.electronAPI.setClipShortcut) {
        window.electronAPI.setClipShortcut(clipHotkey);
    }

    let recentBlockCount = 0;
    let recentBlockTimeout = null;

    if (window.electronAPI && window.electronAPI.onTrackerBlocked) {
        window.electronAPI.onTrackerBlocked((url) => {
            const domain = getDomainFromUrl(url) || url;
            const entry = blockedTrackers.find(t => t.domain === domain);
            if (entry) {
                entry.count += 1;
                entry.lastBlocked = Date.now();
            } else {
                blockedTrackers.unshift({ domain, count: 1, lastBlocked: Date.now() });
            }
            
            // Nach "Zuletzt blockiert" sortieren und auf 50 beschränken
            blockedTrackers.sort((a, b) => b.lastBlocked - a.lastBlocked);
            if (blockedTrackers.length > 50) blockedTrackers.length = 50;
            localStorage.setItem('aether-blocked-trackers', JSON.stringify(blockedTrackers));

            // Privacy Stats (Hourly & Sources)
            let sourceUrl = topAddressBar ? topAddressBar.value : '';
            const sourceDomain = getDomainFromUrl(sourceUrl) || 'Unbekannt';
            let advancedStats = { hourly: {}, sources: {} };
            try {
                advancedStats = JSON.parse(localStorage.getItem('aether-privacy-advanced-stats') || '{"hourly":{},"sources":{}}');
            } catch(e) {}
            const now = new Date();
            const hourKey = now.toISOString().substring(0, 13);
            advancedStats.hourly[hourKey] = (advancedStats.hourly[hourKey] || 0) + 1;
            advancedStats.sources[sourceDomain] = (advancedStats.sources[sourceDomain] || 0) + 1;
            localStorage.setItem('aether-privacy-advanced-stats', JSON.stringify(advancedStats));

            // Aktualisiere die UI-Liste direkt, falls das Addon-Menü geöffnet ist
            if (currentAddonView === 'privacy') {
                const trackersListEl = document.getElementById('blocked-trackers-ul-detail');
                if (trackersListEl) {
                    trackersListEl.innerHTML = blockedTrackers.length > 0 ? blockedTrackers.map(t => `
                        <li class="blocked-tracker-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px; font-size: 13px;">
                            <span style="font-weight: 500;">${t.domain}</span>
                            <span class="blocked-tracker-badge" style="font-size: 12px; padding: 2px 8px; border-radius: 12px;">${t.count}x blockiert</span>
                        </li>
                    `).join('') : '<li style="color: var(--text-secondary); font-size: 13px;">Bisher keine Tracker blockiert.</li>';
                }
                const hourlyContainer = document.getElementById('privacy-hourly-chart-container');
                if (hourlyContainer) hourlyContainer.innerHTML = generateHourlyBarChartSVG();
                const sourcesContainer = document.getElementById('privacy-sources-chart-container');
                if (sourcesContainer) sourcesContainer.innerHTML = generateSourcesPieChartSVG();
            }

            // Popup-Logik, wenn zu viel auf einmal getrackt wird
            const isGoogleSearch = sourceDomain.includes('google.');
            if (!isGoogleSearch) {
                recentBlockCount++;
                if (recentBlockCount > 4) {
                    showPrivacyWarning();
                    recentBlockCount = 0;
                }

                clearTimeout(recentBlockTimeout);
                recentBlockTimeout = setTimeout(() => {
                    recentBlockCount = 0;
                }, 3000);
            }
        });
    }

    function showPrivacyWarning() {
        let popup = document.getElementById('privacy-warning-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'privacy-warning-popup';
            popup.innerHTML = `
                <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #34c759; display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Datenschutz aktiv
                </div>
                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">Aether hat auf dieser Seite mehrere Daten-Tracker blockiert, um deine Privatsphäre zu schützen.</div>
                <div id="priv-warn-close" style="position: absolute; top: 12px; right: 12px; cursor: pointer; color: var(--text-secondary); opacity: 0.7;">
                    <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            `;
            document.body.appendChild(popup);
            popup.querySelector('#priv-warn-close').addEventListener('click', () => {
                popup.classList.remove('show');
            });
        }
        popup.classList.add('show');
        setTimeout(() => {
            if (popup.classList.contains('show')) popup.classList.remove('show');
        }, 5000);
    }

    function updateDuration(val) {
        clipDurationMs = parseInt(val);
        localStorage.setItem('aether-clip-duration', clipDurationMs.toString());
        if (isRecording) {
            // Schneide direkt ab, wenn die Zeit im Laufenden Betrieb gekürzt wird
            const cutoff = Date.now() - clipDurationMs;
            clipChunks = clipChunks.filter(c => c.time >= cutoff);
        }
    }

    function generateHourlyBarChartSVG() {
        let stats = { hourly: {} };
        try { stats = JSON.parse(localStorage.getItem('aether-privacy-advanced-stats') || '{"hourly":{}}'); } catch(e) {}
        
        const hours = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 60 * 60 * 1000);
            hours.push(d.toISOString().substring(0, 13));
        }
        
        const values = hours.map(h => stats.hourly[h] || 0);
        const maxVal = Math.max(...values, 5); // at least 5 for scale
        
        const width = 400;
        const height = 120;
        const barWidth = 20;
        const stepX = width / 12;
        
        let svg = `<svg viewBox="-20 -20 ${width+40} ${height+40}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">`;
        svg += `<line x1="0" y1="${height}" x2="${width}" y2="${height}" stroke="var(--border-color, rgba(0,0,0,0.1))" stroke-width="1"/>`;
        
        values.forEach((v, i) => {
            const x = i * stepX + (stepX - barWidth) / 2;
            const barH = (v / maxVal) * height;
            const y = height - barH;
            
            svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="var(--accent-color, #0a84ff)" rx="4" ry="4" />`;
            if(v > 0) {
                svg += `<text x="${x + barWidth/2}" y="${y - 6}" font-size="10" fill="var(--text-primary)" text-anchor="middle" font-weight="bold">${v}</text>`;
            }
            
            const d = new Date(hours[i] + ":00:00Z");
            const label = d.getHours() + "h";
            svg += `<text x="${x + barWidth/2}" y="${height + 18}" font-size="10" fill="var(--text-secondary)" text-anchor="middle">${label}</text>`;
        });
        svg += `</svg>`;
        return svg;
    }

    function generateSourcesPieChartSVG() {
        let stats = { sources: {} };
        try { stats = JSON.parse(localStorage.getItem('aether-privacy-advanced-stats') || '{"sources":{}}'); } catch(e) {}
        
        let total = 0;
        const sortedSources = Object.entries(stats.sources).sort((a,b) => b[1] - a[1]).slice(0, 5);
        sortedSources.forEach(s => total += s[1]);
        
        if (total === 0) return `<div style="text-align:center; color:var(--text-secondary); font-size:13px; line-height:120px;">Noch keine Daten gesammelt. Surfe im Web!</div>`;
        
        const colors = ['var(--accent-color, #0a84ff)', '#ff3b30', '#34c759', '#ff9500', '#af52de'];
        let svg = `<svg viewBox="-20 -20 300 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">`;
        
        let cumulativePercent = 0;
        const cx = 50; const cy = 50; const r = 50;
        
        let legendX = 130;
        let legendY = 15;
        
        function getCoordinatesForPercent(percent) {
            const x = cx + r * Math.cos(2 * Math.PI * percent - Math.PI/2);
            const y = cy + r * Math.sin(2 * Math.PI * percent - Math.PI/2);
            return [x, y];
        }
        
        sortedSources.forEach((src, i) => {
            const [domain, count] = src;
            const slicePercent = count / total;
            
            if (slicePercent >= 1) {
                svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors[i]}" />`;
            } else {
                const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                cumulativePercent += slicePercent;
                const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
                
                const pathData = [
                    `M ${cx} ${cy}`,
                    `L ${startX} ${startY}`,
                    `A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `L ${cx} ${cy}`
                ].join(' ');
                svg += `<path d="${pathData}" fill="${colors[i]}" stroke="var(--bg-tertiary, #fff)" stroke-width="1.5" stroke-linejoin="round" />`;
            }
            
            svg += `<rect x="${legendX}" y="${legendY - 8}" width="10" height="10" fill="${colors[i]}" rx="2" ry="2" />`;
            let dName = domain.replace(/^www\./, '');
            if (dName.length > 15) dName = dName.substring(0,12) + '...';
            svg += `<text x="${legendX + 16}" y="${legendY}" font-size="11" fill="var(--text-primary)">${dName} (${count})</text>`;
            legendY += 20;
        });
        
        svg += `</svg>`;
        return svg;
    }

    const addonsView = document.createElement('div');
    addonsView.id = 'addons-view';
    addonsView.className = 'hidden';
    
    function renderAddonsView() {
        if (currentAddonView === 'main') {
            addonsView.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                        <h1 style="font-size: 24px; font-weight: 800; margin: 0;">Addons</h1>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; width: 100%; margin-bottom: 30px;">
                        <div class="settings-card addon-card" data-addon="clips" style="display: flex; flex-direction: column; gap: 12px; padding: 20px; cursor: pointer; transition: transform 0.2s;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 48px; height: 48px; background: rgba(255, 59, 48, 0.1); color: #ff3b30; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                </div>
                                <div>
                                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                        Gaming Clips
                                        ${window.clipModeActive ? '<span style="width: 8px; height: 8px; background: #34c759; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px rgba(52,199,89,0.5);" title="Aktiv"></span>' : ''}
                                    </h3>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Nimmt im Hintergrund auf</div>
                                </div>
                            </div>
                            <p style="font-size: 13px; color: var(--text-secondary); margin: 0; flex: 1;">Zeichne deine besten Gaming-Momente auf. Das Addon läuft im Hintergrund und speichert auf Knopfdruck die letzten Minuten als Video.</p>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px;">
                                ${!clipsAddonInstalled ?
                                    `<button id="install-clips-btn" class="settings-button primary" style="background: var(--accent-color); color: white; border: none; width: 100%; justify-content: center;">Herunterladen</button>`
                                    :
                                    `<button id="toggle-clips-active-btn" class="settings-button" style="background: ${window.clipModeActive ? '#ff3b30' : 'var(--accent-color)'}; color: white; border: none; width: 100%; justify-content: center;">${window.clipModeActive ? 'Deaktivieren' : 'Aktivieren'}</button>`
                                }
                            </div>
                        </div>

                        <div class="settings-card addon-card" data-addon="privacy" style="display: flex; flex-direction: column; gap: 12px; padding: 20px; cursor: pointer; transition: transform 0.2s;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 48px; height: 48px; background: rgba(52, 199, 89, 0.1); color: #34c759; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <div>
                                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                        Privatsphäre-Schutz
                                        ${privacyAddonActive ? '<span style="width: 8px; height: 8px; background: #34c759; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px rgba(52,199,89,0.5);" title="Aktiv"></span>' : ''}
                                    </h3>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Google Blocking</div>
                                </div>
                            </div>
                            <p style="font-size: 13px; color: var(--text-secondary); margin: 0; flex: 1;">Schützt deine Daten, indem Verbindungen zu bekannten Google-Trackern und Werbenetzwerken blockiert werden.</p>
                            <p style="font-size: 11px; color: var(--text-secondary); opacity: 0.8; margin: 0; line-height: 1.3;">Klicke hier, um Statistiken und die Liste der blockierten Verbindungen zu sehen.</p>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px;">
                                <button id="toggle-privacy-btn" class="settings-button" style="background: ${privacyAddonActive ? '#ff3b30' : 'var(--accent-color)'}; color: white; border: none; width: 100%; justify-content: center;">${privacyAddonActive ? 'Deaktivieren' : 'Aktivieren'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentAddonView === 'clips') {
            addonsView.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                        <button id="addon-back-btn" class="settings-button" style="padding: 6px 12px; min-width: auto;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h1 style="font-size: 24px; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 12px;">
                            Gaming Clips
                            ${window.clipModeActive ? '<span style="width: 10px; height: 10px; background: #34c759; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px rgba(52,199,89,0.5);" title="Aktiv"></span>' : ''}
                        </h1>
                        <div style="margin-left: auto;">
                            ${!clipsAddonInstalled ?
                                `<button id="install-clips-btn" class="settings-button primary" style="background: var(--accent-color); color: white; border: none;">Herunterladen</button>`
                                :
                                `<button id="toggle-clips-active-btn" class="settings-button" style="background: ${window.clipModeActive ? '#ff3b30' : 'var(--accent-color)'}; color: white; border: none;">${window.clipModeActive ? 'Deaktivieren' : 'Aktivieren'}</button>`
                            }
                        </div>
                    </div>

                    ${clipsAddonInstalled ? `
                    <div id="clips-manager-ui" style="display: flex; flex-direction: column; flex: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                            <h2 style="font-size: 20px; font-weight: 700; margin: 0;">Clips Galerie</h2>
                            <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; flex-wrap: wrap;">
                                <span style="color: var(--text-secondary);">Speicherort: <span id="clip-folder-display" style="color: var(--text-primary); cursor:pointer; font-weight:600; text-decoration: underline;">${clipFolder || 'Ordner wählen...'}</span></span>
                                <select id="clip-duration-select" class="settings-select" style="padding: 6px 12px; font-size: 12px;">
                                    <option value="60000" ${clipDurationMs === 60000 ? 'selected' : ''}>Letzte 1 Min</option>
                                    <option value="300000" ${clipDurationMs === 300000 ? 'selected' : ''}>Letzte 5 Min</option>
                                    <option value="600000" ${clipDurationMs === 600000 ? 'selected' : ''}>Letzte 10 Min</option>
                                </select>
                                <button id="clip-hotkey-btn" class="settings-button" style="padding: 6px 12px; font-size: 12px;">Hotkey: <span id="clip-hotkey-display-1">${clipHotkey}</span></button>
                            </div>
                        </div>

                        ${window.clipModeActive ? `
                        <div id="clip-status-indicator" style="display:flex; background: rgba(255, 59, 48, 0.1); color: #ff3b30; border: 1px solid rgba(255, 59, 48, 0.2); padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; margin-bottom: 20px; align-items: center; gap: 10px;">
                            <span style="display:inline-block; width:10px; height:10px; background:#ff3b30; border-radius:50%; animation: pulse 1.5s infinite;"></span>
                            Hintergrundaufnahme läuft... Drücke <span id="clip-hotkey-display-2" style="background: rgba(255, 59, 48, 0.2); padding: 2px 6px; border-radius: 4px;">${clipHotkey}</span>, um die letzten Minuten zu speichern.
                        </div>
                        ` : ''}

                        <div id="clips-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; width: 100%;">
                        </div>
                    </div>
                    ` : `
                    <div style="flex:1; display:flex; align-items:center; justify-content:center; color: var(--text-secondary); font-size: 14px;">
                        Bitte lade das Addon herunter, um Clips aufzunehmen und zu verwalten.
                    </div>
                    `}
                </div>
            `;
            if (clipsAddonInstalled) {
                renderClips();
            }
        } else if (currentAddonView === 'privacy') {
            const hourlyChartSVG = generateHourlyBarChartSVG();
            const sourcesChartSVG = generateSourcesPieChartSVG();
            addonsView.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                        <button id="addon-back-btn" class="settings-button" style="padding: 6px 12px; min-width: auto;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <h1 style="font-size: 24px; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 12px;">
                            Privatsphäre-Schutz
                            ${privacyAddonActive ? '<span style="width: 10px; height: 10px; background: #34c759; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px rgba(52,199,89,0.5);" title="Aktiv"></span>' : ''}
                        </h1>
                        <div style="margin-left: auto;">
                            <button id="toggle-privacy-btn" class="settings-button" style="background: ${privacyAddonActive ? '#ff3b30' : 'var(--accent-color)'}; color: white; border: none; width: 100%; justify-content: center;">${privacyAddonActive ? 'Deaktivieren' : 'Aktivieren'}</button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; width: 100%;">
                        <div class="settings-card" style="display: flex; flex-direction: column; padding: 24px;">
                            <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Blockierte Tracker pro Stunde</h3>
                            <div id="privacy-hourly-chart-container" style="height: 180px; width: 100%; display: flex; align-items: center; justify-content: center; padding-bottom: 20px; box-sizing: border-box;">
                                ${hourlyChartSVG}
                            </div>
                        </div>

                        <div class="settings-card" style="display: flex; flex-direction: column; padding: 24px;">
                            <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Auslöser (Ursprungsseiten)</h3>
                            <div id="privacy-sources-chart-container" style="height: 180px; width: 100%; display: flex; align-items: center; justify-content: center; padding-bottom: 20px; box-sizing: border-box;">
                                ${sourcesChartSVG}
                            </div>
                        </div>

                        <div class="settings-card" style="display: flex; flex-direction: column; padding: 24px; max-height: 400px; overflow-y: auto;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Bekannte Tracker</h3>
                            </div>
                            <ul id="blocked-trackers-ul-detail" style="margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px;">
                                ${blockedTrackers.length > 0 
                                    ? blockedTrackers.map(t => `
                                        <li class="blocked-tracker-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px; font-size: 13px;">
                                            <span style="font-weight: 500;">${t.domain}</span>
                                            <span class="blocked-tracker-badge" style="font-size: 12px; padding: 2px 8px; border-radius: 12px;">${t.count}x blockiert</span>
                                        </li>
                                    `).join('') 
                                    : '<li style="color: var(--text-secondary); font-size: 13px;">Bisher keine Tracker blockiert. Surfe im Web, während das Addon aktiv ist!</li>'}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    const shell = document.querySelector('#view-layer') || document.querySelector('.viewport-shell');
    if (shell) shell.appendChild(addonsView);
    renderAddonsView();

    async function toggleRecordingState() {
        if (!clipFolder) {
            if (window.electronAPI && window.electronAPI.selectFolder) {
                const folder = await window.electronAPI.selectFolder();
                if (folder) {
                    clipFolder = folder;
                    localStorage.setItem('aether-clip-folder', clipFolder);
                } else {
                    return;
                }
            } else {
                alert('Bitte wähle in der Clips-Übersicht zuerst einen Speicherort aus!');
                if (addonsNavBtn) addonsNavBtn.click();
                return;
            }
        }

        window.clipModeActive = !window.clipModeActive;
        localStorage.setItem('aether-clips-addon-active', window.clipModeActive);

        if (window.clipModeActive) {
            await startBackgroundRecording();
        } else {
            stopBackgroundRecording();
        }
        renderAddonsView();
    }

    document.body.addEventListener('change', (e) => {
        if (e.target.id === 'clip-duration-select') {
            updateDuration(e.target.value);
        }
    });

    document.body.addEventListener('click', async (e) => {
        if (e.target.closest('#addon-back-btn')) {
            currentAddonView = 'main';
            renderAddonsView();
            return;
        }

        const addonCard = e.target.closest('.addon-card');
        if (addonCard && !e.target.closest('button')) {
            currentAddonView = addonCard.dataset.addon;
            renderAddonsView();
            return;
        }

        if (e.target.id === 'install-clips-btn') {
            e.target.textContent = 'Wird geladen...';
            e.target.disabled = true;
            setTimeout(() => {
                localStorage.setItem('aether-clips-addon-installed', 'true');
                clipsAddonInstalled = true;
                renderAddonsView();
            }, 800);
            return;
        }
        if (e.target.id === 'toggle-clips-active-btn') {
            toggleRecordingState();
            return;
        }
        if (e.target.id === 'toggle-privacy-btn') {
            privacyAddonActive = !privacyAddonActive;
            localStorage.setItem('aether-privacy-addon', privacyAddonActive);
            
            if (window.electronAPI && window.electronAPI.togglePrivacyFilter) {
                window.electronAPI.togglePrivacyFilter(privacyAddonActive);
            }
            renderAddonsView();
            return;
        }

        const folderDisp = e.target.closest('#clip-folder-display');
        if (folderDisp) {
            if (window.electronAPI && window.electronAPI.selectFolder) {
                const folder = await window.electronAPI.selectFolder();
                if (folder) {
                    clipFolder = folder;
                    localStorage.setItem('aether-clip-folder', clipFolder);
                    renderAddonsView();
                }
            } else {
                alert('API nicht verfügbar. Hast du preload.js aktualisiert?');
            }
        }

        const hotkeyBtn = e.target.closest('#clip-hotkey-btn');
        if (hotkeyBtn) {
            hotkeyBtn.textContent = 'Drücke eine Taste...';
            hotkeyBtn.style.background = 'var(--accent-color)';
            hotkeyBtn.style.color = '#fff';

            const keydownHandler = (ke) => {
                ke.preventDefault();
                let key = ke.key;
                let modifiers = [];
                if (ke.ctrlKey) modifiers.push('CommandOrControl');
                if (ke.altKey) modifiers.push('Alt');
                if (ke.shiftKey) modifiers.push('Shift');

                if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) return; // Warte auf echte Taste

                let formattedKey = key.length === 1 ? key.toUpperCase() : key;
                if (formattedKey === ' ') formattedKey = 'Space';
                
                clipHotkey = [...modifiers, formattedKey].join('+');
                localStorage.setItem('aether-clip-hotkey', clipHotkey);
                
                hotkeyBtn.innerHTML = `Hotkey: <span id="clip-hotkey-display-1">${clipHotkey}</span>`;
                hotkeyBtn.style.background = '';
                hotkeyBtn.style.color = '';
                renderAddonsView();

                if (window.electronAPI && window.electronAPI.setClipShortcut) {
                    window.electronAPI.setClipShortcut(clipHotkey);
                }

                document.removeEventListener('keydown', keydownHandler);
            };
            document.addEventListener('keydown', keydownHandler);
        }
    });

    async function startBackgroundRecording() {
        if (isRecording || !window.electronAPI) return;
        try {
            const sourceId = await window.electronAPI.getScreenSource();
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: { mandatory: { chromeMediaSource: 'desktop' } },
                    video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: sourceId } }
                });
            } catch (audioErr) {
                // System audio capture can fail on some systems, fallback silently
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: sourceId } }
                });
            }

            clipRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
            clipChunks = [];

            clipRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    clipChunks.push({ blob: e.data, time: Date.now() });
                    // Puffer aufräumen: Behalte nur Chunks der eingestellten Dauer
                    const cutoff = Date.now() - clipDurationMs;
                    clipChunks = clipChunks.filter(c => c.time >= cutoff);
                }
            };

            clipRecorder.start(2000); // Fordere alle 2 Sekunden einen Video-Chunk an
            isRecording = true;
        } catch (err) {
            console.error('Recording error:', err);
            window.clipModeActive = false;
            localStorage.setItem('aether-clips-addon-active', 'false');
            alert('Konnte Bildschirmaufnahme nicht starten. Stelle sicher, dass die App die Berechtigung hat.');
            renderAddonsView();
        }
    }

    function stopBackgroundRecording() {
        if (clipRecorder && isRecording) {
            clipRecorder.stop();
            clipRecorder.stream.getTracks().forEach(t => t.stop());
        }
        clipRecorder = null;
        clipChunks = [];
        isRecording = false;
    }

    window.takeClip = async function() {
        if (!isRecording || clipChunks.length === 0 || !clipFolder) return;
        if (document.getElementById('clip-recording-overlay')) return; // Schutz vor Spammen

        const overlay = document.createElement('div');
        overlay.id = 'clip-recording-overlay';
        overlay.style.cssText = 'position: fixed; top: 60px; right: 40px; background: #34c759; color: white; padding: 12px 24px; border-radius: 24px; font-weight: bold; font-size: 14px; z-index: 99999; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(52, 199, 89, 0.4); pointer-events: none;';
        overlay.innerHTML = '<div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div> Generiere Video...';
        document.body.appendChild(overlay);

        if (clipRecorder && clipRecorder.state === 'recording') {
            clipRecorder.requestData(); // Zwingt den Recorder, auch die letzte Sekunde noch schnell zu speichern
        }
        
        await new Promise(r => setTimeout(r, 150)); // Kurze Wartezeit, damit das Video finalisiert wird

        try {
            const blobsToSave = clipChunks.map(c => c.blob);
            const filename = `AetherClip_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
            let savedPath = '';

            for (let i = 0; i < blobsToSave.length; i++) {
                const chunkBlob = blobsToSave[i];
                const chunkBuffer = new Uint8Array(await chunkBlob.arrayBuffer());
                
                // Sende Chunks einzeln an den Main-Prozess, um IPC-Limits & RAM-Abstürze zu verhindern
                if (window.electronAPI.saveClipChunk) {
                    savedPath = await window.electronAPI.saveClipChunk({
                        buffer: chunkBuffer,
                        folder: clipFolder,
                        filename: filename,
                        append: i > 0
                    });
                } else {
                    // Fallback für alte preload.js
                    const superBlob = new Blob(blobsToSave, { type: 'video/webm; codecs=vp9' });
                    const fullBuffer = new Uint8Array(await superBlob.arrayBuffer());
                    savedPath = await window.electronAPI.saveClip({ buffer: fullBuffer, folder: clipFolder, filename: filename });
                    break;
                }
            }

            overlay.innerHTML = '✅ Clip erfolgreich gespeichert!';
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 3000);
            
            const newClip = {
                id: Date.now(),
                path: savedPath,
                title: filename,
                timestamp: Date.now(),
                duration: clipDurationMs
            };
            publishedClips.unshift(newClip);
            localStorage.setItem('aether-clips', JSON.stringify(publishedClips));

            if (addonsNavBtn.classList.contains('active')) {
                renderAddonsView();
            }
        } catch (err) {
            console.error('Klip save error', err);
            overlay.innerHTML = '❌ Fehler beim Speichern!';
            overlay.style.background = '#ff3b30';
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 3000);
        }
    };

    function renderClips() {
        const grid = document.getElementById('clips-grid');
        if (!grid) return;
        grid.innerHTML = '';
        if (publishedClips.length === 0) {
            grid.innerHTML = `<div style="color: var(--text-secondary); font-size: 13px;">Noch keine Clips vorhanden. Lege einen Speicherort fest, aktiviere die Aufnahme und drücke ${clipHotkey}!</div>`;
            return;
        }

        publishedClips.forEach(clip => {
            const card = document.createElement('div');
            card.className = 'settings-card';
            card.style.cssText = 'padding: 12px; display: flex; flex-direction: column; gap: 8px; cursor: pointer; position: relative; transition: transform 0.2s;';
            card.title = "Klicken, um Video in System-Player zu öffnen";
            card.onmouseenter = () => card.style.transform = 'translateY(-4px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';
            
            let timeStr = new Date(clip.timestamp).toLocaleString([], {day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'});
            let durationMins = Math.round(clip.duration / 60000);
            
            card.innerHTML = `
                <div style="width: 100%; height: 120px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; position: relative;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.4;"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">${durationMins} Min.</div>
                </div>
                <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px;">${clip.title}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-secondary);">
                    <span>${timeStr}</span>
                    <div style="display: flex; gap: 8px;">
                        <button class="clip-share-btn" style="background:none; border:none; color:inherit; cursor:pointer; padding:2px;" title="Link kopieren" onmouseenter="this.style.color='var(--accent-color)'" onmouseleave="this.style.color='inherit'">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        </button>
                        <button class="clip-delete-btn" style="background:none; border:none; color:inherit; cursor:pointer; padding:2px;" title="Löschen" onmouseenter="this.style.color='#ff3b30'" onmouseleave="this.style.color='inherit'">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
            
            card.onclick = (e) => {
                const isShare = e.target.closest('.clip-share-btn');
                const isDelete = e.target.closest('.clip-delete-btn');

                if (isDelete) {
                    e.stopPropagation();
                    if (confirm('Möchtest du diesen Clip wirklich löschen?')) {
                        if (window.electronAPI && window.electronAPI.deleteFile) window.electronAPI.deleteFile(clip.path);
                        publishedClips = publishedClips.filter(c => c.id !== clip.id);
                        localStorage.setItem('aether-clips', JSON.stringify(publishedClips));
                        renderClips();
                    }
                    return;
                }

                if (isShare) {
                    e.stopPropagation();
                    const fileUrl = filePathToFileUrl(clip.path);
                    navigator.clipboard.writeText(fileUrl);
                    alert('Lokaler Link in die Zwischenablage kopiert!\\n\\nTipp: Um ihn echten Freunden zu schicken, musst du das Video irgendwo hochladen (z.B. in Discord ziehen). Du kannst den kopierten Link aber hier in Aether einfügen, um es anzusehen.');
                    return;
                }

                // Im Browser als neuen Tab öffnen
                createTab(filePathToFileUrl(clip.path));
            };
            
            grid.appendChild(card);
        });
    }

    addonsNavBtn.onclick = () => {
        resetViews();
        addonsView.classList.remove('hidden');
        addonsNavBtn.classList.add('active');
        
        // Verstecke die Tabs und die Suchleiste in diesem Fenster
        const tabsCont = document.querySelector('.tabs-container');
        const headerCont = document.querySelector('.app-header');
        if (tabsCont) tabsCont.style.display = 'none';
        if (headerCont) headerCont.style.display = 'none';
        
        currentAddonView = 'main';
        renderAddonsView();
    };

    // --- AUTO-START CLIPS RECORDING ---
    if (clipsAddonInstalled && window.clipModeActive) {
        if (clipFolder) {
            startBackgroundRecording();
        } else {
            window.clipModeActive = false;
            localStorage.setItem('aether-clips-addon-active', 'false');
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
