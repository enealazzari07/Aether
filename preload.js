const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Useful for pointing webview preload attributes to an absolute path.
  getAppDir: () => __dirname,
  minimizeWindow: () => ipcRenderer.send('minimize-app'),
  maximizeWindow: () => ipcRenderer.send('maximize-app'),
  closeWindow: () => ipcRenderer.send('close-app'),
  showContextMenu: (type, params) => ipcRenderer.send('show-context-menu', type, params),
  onContextMenuAction: (callback) => ipcRenderer.on('context-menu-action', (event, ...args) => callback(...args)),
  onShowCustomContextMenu: (callback) => ipcRenderer.on('show-custom-context-menu', (_event, ...args) => callback(...args)),
  searchFiles: (payload) => ipcRenderer.invoke('search-local-files', payload),
  openFile: (path) => ipcRenderer.send('open-file', path),
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  performSearch: (query) => ipcRenderer.invoke('perform-search', query),
  aiChat: (payload) => ipcRenderer.invoke('ai-chat', payload),
  setTheme: (theme) => ipcRenderer.send('set-theme', theme),
  groqKeyStatus: () => ipcRenderer.invoke('groq-key:status'),
  setGroqKey: (key) => ipcRenderer.invoke('groq-key:set', key),
  clearGroqKey: () => ipcRenderer.invoke('groq-key:clear'),
  appVersion: () => ipcRenderer.invoke('app:version'),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onUpdateStatus: (callback) => ipcRenderer.on('update:status', (_event, payload) => callback(payload)),
  destroyWebContents: (webContentsId) => ipcRenderer.invoke('destroy-webcontents', webContentsId),
  loadChromeExtension: (dir) => ipcRenderer.invoke('load-chrome-extension', dir),
  clearBrowserData: () => ipcRenderer.invoke('clear-browser-data'),
});
