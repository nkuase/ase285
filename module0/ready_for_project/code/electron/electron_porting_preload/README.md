# React to Electron Porting with a Preload Script

This project extends `../electron_porting`: the React calculator now keeps a **calculation history** in a file, using a **preload script** and **IPC** (inter-process communication).

## Why a Preload Script?

For security, the renderer (React) stays unprivileged:

```js
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: true,
  preload: path.join(__dirname, 'preload.js')
}
```

- `preload.js` exposes a small API (`window.electronAPI`) to the React app.
- The main process (`main.js`) does the file access and validates the data.

```txt
React (renderer) -> preload.js -> ipcRenderer -> ipcMain -> main process (fs)
```

## Files

```txt
electron_porting_preload/
├── main.js        # main process: window + IPC handlers (save/load/clear history, get version)
├── preload.js     # bridge: exposes window.electronAPI
├── src/App.jsx    # React calculator that uses window.electronAPI
├── vite.config.js # base: './' for Electron
├── run.sh         # build the React app and run it in Electron
└── build.sh       # create the installer in release/
```

## Run

```bash
npm install
npm start          # or ./run.sh
```

In a normal browser (`npm run dev`), `window.electronAPI` does not exist, so the history features are hidden and the calculator works as a web app.

## Build a Binary

```bash
npm run dist       # or ./build.sh; the installer is created in release/
```

The history is saved as `calc-history.json` in the `userData` directory of the app (on macOS: `~/Library/Application Support/electron-react-calculator/`).
