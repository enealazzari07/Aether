const { app, BrowserWindow, ipcMain, Menu, shell, nativeTheme, nativeImage, safeStorage, dialog, session, webContents } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

let win;
let splash;

if (process.platform === 'win32') {
  app.setAppUserModelId('com.aether.browser');
}

let groqKeyCache = null;
let groqKeyLoaded = false;
let updaterWired = false;

function loadAppPackageJson() {
  try {
    const p = path.join(app.getAppPath(), 'package.json');
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function groqKeyFilePath() {
  return path.join(app.getPath('userData'), 'groq-api-key.dat');
}

function loadStoredGroqKey() {
  if (groqKeyLoaded) return groqKeyCache;
  groqKeyLoaded = true;
  try {
    const p = groqKeyFilePath();
    if (!fs.existsSync(p)) return null;
    const raw = String(fs.readFileSync(p, 'utf8') || '').trim();
    if (!raw) return null;

    if (raw.startsWith('enc:')) {
      const b64 = raw.slice(4).trim();
      if (!b64) return null;
      const buf = Buffer.from(b64, 'base64');
      groqKeyCache = safeStorage.decryptString(buf);
      return groqKeyCache;
    }

    if (raw.startsWith('plain:')) {
      groqKeyCache = raw.slice(6).trim();
      return groqKeyCache || null;
    }

    // Legacy fallback (treat as plain)
    groqKeyCache = raw;
    return groqKeyCache;
  } catch (e) {
    console.error('loadStoredGroqKey failed:', e);
    groqKeyCache = null;
    return null;
  }
}

function storeGroqKey(key) {
  const k = String(key || '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').trim();
  if (!k) throw new Error('Empty Groq API key.');

  const p = groqKeyFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });

  let payload;
  if (safeStorage && safeStorage.isEncryptionAvailable && safeStorage.isEncryptionAvailable()) {
    const enc = safeStorage.encryptString(k);
    payload = `enc:${enc.toString('base64')}`;
  } else {
    // Still user-specific via app.getPath('userData'), but not encrypted.
    payload = `plain:${k}`;
  }

  fs.writeFileSync(p, payload, 'utf8');
  groqKeyCache = k;
  groqKeyLoaded = true;
}

function clearGroqKey() {
  try {
    const p = groqKeyFilePath();
    if (fs.existsSync(p)) fs.unlinkSync(p);
  } catch (e) {
    // ignore
  }
  groqKeyCache = null;
  groqKeyLoaded = true;
}

function getGroqKey() {
  return process.env.GROQ_API_KEY || loadStoredGroqKey();
}

function getGroqKeyStatus() {
  const env = process.env.GROQ_API_KEY;
  const stored = loadStoredGroqKey();
  const hasKey = !!(env || stored);
  const source = env ? 'env' : (stored ? 'stored' : null);
  const encryptionAvailable = !!(safeStorage && safeStorage.isEncryptionAvailable && safeStorage.isEncryptionAvailable());
  return { hasKey, source, encryptionAvailable };
}

function getAppIcon() {
  return app.isPackaged 
    ? path.join(process.resourcesPath, 'favicon.ico') 
    : path.join(__dirname, 'build', 'favicon.ico');
}

