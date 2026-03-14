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
    const homeNavBtn = document.getElementById('home-nav-btn');
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const historyToggleBtn = document.getElementById('history-toggle-btn');
    const explorerNavBtn = document.getElementById('explorer-nav-btn');
    const settingsNavBtn = document.getElementById('settings-nav-btn');
    const workspaceNavBtn = document.getElementById('workspace-nav-btn');
    const splashView = document.getElementById('splash-view');
    const settingsView = document.getElementById('settings-view');
    const themeSelect = document.getElementById('theme-select');
    const searchEngineSelect = document.getElementById('search-engine-select');
    const clearDataBtn = document.getElementById('clear-data-btn');
    const groqApiKeyInput = document.getElementById('groq-api-key-input');
    const groqApiKeySaveBtn = document.getElementById('groq-api-key-save');
    const groqApiKeyClearBtn = document.getElementById('groq-api-key-clear');
    const groqApiKeyStatus = document.getElementById('groq-api-key-status');
    const updateCheckBtn = document.getElementById('update-check-btn');
    const updateInstallBtn = document.getElementById('update-install-btn');
    const updateStatusEl = document.getElementById('update-status');
    const appVersionEl = document.getElementById('app-version');
    const explorerView = document.getElementById('explorer-view');
    const explorerResults = document.getElementById('explorer-results');
    const explorerSearchInput = document.getElementById('explorer-search-input');
    const explorerSearchBtn = document.getElementById('explorer-search-btn');
    const explorerAddRootBtn = document.getElementById('explorer-add-root');
    const explorerRootsEl = document.getElementById('explorer-roots');
    const workspaceView = document.getElementById('workspace-view');
    const aiSidebar = document.getElementById('ai-sidebar');
    const historySidebar = document.getElementById('history-sidebar');
    const topAddressBar = document.getElementById('top-address-bar');
    const homeSearchInput = document.getElementById('home-search-input');
    const homeSearchSubmitBtn = document.getElementById('home-search-submit');
    const homeSearchGearBtn = document.getElementById('home-search-gear');
    const favoritesBar = document.getElementById('favorites-bar');
    const workspaceGrid = document.getElementById('workspace-grid');
    const workspaceSubtitle = document.getElementById('workspace-subtitle');
    const schoolPanel = document.getElementById('school-panel');
    const schoolAiInput = document.getElementById('school-ai-input');
    const schoolAiAskBtn = document.getElementById('school-ai-ask');
    const focusPanel = document.getElementById('focus-panel');
    const focusMeta = document.getElementById('focus-meta');
    const focusHint = document.getElementById('focus-hint');
    const focusProgressBar = document.getElementById('focus-progress-bar');
    const focusStartBtn = document.getElementById('focus-start');
    const moveTabTarget = document.getElementById('move-tab-target');
    const moveTabBtn = document.getElementById('move-tab-btn');
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
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');
    const tabsContainer = document.querySelector('.tabs-container');
    const addTabBtn = document.getElementById('add-tab-btn');
    const webviewsContainer = document.getElementById('webviews-container');
    const customContextMenu = document.getElementById('custom-context-menu');
    const aiSidebarResizer = document.getElementById('ai-sidebar-resizer');
    let tabCounter = 0;
    let activeTabId = null;
    let browserHistory = [];
    // Workspace + Favorites state (renderer-only; sessions are enforced via webview partition per tab).
    const workspaceIds = ['schule', 'freizeit', 'programmieren', 'fokus'];
    let activeWorkspaceId = 'freizeit';
    let favorites = [];
    // Used by showAiModeToast(); must be initialized before any toast call (e.g. workspace switching).
    let aiModeToastTimer = null;
    // Fokus timer state (renderer-enforced; for stricter enforcement move to main process).
    const FOCUS_MAX_MIN = 180;
    const FOCUS_BREAK_MIN = 15;
    let focusSelectedMin = 180;
    let focusSession = null; // { startedAt, deadlineAt, lockedUntil, durationMin }
    try {
        const savedWs = localStorage.getItem('aether-active-workspace');
        if (savedWs && workspaceIds.includes(savedWs)) activeWorkspaceId = savedWs;
    } catch (e) {
        // ignore
    }
    try {
        const savedFavs = JSON.parse(localStorage.getItem('aether-favorites') || '[]');
        if (Array.isArray(savedFavs)) favorites = savedFavs;
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
    function stashWorkspaceToLaterRead(workspaceId, reason) {
        const later = loadLaterRead();
        const items = later[workspaceId] && Array.isArray(later[workspaceId]) ? later[workspaceId] : [];
        const tabs = Array.from(document.querySelectorAll('.tab')).filter((t) => (t.dataset.workspaceId || 'freizeit') === workspaceId);
        for (const t of tabs) {
            if (t.classList.contains('pinned')) continue;
            const url = t.dataset.url || '';
            const title = t.querySelector('.tab-title') ? t.querySelector('.tab-title').textContent : '';
            if (!url || url === 'about:blank') continue;
            items.unshift({ url, title: title || url, at: Date.now(), reason: reason || '' });
            closeTab(t.id, { skipSave: true, noAutoCreate: true });
        }
        later[workspaceId] = items.slice(0, 200);
        saveLaterRead(later);
        scheduleSaveAppState();
    }
    function loadAppState() {
        return safeJsonParse(localStorage.getItem(APP_STATE_KEY), null);
    }
    function tabSnapshotFromDom(tabEl) {
        const tabId = tabEl.id;
        const ws = tabEl.dataset.workspaceId || 'freizeit';
        const url = tabEl.dataset.url || 'about:blank';
        const title = (tabEl.querySelector('.tab-title') && tabEl.querySelector('.tab-title').textContent) ? tabEl.querySelector('.tab-title').textContent : 'New Tab';
        const icon = tabEl.querySelector('.tab-icon') ? tabEl.querySelector('.tab-icon').getAttribute('src') : '';
        const pinned = tabEl.classList.contains('pinned');
        const asleep = tabEl.classList.contains('asleep') || tabEl.dataset.asleep === '1';
        const lastFocusedAtMs = Number(tabEl.dataset.lastFocusedAtMs || 0) || 0;
        return { id: tabId, workspaceId: ws, url, title, icon, pinned, asleep, lastFocusedAtMs };
    }
    function saveAppState() {
        try {
            const tabs = Array.from(document.querySelectorAll('.tab')).map(tabSnapshotFromDom);
            const state = {
                v: 1,
                activeWorkspaceId,
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
                addExplorerItem(t.title || t.url, `${t.workspaceId} · ${t.url}`, () => switchTab(t.id));
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
            else for (const t of tabs) addExplorerItem(t.title || t.url, `${t.workspaceId} · ${t.url}`, () => switchTab(t.id));
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
        if (!activeWebview || !activeWebview.getURL) return;
        const url = activeWebview.getURL();
        if (!url || url === 'about:blank') return;
        const title = activeWebview.getTitle ? (activeWebview.getTitle() || url) : url;
        addFavorite(url, title);
    }
    function addFavorite(url, title) {
        const u = String(url || '').trim();
        if (!u || u === 'about:blank') return false;
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
            const rm = document.createElement('span');
            rm.className = 'fav-remove';
            rm.textContent = '×';
            rm.title = 'Entfernen';
            rm.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(fav.url);
            });
            pill.appendChild(rm);
            favoritesBar.appendChild(pill);
        }
        favoritesBar.classList.toggle('is-visible', true);
    }
    function setActiveWorkspace(nextWorkspaceId) {
        if (!workspaceIds.includes(nextWorkspaceId)) return;
        activeWorkspaceId = nextWorkspaceId;
        try {
            localStorage.setItem('aether-active-workspace', activeWorkspaceId);
        } catch (e) {
            // ignore
        }
        if (workspaceSubtitle) {
            const label = activeWorkspaceId.charAt(0).toUpperCase() + activeWorkspaceId.slice(1);
            workspaceSubtitle.textContent = label;
        }
        // Popup/Toast inside AI area when switching "mode" (workspace).
        const wsLabel = activeWorkspaceId.charAt(0).toUpperCase() + activeWorkspaceId.slice(1);
        if (aiModeToast) showAiModeToast(`Workspace: ${wsLabel}`);
        if (workspaceGrid) {
            workspaceGrid.querySelectorAll('.ws-card').forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.workspaceId === activeWorkspaceId);
            });
        }
        if (schoolPanel) schoolPanel.style.display = activeWorkspaceId === 'schule' ? '' : 'none';
        if (focusPanel) focusPanel.style.display = activeWorkspaceId === 'fokus' ? '' : 'none';
        scheduleSaveAppState();
    }
    function workspacePartition(workspaceId) {
        return `persist:aether-ws-${workspaceId}`;
    }
    let isApplyingWorkspaceFilter = false;
    function applyWorkspaceFilter() {
        if (isApplyingWorkspaceFilter) return;
        isApplyingWorkspaceFilter = true;
        try {
            const allTabs = Array.from(document.querySelectorAll('.tab'));
            let firstVisibleTabId = null;
            for (const t of allTabs) {
                const ws = t.dataset.workspaceId || 'freizeit';
                const visible = ws === activeWorkspaceId;
                t.style.display = visible ? '' : 'none';
                if (visible && !firstVisibleTabId) firstVisibleTabId = t.id;
            }
            const activeTabEl = activeTabId ? document.getElementById(activeTabId) : null;
            const activeVisible = activeTabEl && activeTabEl.style.display !== 'none';
            if (!activeVisible) {
                if (firstVisibleTabId) {
                    switchTab(firstVisibleTabId, { fromFilter: true });
                } else {
                    createTab('about:blank', { workspaceId: activeWorkspaceId });
                }
            } else {
                // Ensure correct webview visibility
                switchTab(activeTabId, { fromFilter: true });
            }
        } finally {
            isApplyingWorkspaceFilter = false;
        }
    }
    // Load history from localStorage
    try {
        browserHistory = JSON.parse(localStorage.getItem('aether-history') || '[]');
        if (!Array.isArray(browserHistory)) browserHistory = [];
    } catch (e) {
        console.error('Error loading history:', e);
    }
    // Init UI state
    setActiveWorkspace(activeWorkspaceId);
    renderFavoritesBar();
    if (schoolPanel) schoolPanel.style.display = activeWorkspaceId === 'schule' ? '' : 'none';
    if (focusPanel) focusPanel.style.display = activeWorkspaceId === 'fokus' ? '' : 'none';
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
    function loadFocusSession() {
        try {
            const raw = localStorage.getItem('aether-focus-session');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;
            return parsed;
        } catch (e) {
            return null;
        }
    }
    function saveFocusSession() {
        try {
            if (!focusSession) {
                localStorage.removeItem('aether-focus-session');
            } else {
                localStorage.setItem('aether-focus-session', JSON.stringify(focusSession));
            }
        } catch (e) {
            // ignore
        }
    }
    function focusStatus(nowMs) {
        const now = nowMs || Date.now();
        if (!focusSession) return { status: 'inactive', remainingMs: 0, progress01: 0 };
        if (focusSession.lockedUntil && now < focusSession.lockedUntil) {
            return { status: 'locked', remainingMs: focusSession.lockedUntil - now, progress01: 1 };
        }
        if (focusSession.deadlineAt && now < focusSession.deadlineAt) {
            const totalMs = (focusSession.durationMin || FOCUS_MAX_MIN) * 60_000;
            const remainingMs = focusSession.deadlineAt - now;
            const progress01 = totalMs > 0 ? 1 - remainingMs / totalMs : 0;
            return { status: 'active', remainingMs, progress01: Math.max(0, Math.min(1, progress01)) };
        }
        return { status: 'inactive', remainingMs: 0, progress01: 0 };
    }
    function formatMmSs(ms) {
        const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
        const mm = Math.floor(totalSeconds / 60);
        const ss = totalSeconds % 60;
        return `${mm}:${String(ss).padStart(2, '0')}`;
    }
    function updateFocusUi() {
        const st = focusStatus();
        if (focusMeta) {
            if (st.status === 'active') focusMeta.textContent = `rest: ${formatMmSs(st.remainingMs)}`;
            else if (st.status === 'locked') focusMeta.textContent = `pause: ${formatMmSs(st.remainingMs)}`;
            else focusMeta.textContent = `max ${FOCUS_MAX_MIN} min`;
        }
        if (focusHint) {
            if (st.status === 'active') focusHint.textContent = `Fokus laeuft. Restzeit: ${formatMmSs(st.remainingMs)}.`;
            else if (st.status === 'locked') focusHint.textContent = `Fokus gesperrt. Pause: ${formatMmSs(st.remainingMs)}.`;
            else focusHint.textContent = 'Noch nicht gestartet.';
        }
        if (focusProgressBar) {
            const pct = st.status === 'active' ? Math.round(st.progress01 * 100) : 0;
            focusProgressBar.style.width = `${pct}%`;
            // Visual feedback: shift accent from blue to red as time runs out.
            const p = st.status === 'active' ? st.progress01 : 0;
            const lerp = (a, b, t) => Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));
            const from = { r: 0, g: 122, b: 255 };
            const to = { r: 255, g: 59, b: 48 };
            const c = { r: lerp(from.r, to.r, p), g: lerp(from.g, to.g, p), b: lerp(from.b, to.b, p) };
            focusProgressBar.style.background = `linear-gradient(90deg, rgba(0,122,255,0.85), rgba(${c.r},${c.g},${c.b},0.90))`;
        }
        if (focusPanel) {
            focusPanel.querySelectorAll('.ws-panel-chip').forEach((b) => {
                b.classList.toggle('active', String(b.dataset.focusMin) === String(focusSelectedMin));
            });
        }
    }
    function startFocus(durationMin) {
        const now = Date.now();
        const st = focusStatus(now);
        if (st.status === 'locked') {
            updateFocusUi();
            return false;
        }
        const dur = Math.max(1, Math.min(FOCUS_MAX_MIN, Number(durationMin) || FOCUS_MAX_MIN));
        focusSession = {
            durationMin: dur,
            startedAt: now,
            deadlineAt: now + dur * 60_000,
            lockedUntil: null,
        };
        saveFocusSession();
        setActiveWorkspace('fokus');
        applyWorkspaceFilter();
        updateFocusUi();
        return true;
    }
    function tickFocusTimer() {
        const now = Date.now();
        if (!focusSession) {
            updateFocusUi();
            return;
        }
        // Lock expired: reset to inactive (allow new focus session)
        if (focusSession.lockedUntil && now >= focusSession.lockedUntil && !focusSession.deadlineAt) {
            focusSession = null;
            saveFocusSession();
            updateFocusUi();
            return;
        }
        // Active focus expired: lock + force switch to Freizeit
        if (focusSession.deadlineAt && now >= focusSession.deadlineAt) {
            // Move unfinished Fokus tabs to "Später lesen" to avoid tab clutter.
            stashWorkspaceToLaterRead('fokus', 'focus-timer-expired');
            focusSession = {
                durationMin: focusSession.durationMin || FOCUS_MAX_MIN,
                startedAt: null,
                deadlineAt: null,
                lockedUntil: now + FOCUS_BREAK_MIN * 60_000,
            };
            saveFocusSession();
            setActiveWorkspace('freizeit');
            applyWorkspaceFilter();
        }
        updateFocusUi();
    }
    focusSession = loadFocusSession();
    updateFocusUi();
    window.setInterval(tickFocusTimer, 1000);
    // Workspace tab navigation
    if (workspaceNavBtn && workspaceView) {
        workspaceNavBtn.onclick = () => {
            resetViews();
            workspaceView.classList.remove('hidden');
            workspaceNavBtn.classList.add('active');
            updateFocusUi();
        };
    }
    // Workspace selection cards
    if (workspaceGrid) {
        workspaceGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.ws-card');
            if (!card) return;
            const nextWs = card.dataset.workspaceId;
            if (!workspaceIds.includes(nextWs)) return;
            if (nextWs === 'fokus') {
                const st = focusStatus(Date.now());
                if (st.status === 'locked') {
                    setActiveWorkspace('freizeit');
                    applyWorkspaceFilter();
                    updateFocusUi();
                    return;
                }
            }
            setActiveWorkspace(nextWs);
            applyWorkspaceFilter();
            updateFocusUi();
        });
    }
    // Schule: KI-Suche (automatisch Live-Recherche)
    if (schoolAiInput) {
        schoolAiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                e.preventDefault();
                if (schoolAiAskBtn) schoolAiAskBtn.click();
            }
        });
    }
    if (schoolAiAskBtn) {
        schoolAiAskBtn.addEventListener('click', () => {
            const q = (schoolAiInput ? schoolAiInput.value.trim() : '');
            if (!q) return;
            setActiveWorkspace('schule');
            applyWorkspaceFilter();
            if (aiSidebar) aiSidebar.classList.remove('hidden');
            sendToAI(`Recherchiere: ${q}`);
            if (schoolAiInput) schoolAiInput.value = '';
        });
    }
    // Fokus presets + Start
    if (focusPanel) {
        focusPanel.addEventListener('click', (e) => {
            const chip = e.target.closest('.ws-panel-chip');
            if (!chip) return;
            const m = Number(chip.dataset.focusMin);
            if (!Number.isFinite(m)) return;
            focusSelectedMin = Math.max(1, Math.min(FOCUS_MAX_MIN, m));
            updateFocusUi();
        });
    }
    if (focusStartBtn) {
        focusStartBtn.addEventListener('click', () => startFocus(focusSelectedMin));
    }
    // Move active tab to another workspace (session-clean copy)
    function moveActiveTabToWorkspace(targetWs) {
        if (!workspaceIds.includes(targetWs)) return;
        const wv = getActiveWebview();
        if (!wv || !wv.getURL) return;
        const url = wv.getURL();
        if (!url || url === 'about:blank') return;
        const oldTabId = activeTabId;
        setActiveWorkspace(targetWs);
        applyWorkspaceFilter();
        createTab(url);
        closeTab(oldTabId);
    }
    if (moveTabBtn && moveTabTarget) {
        moveTabBtn.addEventListener('click', () => moveActiveTabToWorkspace(moveTabTarget.value));
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
            const seed = (schoolAiInput && schoolAiInput.value.trim())
                ? schoolAiInput.value.trim()
                : (micTranscript && micTranscript.textContent ? micTranscript.textContent.trim() : '');
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
                        aiContextPill.classList.remove('hidden');
                    }
                };
                reader.readAsText(file);
                aiFileInput.value = ''; // Allow re-selecting the same file
            }
        });
    }
    if (aiContextClear && aiContextPill) {
        aiContextClear.addEventListener('click', () => {
            aiContextPill.classList.add('hidden');
            delete aiContextPill.dataset.fileContent;
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
    // Render history list
    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        if (browserHistory.length === 0) {
            historyList.innerHTML = '<div style="padding:12px; color:#86868b; font-size:13px; text-align:center;">Kein Verlauf vorhanden.</div>';
            return;
        }
        const fragment = document.createDocumentFragment();
        browserHistory.slice(0, 50).forEach((item) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.dataset.url = item.url; // Store URL in data attribute
            div.innerHTML = `<div class="history-title">${item.title || item.url}</div><div class="history-url">${item.url}</div>`;
            fragment.appendChild(div);
        });
        historyList.appendChild(fragment); // Single append to the DOM
    }
    renderHistory();
    // Save history
    function saveHistory(url, title) {
        if (!url || url === 'about:blank') return;
        if (browserHistory.length > 0 && browserHistory[0].url === url) return;
        browserHistory.unshift({ url, title: title || url, time: Date.now() });
        if (browserHistory.length > 100) browserHistory.pop();
        localStorage.setItem('aether-history', JSON.stringify(browserHistory));
        renderHistory();
    }
    // View Management
    function resetViews(keepWebview = false) {
        if (splashView) splashView.style.display = 'none';
        if (settingsView) settingsView.classList.add('hidden');
        if (explorerView) explorerView.classList.add('hidden');
        if (workspaceView) workspaceView.classList.add('hidden');
        if (aiSidebar) aiSidebar.classList.add('hidden');
        if (historySidebar) historySidebar.classList.add('hidden');
        if (homeNavBtn) homeNavBtn.classList.remove('active');
        if (workspaceNavBtn) workspaceNavBtn.classList.remove('active');
        if (explorerNavBtn) explorerNavBtn.classList.remove('active');
        if (settingsNavBtn) settingsNavBtn.classList.remove('active');
        
        if (!keepWebview) {
            const webviews = document.querySelectorAll('webview');
            webviews.forEach(webview => webview.style.display = 'none');
        }
    }
    // Navigation
    window.navigate = function(url) {
        if (!url) return;
        resetViews(true);
        // Ensure there is an active tab to navigate in.
        if (!activeTabId || !document.getElementById(activeTabId)) {
            createTab('about:blank', { workspaceId: activeWorkspaceId });
        }
        
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
        
        let activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
        if (!activeWebview) activeWebview = wakeTab(activeTabId);
        if (activeWebview) {
            activeWebview.style.display = 'flex';
            activeWebview.src = target;
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
        standard: 'Du bist Aether AI, ein intelligenter Browser-Assistent, der auch Befehle wie "suche nach", "verlauf löschen" oder "analysiere diese seite" ausführen kann. Antworte IMMER auf Deutsch, kurz und prägnant.',
        creative: 'Du bist Aether AI, ein kreativer und gesprächiger Browser-Assistent. Deine Antworten sind ausführlich, ideenreich und du denkst gerne auch mal um die Ecke. Du kannst auch Befehle ausführen. Antworte IMMER auf Deutsch.',
        precise: 'Du bist Aether AI, ein hochpräziser und faktenbasierter Browser-Assistent. Deine Antworten sind extrem kurz, auf den Punkt und enthalten nur die angefragten Informationen. Du führst auch Befehle aus. Antworte IMMER auf Deutsch.'
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
            // C. Simple Browser Commands (no context gathering needed)
            if (!options.imageDataUrl) {
                if (lowerText.startsWith('suche nach ') || lowerText.startsWith('suche ')) {
                    const query = commandText.substring(commandText.indexOf(' ') + 1);
                    appendMessage('bot', `Ich navigiere zur Suche für "${query}"...`);
                    navigate(query);
                    return;
                }
                if (lowerText.includes('verlauf löschen')) {
                    clearHistoryBtn.click();
                    appendMessage('bot', 'Dein Browserverlauf wurde gelöscht.');
                    return;
                }
                if (lowerText.includes('neuer tab')) {
                    createTab();
                    appendMessage('bot', 'Ein neuer Tab wurde geöffnet.');
                    return;
                }
                if (lowerText.includes('schließe tab') || lowerText.includes('tab schliessen')) {
                    if (document.querySelectorAll('.tab').length > 1) {
                        closeTab(activeTabId);
                        appendMessage('bot', 'Der aktive Tab wurde geschlossen.');
                    } else {
                        appendMessage('bot', 'Der letzte Tab kann nicht geschlossen werden.');
                    }
                    return;
                }
                if (lowerText.includes('analysiere diese seite')) {
                    aiSidebar.classList.remove('hidden');
                    analyzeActivePage(); // This uses screenshot, which is different from scanning text
                    return;
                }
            }
        }
        // --- Step 2: Build Final Prompt ---
        const loadingId = options.loadingId || 'loading-' + Date.now();
        let finalContext = options.context || '';
        const fileContent = aiContextPill?.dataset.fileContent;
        if (aiContextPill && !aiContextPill.classList.contains('hidden') && fileContent) {
            finalContext += `Nutze zusätzlich den folgenden Dateikontext:\n---\n${fileContent}\n---\n`;
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
            if (options.imageDataUrl) {
                model = 'llava-v1.5-7b-instruct-int8'; // Vision model
                messages = [{
                    role: 'user',
                    content: [
                        { type: 'text', text: commandText },
                        { type: 'image_url', image_url: { url: options.imageDataUrl } }
                    ]
                }];
            } else {
                model = 'llama-3.3-70b-versatile'; // Text model
                const selectedMode = aiModes[currentAiModeIndex] || 'standard';
                const systemPrompt = systemPrompts[selectedMode] || systemPrompts.standard;
                messages = [
                    { 'role': 'system', 'content': systemPrompt },
                    { 'role': 'user', 'content': commandText }
                ];
            }
            const data = await window.electronAPI.aiChat({
                model,
                messages,
                max_tokens: 1024
            });
            const botMessage = data?.choices?.[0]?.message?.content || 'Keine Antwort erhalten.';
            const finalLoadingEl = document.getElementById(loadingId);
            if (finalLoadingEl) finalLoadingEl.remove();
            appendMessage('bot', botMessage);
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
                let fallback = 'New Tab';
                if (url) {
                    try {
                        fallback = new URL(url).hostname || url;
                    } catch {
                        fallback = url;
                    }
                }
                titleEl.textContent = title || fallback;
            }
            if (tabId === activeTabId && topAddressBar) topAddressBar.value = url === 'about:blank' ? '' : url;
            // Default: keep icon hidden unless we have a favicon.
            if (iconEl && !iconEl.getAttribute('src')) {
                iconEl.style.display = 'none';
            }
            scheduleSaveAppState();
        }
        webview.addEventListener('did-finish-load', () => {
            updateTabUI();
            if (tabId === activeTabId) updatePageContext();
        });
        webview.addEventListener('page-title-updated', () => {
            updateTabUI();
            if (tabId === activeTabId) updatePageContext();
        });
        webview.addEventListener('page-favicon-updated', (_event, favicons) => {
            const tabEl = document.getElementById(tabId);
            if (!tabEl) return;
            const iconEl = tabEl.querySelector('.tab-icon');
            const fav = Array.isArray(favicons) ? favicons[0] : null;
            if (iconEl && fav) {
                iconEl.setAttribute('src', fav);
                iconEl.style.display = 'block';
                tabEl.dataset.icon = fav;
                scheduleSaveAppState();
            }
        });
        webview.addEventListener('did-navigate', () => {
            updateTabUI();
            if (tabId === activeTabId) updatePageContext();
        });
        webview.addEventListener('did-navigate-in-page', () => {
            updateTabUI();
            if (tabId === activeTabId) updatePageContext();
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
    function createWebviewForTab(tabId, workspaceId, url) {
        if (!webviewsContainer) return null;
        const webview = document.createElement('webview');
        webview.setAttribute('data-tab-id', tabId);
        webview.setAttribute('data-workspace-id', workspaceId);
        webview.setAttribute('partition', workspacePartition(workspaceId));
        // Enable in-webview features (e.g. custom context menu events) without exposing Node.js to pages.
        try {
            const baseDir = window.electronAPI && window.electronAPI.getAppDir ? String(window.electronAPI.getAppDir()) : '';
            const preloadPath = baseDir ? (baseDir.replace(/[\\\/]+$/, '') + '\\webview-preload.js') : 'webview-preload.js';
            webview.setAttribute('preload', preloadPath);
        } catch {
            webview.setAttribute('preload', 'webview-preload.js');
        }
        webview.src = url || 'about:blank';
        webview.style.display = 'none';
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
        const ws = opts.workspaceId || activeWorkspaceId;
        const tabId = nextTabId(opts.tabId);
        const isAsleep = !!opts.asleep;
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.id = tabId;
        tab.dataset.workspaceId = ws;
        tab.dataset.url = url || 'about:blank';
        tab.dataset.lastFocusedAtMs = String(Number(opts.lastFocusedAtMs || Date.now()));
        tab.innerHTML = `<img class="tab-icon" src="" alt=""><span class="tab-title">New Tab</span><span class="close-tab">×</span>`;
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
            iconEl.style.display = 'block';
            tab.dataset.icon = opts.icon;
        }
        if (!isAsleep) createWebviewForTab(tabId, ws, url);
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
        const ws = tabEl.dataset.workspaceId || activeWorkspaceId;
        const url = tabEl.dataset.url || 'about:blank';
        tabEl.classList.remove('asleep');
        tabEl.dataset.asleep = '0';
        const wv = createWebviewForTab(tabId, ws, url);
        scheduleSaveAppState();
        return wv;
    }
    function switchTab(tabId, opts = {}) {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;
        const ws = tabEl.dataset.workspaceId || 'freizeit';
        if (ws !== activeWorkspaceId) {
            setActiveWorkspace(ws);
            if (!opts.fromFilter) applyWorkspaceFilter();
        }
        activeTabId = tabId;
        wakeTab(tabId);
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tabEl.classList.add('active');
        tabEl.dataset.lastFocusedAtMs = String(Date.now());
        document.querySelectorAll('webview').forEach(w => w.style.display = 'none');
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
        if (activeWebview) activeWebview.style.display = 'flex';
        if (topAddressBar) topAddressBar.value = url === 'about:blank' ? '' : url;
        resetViews(true);
        if (!activeWebview || url === 'about:blank') {
            if (splashView) splashView.style.display = 'flex';
            if (activeWebview) activeWebview.style.display = 'none';
        } else {
            activeWebview.style.display = 'flex';
        }
        updatePageContext();
        scheduleSaveAppState();
    }
    function closeTab(tabId, opts = {}) {
        const tab = document.getElementById(tabId);
        if (!tab) return;
        const ws = tab.dataset.workspaceId || activeWorkspaceId;
        const webview = document.querySelector(`webview[data-tab-id="${tabId}"]`);
        if (webview) webview.remove();
        tab.remove();
        if (activeTabId === tabId) {
            const tabs = Array.from(document.querySelectorAll('.tab')).filter((t) => (t.dataset.workspaceId || 'freizeit') === ws);
            const next = tabs[0] || null;
            if (next) {
                switchTab(next.id);
            } else {
                if (opts.noAutoCreate) {
                    activeTabId = null;
                    resetViews(true);
                    if (splashView) splashView.style.display = 'flex';
                } else {
                    setActiveWorkspace(ws);
                    createTab('about:blank', { workspaceId: ws });
                }
            }
        }
        if (!opts.skipSave) scheduleSaveAppState();
    }
    function sleepTab(tabId) {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return false;
        if ((tabEl.dataset.workspaceId || 'freizeit') === activeWorkspaceId) return false;
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
            const ws = t.dataset.workspaceId || 'freizeit';
            if (ws === activeWorkspaceId) continue;
            const last = Number(t.dataset.lastFocusedAtMs || 0) || 0;
            if (!last) continue;
            if (now - last >= thresholdMs) sleepTab(t.id);
        }
    }
    
    // --- Tab Container Event Delegation ---
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.close-tab');
            if (closeBtn) {
                const tab = e.target.closest('.tab');
                if (tab) {
                    e.stopPropagation();
                    closeTab(tab.id);
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
        const state = loadAppState();
        // Clean slate (index.html doesn't ship a static tab/webview anymore, but keep this robust).
        document.querySelectorAll('.tab').forEach((t) => t.remove());
        document.querySelectorAll('webview').forEach((w) => w.remove());
        if (state && state.v === 1 && Array.isArray(state.tabs) && state.tabs.length) {
            const ws = state.activeWorkspaceId;
            if (ws && workspaceIds.includes(ws)) setActiveWorkspace(ws);
            tabCounter = Number(state.tabCounter || 0) || 0;
            for (const t of state.tabs) {
                if (!t || typeof t !== 'object') continue;
                const w = workspaceIds.includes(t.workspaceId) ? t.workspaceId : 'freizeit';
                createTab(t.url || 'about:blank', {
                    tabId: t.id,
                    workspaceId: w,
                    switchTo: false,
                    title: t.title,
                    icon: t.icon,
                    pinned: !!t.pinned,
                    asleep: !!t.asleep,
                    lastFocusedAtMs: Number(t.lastFocusedAtMs || 0) || 0,
                });
            }
            activeTabId = state.activeTabId || null;
            applyWorkspaceFilter();
            if (activeTabId && document.getElementById(activeTabId)) {
                switchTab(activeTabId, { fromFilter: true });
            }
            return;
        }
        // Default: one blank tab in the active workspace.
        createTab('about:blank', { workspaceId: activeWorkspaceId });
        applyWorkspaceFilter();
    }
    try {
        restoreTabsFromState();
    } catch (e) {
        console.error('restoreTabsFromState failed:', e);
        // Continue wiring events so UI doesn't go dead.
    }
    window.addEventListener('beforeunload', () => saveAppState());
    window.setInterval(reclaimMemory, 60_000);
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
            
            const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
            if (activeWebview) {
                activeWebview.src = 'about:blank';
                activeWebview.style.display = 'none';
            }
        };
    }
    if (explorerNavBtn) {
        explorerNavBtn.onclick = () => {
            resetViews();
            if (explorerView) explorerView.classList.remove('hidden');
            explorerNavBtn.classList.add('active');
            renderExplorerRoots();
            if (explorerSearchInput) explorerSearchInput.focus();
        };
    }
    if (settingsNavBtn) {
        settingsNavBtn.onclick = () => {
            resetViews();
            settingsView.classList.remove('hidden');
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
    } catch {
        // ignore
    }
    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            const v = themeSelect.value === 'dark' ? 'dark' : 'light';
            try { localStorage.setItem('aether-theme', v); } catch { /* ignore */ }
            document.documentElement.classList.toggle('theme-dark', v === 'dark');
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
                localStorage.removeItem('aether-focus-session');
                localStorage.removeItem(APP_STATE_KEY);
            } catch {
                // ignore
            }
            browserHistory = [];
            favorites = [];
            renderFavoritesBar();
            renderHistory();
            restoreTabsFromState();
            if (settingsNavBtn) settingsNavBtn.click();
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

    if (aiToggleBtn) {
        aiToggleBtn.onclick = () => {
            if (aiSidebar) {
                aiSidebar.classList.toggle('hidden');
                if (!aiSidebar.classList.contains('hidden')) {
                    updatePageContext();
                }
            }
        };
    }
    if (historyToggleBtn) {
        historyToggleBtn.onclick = () => {
            if (historySidebar) historySidebar.classList.toggle('hidden');
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
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = () => {
            browserHistory = [];
            localStorage.removeItem('aether-history');
            renderHistory();
        };
    }
    // Universal Explorer controls
    if (explorerAddRootBtn) {
        explorerAddRootBtn.addEventListener('click', async () => {
            try {
                const dir = window.electronAPI && window.electronAPI.pickFolder ? await window.electronAPI.pickFolder() : null;
                if (!dir) return;
                if (!explorerRoots.includes(dir)) explorerRoots.unshift(dir);
                explorerRoots = explorerRoots.slice(0, 8);
                saveExplorerRoots();
                renderExplorerRoots();
            } catch (e) {
                console.error('explorer-add-root failed:', e);
            }
        });
    }
    if (explorerSearchInput) {
        explorerSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                e.preventDefault();
                runExplorerSearch(explorerSearchInput.value);
            }
        });
    }
    if (explorerSearchBtn && explorerSearchInput) {
        explorerSearchBtn.addEventListener('click', () => runExplorerSearch(explorerSearchInput.value));
    }
    // Input Event Listeners
    if (topAddressBar) {
        topAddressBar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                e.preventDefault();
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
    // Show home on load
    if (homeNavBtn) homeNavBtn.click();
    // --- Custom Context Menu ---
    function buildAndShowMenu(type, params) {
        const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
        if (!customContextMenu) return;
        let menuTemplate = [];
        if (type === 'webview') {
            if (params && params.pageURL && params.pageURL !== 'about:blank') {
                const url = String(params.pageURL);
                const title = activeWebview && activeWebview.getTitle ? (activeWebview.getTitle() || url) : url;
                const isFav = favorites.some((f) => f && f.url === url);
                menuTemplate.push({
                    label: isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen',
                    action: () => (isFav ? removeFavorite(url) : addFavorite(url, title)),
                });
                menuTemplate.push({ type: 'separator' });
            }
            if (params.linkURL && !params.selectionText) {
                menuTemplate.push({ label: 'Link in neuem Tab öffnen', action: () => createTab(params.linkURL) });
                menuTemplate.push({ label: 'Link-Adresse kopieren', action: () => navigator.clipboard.writeText(params.linkURL) });
                menuTemplate.push({ type: 'separator' });
            }
            if (params.srcURL) {
                menuTemplate.push({ label: 'Bild in neuem Tab öffnen', action: () => createTab(params.srcURL) });
                menuTemplate.push({ label: 'Bildadresse kopieren', action: () => navigator.clipboard.writeText(params.srcURL) });
                menuTemplate.push({ type: 'separator' });
            }
            if (params.selectionText) {
                menuTemplate.push({ label: 'Kopieren', action: () => { if (activeWebview) activeWebview.copy(); } });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Aether: Auswahl zusammenfassen', action: () => sendToAI(`Fasse zusammen: "${params.selectionText}"`) });
                menuTemplate.push({ label: 'Aether: Auswahl erklären', action: () => sendToAI(`Erkläre: "${params.selectionText}"`) });
                menuTemplate.push({ type: 'separator' });
            }
            if (params.isEditable) {
                menuTemplate.push({ label: 'Rückgängig', action: () => activeWebview.undo() });
                menuTemplate.push({ label: 'Wiederholen', action: () => activeWebview.redo() });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Ausschneiden', action: () => activeWebview.cut() });
                menuTemplate.push({ label: 'Kopieren', action: () => activeWebview.copy() });
                menuTemplate.push({ label: 'Einfügen', action: () => activeWebview.paste() });
                menuTemplate.push({ label: 'Alles auswählen', action: () => activeWebview.selectAll() });
                menuTemplate.push({ type: 'separator' });
            }
            if (!params.selectionText && !params.linkURL && !params.srcURL && !params.isEditable) {
                if (activeWebview.canGoBack()) menuTemplate.push({ label: 'Zurück', action: () => activeWebview.goBack() });
                if (activeWebview.canGoForward()) menuTemplate.push({ label: 'Vorwärts', action: () => activeWebview.goForward() });
                menuTemplate.push({ label: 'Neu laden', action: () => activeWebview.reload() });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Aether: Diese Seite analysieren', action: () => analyzeActivePage() });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Untersuchen', action: () => activeWebview.inspectElement(params.x, params.y) });
            }
        }

        if (type === 'favorites-bar') {
            const wv = getActiveWebview();
            let url = null;
            let title = null;
            try {
                url = wv && wv.getURL ? wv.getURL() : null;
                title = wv && wv.getTitle ? wv.getTitle() : null;
            } catch {
                url = null;
                title = null;
            }
            if (url && url !== 'about:blank') {
                const isFav = favorites.some((f) => f && f.url === url);
                menuTemplate.push({
                    label: isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen',
                    action: () => (isFav ? removeFavorite(url) : addFavorite(url, title || url)),
                });
                menuTemplate.push({ label: 'Adresse kopieren', action: () => navigator.clipboard.writeText(String(url)) });
            }
        }

        if (type === 'favorite-pill') {
            const url = params && params.url ? String(params.url) : '';
            if (url) {
                menuTemplate.push({ label: 'In neuem Tab Ã¶ffnen', action: () => createTab(url) });
                menuTemplate.push({ label: 'Adresse kopieren', action: () => navigator.clipboard.writeText(url) });
                menuTemplate.push({ type: 'separator' });
                menuTemplate.push({ label: 'Aus Favoriten entfernen', action: () => removeFavorite(url) });
            }
        }

        if (menuTemplate.length === 0) return;
        const hideContextMenu = () => customContextMenu.classList.add('hidden');
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
            itemEl.textContent = item.label;
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
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
