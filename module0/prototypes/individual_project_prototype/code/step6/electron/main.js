const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Development or production?
  // 1. Check if the ELECTRON_IS_DEV environment variable is set
  // 2. Otherwise, check if the build folder exists
  const isDev =
    process.env.ELECTRON_IS_DEV === '1' ||
    !fs.existsSync(path.join(__dirname, 'build', 'index.html'));

  if (isDev) {
    // Development: load from the Vite dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from the build folder
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  // Debug: log which mode we are in
  console.log('Running in', isDev ? 'DEVELOPMENT' : 'PRODUCTION', 'mode');
}

// Create the window when ready
app.whenReady().then(createWindow);

// Recreate the window on macOS when the dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