function createWindow() {
  // Erstelle das Hauptfenster, aber zeige es noch nicht an
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Wichtig: Erst anzeigen, wenn es bereit ist
    icon: getAppIcon(),
    titleBarStyle: 'hidden', // Native windows app look
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // This is critical for loading Twitch/Google etc.
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.webContents.setWindowOpenHandler((details) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        titleBarStyle: 'hidden',
        icon: getAppIcon(),
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          webviewTag: true,
          preload: path.join(__dirname, 'preload.js')
        }
      }
    };
  });

  win.loadFile('index.html');

  function sendUpdateStatus(payload) {
    try {
      if (!win || win.isDestroyed()) return;
      win.webContents.send('update:status', { ...(payload || {}), at: Date.now(), version: app.getVersion() });
    } catch {
      // ignore
    }
  }

  function wireAutoUpdatesOnce() {
    if (updaterWired) return;
    updaterWired = true;

    // Always expose the current app version (useful in Settings / diagnostics).
    ipcMain.handle('app:version', async () => {
      const pkg = loadAppPackageJson();
      const tagRaw = pkg && typeof pkg.buildTag === 'string' ? pkg.buildTag.trim() : '';
      const buildSha = pkg && typeof pkg.buildSha === 'string' ? pkg.buildSha.trim() : '';
      const tag = tagRaw || `v${app.getVersion()}`;
      return { version: app.getVersion(), tag, buildSha };
    });

    // Avoid noisy errors in development; updates work only in packaged builds.
    if (!app.isPackaged) return;

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => sendUpdateStatus({ state: 'checking' }));
    autoUpdater.on('update-available', (info) => sendUpdateStatus({ state: 'available', info }));
    autoUpdater.on('update-not-available', (info) => sendUpdateStatus({ state: 'none', info }));
    autoUpdater.on('download-progress', (progress) => sendUpdateStatus({ state: 'downloading', progress }));
    autoUpdater.on('update-downloaded', (info) => sendUpdateStatus({ state: 'downloaded', info }));
    autoUpdater.on('error', (err) => sendUpdateStatus({ state: 'error', error: err ? String(err.message || err) : 'unknown' }));

    // Check immediately on startup.
    autoUpdater.checkForUpdates().catch((e) => sendUpdateStatus({ state: 'error', error: String(e && e.message ? e.message : e) }));

    // IPC for manual update actions.
    ipcMain.handle('update:check', async () => {
      sendUpdateStatus({ state: 'checking' });
      return autoUpdater.checkForUpdates();
    });
    ipcMain.handle('update:install', async () => {
      sendUpdateStatus({ state: 'installing' });
      autoUpdater.quitAndInstall(false, true);
      return true;
    });
  }

  wireAutoUpdatesOnce();

  // Surface renderer errors in the terminal to catch broken UI handlers quickly.
  win.webContents.on('console-message', (_e, level, message, line, sourceId) => {
    const lvl = ['LOG', 'WARN', 'ERROR'][Math.min(2, Math.max(0, level - 1))] || 'LOG';
    console.log(`[Renderer:${lvl}] ${message} (${sourceId}:${line})`);
  });

  // Wenn das Hauptfenster bereit ist, zerstöre den Splash-Screen und zeige das Hauptfenster an
  win.once('ready-to-show', () => {
    splash.destroy();
    win.show();
    win.focus();
  });

  // Disable security warnings (only for internal development use)
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

  // Remove default menu
  win.setMenu(null);

  // Open DevTools on F12
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      win.webContents.toggleDevTools();
    }
  });

  // IPC listeners for window controls
  ipcMain.on('minimize-app', () => {
    win.minimize();
  });

  ipcMain.on('maximize-app', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-app', () => {
    win.close();
  });

  // Handler für die Dateisuche im Universal Explorer
  // payload: string OR { query: string, roots?: string[] }
  ipcMain.handle('search-local-files', async (_event, payload) => {
    const results = [];
    const maxResults = 20;

    const query = typeof payload === 'string'
      ? payload
      : (payload && typeof payload === 'object' && payload.query) ? String(payload.query) : '';

    const roots = (payload && typeof payload === 'object' && Array.isArray(payload.roots))
      ? payload.roots
      : [app.getPath('documents')];

    const q = String(query || '').trim().toLowerCase();
    if (!q) return [];

    const isSafeRoot = (p) => {
      try {
        if (!p || typeof p !== 'string') return false;
        const resolved = path.resolve(p);
        if (!path.isAbsolute(resolved)) return false;
        return fs.existsSync(resolved);
      } catch {
        return false;
      }
    };

    const safeRoots = roots.filter(isSafeRoot).slice(0, 8);

    const walk = async (dir, depth) => {
      if (results.length >= maxResults) return;
      if (depth > 6) return;
      let entries;
      try {
        entries = await fs.promises.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const ent of entries) {
        if (results.length >= maxResults) return;
        const name = ent.name;
        const full = path.join(dir, name);
        if (name.toLowerCase().includes(q)) {
          results.push({
            title: name,
            path: full,
            type: ent.isDirectory() ? 'folder' : 'file'
          });
        }
        if (ent.isDirectory()) {
          const lower = name.toLowerCase();
          if (lower === 'node_modules' || lower === '.git') continue;
          await walk(full, depth + 1);
        }
      }
    };

    try {
      for (const root of safeRoots) {
        await walk(root, 0);
        if (results.length >= maxResults) break;
      }
    } catch (e) {
      console.error("Fehler beim Lesen der Dateien:", e);
    }
    return results;
  });

  ipcMain.on('open-file', (event, filePath) => {
    shell.openPath(filePath);
  });

  ipcMain.handle('pick-folder', async () => {
    try {
      const res = await dialog.showOpenDialog(win, { properties: ['openDirectory'] });
      if (res.canceled || !res.filePaths || !res.filePaths[0]) return null;
      return res.filePaths[0];
    } catch (e) {
      console.error('pick-folder failed:', e);
      return null;
    }
  });

  ipcMain.handle('destroy-webcontents', async (_event, id) => {
    try {
      const wcId = Number(id);
      if (!Number.isFinite(wcId)) return false;
      const wc = webContents.fromId(wcId);
      if (!wc || wc.isDestroyed()) return false;
      wc.destroy();
      return true;
    } catch (e) {
      console.error('destroy-webcontents failed:', e);
      return false;
    }
  });

  // Optional: load unpacked Chrome extensions (directory) into all workspace sessions.
  ipcMain.handle('load-chrome-extension', async (_event, dir) => {
    const extDir = typeof dir === 'string' ? dir : '';
    if (!extDir) throw new Error('No extension directory provided.');

    const parts = [
      'persist:aether-ws-schule',
      'persist:aether-ws-freizeit',
      'persist:aether-ws-programmieren',
      'persist:aether-ws-fokus',
    ];

    const loaded = [];
    for (const p of parts) {
      try {
        const s = session.fromPartition(p);
        const ext = await s.loadExtension(extDir, { allowFileAccess: true });
        loaded.push({ partition: p, id: ext.id, name: ext.name });
      } catch (e) {
        loaded.push({ partition: p, error: String(e && e.message ? e.message : e) });
      }
    }
    return loaded;
  });

  ipcMain.handle('clear-browser-data', async () => {
    const parts = [
      null, // defaultSession
      'persist:aether-ws-schule',
      'persist:aether-ws-freizeit',
      'persist:aether-ws-programmieren',
      'persist:aether-ws-fokus',
    ];

    const cleared = [];
    for (const p of parts) {
      try {
        const s = p ? session.fromPartition(p) : session.defaultSession;
        await s.clearCache();
        await s.clearStorageData();
        cleared.push({ partition: p || 'default', ok: true });
      } catch (e) {
        cleared.push({ partition: p || 'default', ok: false, error: String(e && e.message ? e.message : e) });
      }
    }
    return cleared;
  });

  // Handler für die Websuche
  ipcMain.handle('perform-search', async (event, query) => {
    console.log(`[Search] Führe Websuche durch für: ${query}`);
    try {
      const headers = {
        'User-Agent': 'AetherBrowser/1.0 (Electron)',
        'Accept-Language': 'de-CH,de;q=0.9,en;q=0.8',
      };

      const decodeEntities = (s) =>
        String(s || '')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ');

      const stripTags = (s) =>
        decodeEntities(String(s || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

      const normalizeHref = (href) => {
        let h = decodeEntities(href);
        if (h.startsWith('//')) h = `https:${h}`;
        if (h.startsWith('/')) h = `https://duckduckgo.com${h}`;
        return h;
      };

      const extractTargetUrl = (href) => {
        const h = normalizeHref(href);
        try {
          const u = new URL(h);
          const uddg = u.searchParams.get('uddg');
          if (uddg) return decodeURIComponent(uddg);
          return h;
        } catch {
          return h;
        }
      };

      // 1) DuckDuckGo HTML results (actual website links)
      const htmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const htmlResp = await fetch(htmlUrl, { headers });
      const html = await htmlResp.text();

      const results = [];
      if (htmlResp.ok && html) {
        const re = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
        let m;
        while ((m = re.exec(html)) && results.length < 5) {
          const href = m[1];
          const title = stripTags(m[2]);
          const rest = html.slice(m.index, m.index + 2200);
          const sn = rest.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
          const snippet = sn ? stripTags(sn[1]).replace(/\s+/g, ' ') : '';
          const url = extractTargetUrl(href);
          if (!url || !title) continue;
          results.push({ title, url, snippet });
        }
      }

      if (results.length) {
        const lines = ['Results:'];
        for (const [idx, r] of results.entries()) {
          lines.push(`[${idx + 1}] ${r.title}`);
          lines.push(r.url);
          if (r.snippet) lines.push(`- ${r.snippet}`);
        }
        return lines.join('\n');
      }

      // 2) Fallback: Instant Answer API (often sparse but lightweight)
      const iaUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const iaResp = await fetch(iaUrl, { headers });
      const data = await iaResp.json().catch(() => null);
      if (!iaResp.ok || !data) throw new Error(`DuckDuckGo IA HTTP ${iaResp.status}`);

      const lines = [];
      if (data.AbstractText) {
        lines.push(`Abstract: ${data.AbstractText}`);
        if (data.AbstractURL) lines.push(`Source: ${data.AbstractURL}`);
      }
      return lines.length ? lines.join('\n') : `Keine Treffer für "${query}" gefunden.`;
    } catch (error) {
      console.error('Suche fehlgeschlagen:', error);
      return `Fehler bei der Websuche für "${query}".`;
    }
  });

  // Handler für Live-Suchvorschläge
  ipcMain.handle('get-search-suggestions', async (event, query) => {
    try {
      const headers = { 'User-Agent': 'AetherBrowser/1.0 (Electron)' };
      const resp = await fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`, { headers });
      const data = await resp.json();
      return data[1] || [];
    } catch (e) {
      return [];
    }
  });

  // AI chat completion (server-side in Main Process; key never exposed to renderer)
  ipcMain.handle('ai-chat', async (_event, payload) => {
    const apiKey = getGroqKey();
    if (!apiKey) {
      throw new Error('Missing Groq API key (set it in Settings or via GROQ_API_KEY).');
    }
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid ai-chat payload.');
    }

    const body = {
      model: payload.model,
      messages: payload.messages,
      temperature: payload.temperature,
      top_p: payload.top_p,
    };

    if (payload.max_completion_tokens !== undefined) {
      body.max_completion_tokens = payload.max_completion_tokens;
    } else {
      body.max_tokens = payload.max_tokens ?? 1024;
    }

    // Convert http(s) image URLs to base64 to avoid 403 errors from external servers
    if (Array.isArray(body.messages)) {
      for (const msg of body.messages) {
        if (Array.isArray(msg.content)) {
          for (const item of msg.content) {
            if (item.type === 'image_url' && item.image_url && typeof item.image_url.url === 'string' && item.image_url.url.startsWith('http')) {
              try {
                const imgResp = await fetch(item.image_url.url, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                  }
                });
                if (imgResp.ok) {
                  const buffer = await imgResp.arrayBuffer();
                  const mime = imgResp.headers.get('content-type') || 'image/jpeg';
                  item.image_url.url = `data:${mime};base64,${Buffer.from(buffer).toString('base64')}`;
                }
              } catch (e) {
                console.error('Failed to fetch image for AI:', e);
              }
            }
          }
        }
      }
    }

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = json && json.error && json.error.message ? json.error.message : `HTTP ${resp.status}`;
      throw new Error(`AI request failed: ${msg}`);
    }

    return json;
  });

  // Groq API key management (stored user-local in app data; never returned to renderer)
  ipcMain.handle('groq-key:status', async () => getGroqKeyStatus());
  ipcMain.handle('groq-key:set', async (_event, key) => {
    storeGroqKey(key);
    return getGroqKeyStatus();
  });
  ipcMain.handle('groq-key:clear', async () => {
    clearGroqKey();
    return getGroqKeyStatus();
  });

  // App Metrics / RAM Usage
  ipcMain.handle('get-process-metrics', async () => {
    return app.getAppMetrics();
  });

  // Handler für das native Theme (Scrollbars, Webseiten pre-fers-color-scheme)
  ipcMain.on('set-theme', (event, theme) => {
    nativeTheme.themeSource = theme;
  });

  // Neuer, vereinheitlichter Handler für alle Kontextmenüs
  ipcMain.on('show-context-menu', (event, type, params) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      // Forward the request to the renderer process to display a custom HTML menu
      win.webContents.send('show-custom-context-menu', type, params);
    }
  });
}

app.on('web-contents-created', (event, contents) => {
  contents.on('context-menu', (e, params) => {
    if (win && !win.isDestroyed()) {
      const { screen } = require('electron');
      const cursor = screen.getCursorScreenPoint();
      const winBounds = win.getBounds();
      
      // Berechne die relativen Koordinaten zum Fenster
      let relativeX = cursor.x - winBounds.x;
      let relativeY = cursor.y - winBounds.y;
      
      // Fallback, falls die Werte ausserhalb der direkten Fensterkanten berechnet werden
      if (relativeX < 0) relativeX = params.x || 0;
      if (relativeY < 0) relativeY = params.y || 0;
      
      const enrichedParams = Object.assign({}, params, {
        x: relativeX, y: relativeY, menuX: relativeX, menuY: relativeY
      });
      win.webContents.send('show-custom-context-menu', 'webview', enrichedParams);
    }
  });
});

app.whenReady().then(() => {
  // Standardmäßig System-Theme verwenden, wird später vom Renderer überschrieben
  nativeTheme.themeSource = 'system';
  
  // Erstelle den Splash-Screen
  splash = new BrowserWindow({
    width: 250,
    height: 250,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    icon: getAppIcon(),
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));
  
  // Erstelle das Hauptfenster (wird im Hintergrund geladen)
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
