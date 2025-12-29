// Preload script - runs before the web page loads
// This provides a secure bridge between Electron and your React app

const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// without exposing the entire Electron API
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to React here
  platform: process.platform
});
