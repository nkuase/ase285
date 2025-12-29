# Simple React with esbuild

This project demonstrates the simplest way to bundle a React application using esbuild.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Open `src/index.html` in your browser
   - Or use a local server: `npm run serve`

That's it! 🎉

## How it works

- **Single Command**: Just `npm run build` creates everything
- **No External Files**: React and ReactDOM are bundled into `app.js`
- **Simple HTML**: Just open `src/index.html` in any browser

## The Build Command

```bash
esbuild src/App.tsx --bundle --outfile=app.js --format=iife --global-name=AppModule
```

This command:
- `--bundle`: Includes all dependencies (React, ReactDOM)
- `--outfile=app.js`: Output file name
- `--format=iife`: Wraps code in a function to avoid global scope pollution
- `--global-name=AppModule`: Makes the app accessible as `window.AppModule`

## File Structure

```
├── src/
│   ├── App.tsx      # Your React app
│   └── index.html   # HTML that loads app.js
├── package.json     # Dependencies and npm scripts
└── app.js          # Generated bundle (created by build)
```

## For Students

This is the simplest possible React + esbuild setup:
- No webpack config
- No complex build scripts
- Just one npm command
- Everything in one bundle file
