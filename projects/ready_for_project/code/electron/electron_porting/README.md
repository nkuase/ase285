# React to Electron Porting Example

This project demonstrates how to port a React web app to Electron desktop app with **minimal code changes**.

## Key Concept

**Electron = Chromium Browser + Node.js + Your Web App**

We reuse the exact same React code and wrap it in an Electron window!

## Quick Start

### Run in Development Mode
```bash
npm install
npm start          # Builds React and runs in Electron
```

### Create Distributable Binary
```bash
npm install
npm run dist       # Creates installer in release/ folder
```

**Binary location**: `release/SimpleCalculator-1.0.0.dmg` (Mac) or `.exe` (Windows)

📖 **Read [BUILD_VS_BINARY.md](BUILD_VS_BINARY.md) to understand the difference!**

## Project Structure

```
electron_porting/
├── src/
│   ├── App.jsx       ← SAME React component (no changes!)
│   ├── App.css       ← SAME styles (no changes!)
│   └── main.jsx      ← SAME React entry point (no changes!)
├── index.html        ← SAME HTML (no changes!)
├── main.js           ← NEW: Electron main process
├── vite.config.js    ← MODIFIED: base: './' for Electron
└── package.json      ← MODIFIED: Added Electron + scripts
```

## What Changed?

### ✅ **React Code: NO CHANGES**
- `App.jsx` - Identical to react/src/App.jsx
- `App.css` - Identical to react/src/App.css
- `main.jsx` - Identical to react/src/main.jsx
- `index.html` - Identical to react/index.html

### ⚙️ **Only 3 Files Added/Modified**

1. **package.json** - Added Electron dependency
2. **vite.config.js** - Changed base path to './'
3. **main.js** - NEW file (Electron wrapper - 30 lines)

## Commands

```bash
# Development
npm install        # Install dependencies
npm run dev        # Run Vite dev server (browser)
npm start          # Build + Run in Electron

# Production
npm run build      # Build React → creates dist/ folder
npm run pack       # Create unpacked app → release/ folder
npm run dist       # Create binary installer → release/ folder
```

## Understanding Build vs Binary

| Command | Output | What It Creates |
|---------|--------|-----------------|
| `npm run build` | `dist/` | Web files (HTML/JS/CSS) |
| `npm run dist` | `release/` | **Installable binary** ✅ |

See [BUILD_VS_BINARY.md](BUILD_VS_BINARY.md) for detailed explanation.

## Binary Locations

After `npm run dist`, find your binary in `release/`:

- **Mac**: `SimpleCalculator-1.0.0.dmg` or `SimpleCalculator.app`
- **Windows**: `SimpleCalculator Setup 1.0.0.exe`
- **Linux**: `SimpleCalculator-1.0.0.AppImage`

## How It Works

1. Vite builds React → `dist/index.html` + JS/CSS
2. Electron creates window
3. Electron loads `dist/index.html`
4. React app runs in Electron window!

## Why This Approach?

✅ **100% Code Reuse** - All React code copied without changes
✅ **Minimal Effort** - Only 3 files to add/modify
✅ **Easy Maintenance** - One codebase for web and desktop
✅ **Industry Standard** - How VS Code, Discord, Slack do it

## Documentation

- **[README.md](README.md)** - This file
- **[PORTING_GUIDE.md](PORTING_GUIDE.md)** - Step-by-step tutorial
- **[BINARY_GUIDE.md](BINARY_GUIDE.md)** - How to create binaries
- **[BUILD_VS_BINARY.md](BUILD_VS_BINARY.md)** - Build vs Binary explained

## Next Steps

Your React app is now a desktop application! You can add:
- File system access (Node.js APIs)
- System tray
- Native menus
- Auto-updates

But the React code stays the same!
