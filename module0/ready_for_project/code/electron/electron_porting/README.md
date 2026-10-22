# React to Electron Porting Example

This project shows how to port a React web app to an Electron desktop app with **minimal code changes**.

## Key Concept

**Electron = Chromium Browser + Node.js + Your Web App**

We reuse the same React code and wrap it in an Electron window.

## Quick Start

### Run in Electron

```bash
npm install
npm start          # builds React (dist/) and opens it in Electron
```

### Create a Distributable Binary

```bash
npm run dist       # creates the installer in release/ (or run ./build.sh)
```

## Project Structure

```txt
electron_porting/
├── src/
│   ├── App.jsx       ← SAME React component as ../react (no changes)
│   ├── App.css       ← SAME styles (no changes)
│   └── main.jsx      ← SAME React entry point (no changes)
├── index.html        ← SAME HTML (no changes)
├── main.js           ← NEW: Electron main process
├── vite.config.js    ← MODIFIED: base: './' for Electron
├── package.json      ← MODIFIED: added Electron and the scripts
└── build.sh          ← builds the binary
```

## What Changed?

The React code (`App.jsx`, `App.css`, `main.jsx`, `index.html`) is identical to `../react`.

Only three files are added or modified:

1. `package.json`: added the Electron dependencies and scripts.
2. `vite.config.js`: changed the base path to `./`, so the built files load from the file system.
3. `main.js`: NEW (the Electron wrapper).

## Commands

```bash
# Development
npm install        # install dependencies
npm run dev        # run the Vite dev server (in a browser)
npm start          # build + run in Electron

# Production
npm run build      # build React -> dist/
npm run pack       # create an unpacked app -> release/
npm run dist       # create the installer -> release/
```

| Command | Output | What it creates |
|---------|--------|-----------------|
| `npm run build` | `dist/` | Web files (HTML/JS/CSS) |
| `npm run dist` | `release/` | Installable binary |

## Binary Locations

After `npm run dist`, find the binary in `release/`:

- **Mac**: `SimpleCalculator-1.0.0.dmg` or `SimpleCalculator.app`
- **Windows**: `SimpleCalculator Setup 1.0.0.exe`
- **Linux**: `SimpleCalculator-1.0.0.AppImage`

## How It Works

1. Vite builds React into `dist/index.html` plus JS/CSS.
2. Electron creates a window.
3. Electron loads `dist/index.html`.
4. The React app runs in the Electron window.

## Next Steps

You can add desktop features such as file system access, a system tray, native menus, and auto-updates. See `../electron_porting_preload` for the safe way to access the file system.
