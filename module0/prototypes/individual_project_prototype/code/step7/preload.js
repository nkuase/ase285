// The preload script runs before the web page loads.
// It exposes only the protected method the renderer needs (not the entire ipcRenderer).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
});
