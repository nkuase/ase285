const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config(); // Load .env at startup

function createWindow() {
  // Create browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load app
  const isDev = !app.isPackaged;
  
  if (isDev) {
    // Development: load from React dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from build folder
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
}

// Create window when ready
app.whenReady().then(createWindow);

// Handle API key request from renderer
ipcMain.handle('get-api-key', () => {
  return process.env.OPENAI_API_KEY || null;
});

// Recreate window on macOS when clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Quit when all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
