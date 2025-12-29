const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  getApiKey: () => ipcRenderer.invoke('get-api-key')
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('ChatGPT Electron app loaded (serverless version)');
});
