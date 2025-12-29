const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Save calculation history to a file
  saveHistory: (history) => ipcRenderer.send('save-history', history),
  
  // Load calculation history from file
  loadHistory: () => ipcRenderer.invoke('load-history'),
  
  // Get app version
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Clear history
  clearHistory: () => ipcRenderer.send('clear-history')
});
