const { ipcRenderer, contextBridge } = require('electron');

// Expose a limited API to the webview's renderer process
contextBridge.exposeInMainWorld('webviewAPI', {
  // Send context menu data to the main process
  sendContextMenuData: (data) => ipcRenderer.sendToHost('webview-context-menu', data)
});

document.addEventListener('contextmenu', (event) => {
  // Do not prevent default here, let the main process decide

  const target = event.target;
  const anchor = target.closest ? target.closest('a') : null;
  
  let data = {
    type: 'webview',
    pageURL: window.location.href,
    selectionText: window.getSelection().toString(),
    linkURL: anchor ? anchor.href : null,
    srcURL: target.src || null,
    isEditable: target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA',
    elementText: target.innerText || null,
    elementTagName: target.tagName || null,
    elementId: target.id || null,
    elementClasses: target.className || null,
    x: event.clientX,
    y: event.clientY
  };

  // If it's an image, get its source
  if (target.tagName === 'IMG') {
    data.type = 'image';
    data.content = target.src;
  } else if (data.selectionText) {
    data.type = 'text-selection';
    data.content = data.selectionText;
  } else if (target.tagName === 'P' || target.tagName === 'DIV' || target.tagName === 'SPAN' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3') {
    const textContent = target.innerText.trim();
    if (textContent.length > 0) {
      data.type = 'element-text';
      data.content = textContent.substring(0, 500); // Limit content to avoid huge payloads
    }
  }

  ipcRenderer.sendToHost('webview-context-menu', data);
});