const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Path to store calculation history
const historyPath = path.join(app.getPath('userData'), 'calc-history.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the built React app from dist folder
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  
  // Optional: Open DevTools for debugging
  // win.webContents.openDevTools()
}

// IPC Handlers
ipcMain.on('save-history', async (event, history) => {
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving history:', error);
  }
});

ipcMain.handle('load-history', async () => {
  try {
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
});

ipcMain.handle('get-version', () => {
  return app.getVersion();
});

ipcMain.on('clear-history', async () => {
  try {
    if (fs.existsSync(historyPath)) {
      fs.unlinkSync(historyPath);
    }
  } catch (error) {
    console.error('Error clearing history:', error);
  }
});

app.whenReady().then(() => {
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
