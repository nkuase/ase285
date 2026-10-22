// The preload script runs before the web page loads.
// It provides a secure bridge between Electron and the React app: expose only the
// protected methods the renderer needs, not the entire Electron API.
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
