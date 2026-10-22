# Step 6: Deployment (Web Application & Electron)

**Goal**: deploy the ChatGPT clone as (1) a web application and (2) an Electron desktop app.

## Run

```bash
./run.sh                 # web application: http://localhost:5000
./run.sh electron        # Electron, development mode
./run.sh electron-prod   # Electron, production mode
./run.sh dist            # package the Electron app (electron-builder)
```

The OpenAI API key is read from `server/.env` (created from `.env.example` by `run.sh`).

## 1. Web application

```txt
Development                          Production
Browser -> React dev server (3000)   Browser -> Express server (5000)
        -> Express server (5000)             serves the React build + the API
```

`./run.sh` compiles the step5 client (`npm run build`), then `server/index.js` does three things:

1. serve the static build files (`express.static`)
2. API routes (`/api/health`)
3. for any other URL, send `index.html` (this route must be the last one)

## 2. Electron

```txt
Electron main.js -> Chromium window -> React app (unchanged) -> Express server (5000) -> ChatGPT
```

| File | What it does |
|------|--------------|
| `electron/main.js` | creates the window: dev mode loads `http://localhost:3000`, production loads `build/index.html` |
| `electron/preload.js` | secure bridge between Electron and the React app |
| `electron/vite.config.js` | Vite settings (`base: './'` = relative paths, required by Electron) |

React components that contain JSX use the `.jsx` extension (a Vite rule); Create React App is replaced by Vite.

## Try it

- Start the Electron window first and the server later: the loading spinner stays until the server is reachable.
- Run `./run.sh electron-prod` and compare it with `./run.sh electron` (the log says `DEVELOPMENT` or `PRODUCTION`).
