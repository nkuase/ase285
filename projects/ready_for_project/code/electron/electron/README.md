# Simple Electron Calculator

A desktop calculator app built with Electron.

## Features
- Two number inputs
- Four operations: Add, Subtract, Multiply, Divide
- Desktop application

## Installation

```bash
npm install
```

## Run

```bash
npm start
```

## How It Works

1. **Main Process** (`main.js`): Creates the application window
2. **Renderer Process** (`renderer.js`): Handles calculator logic
3. **DOM Manipulation**: Uses vanilla JavaScript to update UI

## File Structure

```
electron/
├── main.js          # Main process (creates window)
├── renderer.js      # Renderer process (calculator logic)
├── index.html       # UI structure
├── styles.css       # Styling
└── package.json     # Dependencies
```

## Key Differences from React

- **No Virtual DOM**: Direct DOM manipulation
- **Event Listeners**: Manual event binding
- **Native Desktop**: Runs as a desktop application
