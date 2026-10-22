# Individual Project Prototype - ChatGPT Clone

A ChatGPT clone built step by step with React and Node.js (Express). Each `stepN` directory
is a complete, runnable project with its own `run.sh`.

| Step | Topic | Contents |
|------|-------|----------|
| step1 | Frontend UI React | `client/` only (static UI, mock data) |
| step2 | Express Server with WebSocket | `client/` + `server/` (Socket.IO connection) |
| step3 | Sessions | Redux slice states, `session-history` / `session-details` APIs |
| step4 | Sending Messages from Server | server answers with a mock AI message (`conversation-details`) |
| step5 | Working with OpenAI | server calls the ChatGPT API (`server/.env` needs `OPENAI_API_KEY`) |
| step6 | Deployment | `server/` serves the React build (web), `electron/` = Vite + Electron app |
| step7 | Standalone ChatGPT Clone | Electron + React calling OpenAI directly (no Express server) |

## Run a step

```bash
chmod +x step*/run.sh       # only needed once

./step1/run.sh
./step2/run.sh              # starts the server (5000) and the client (3000)
./step3/run.sh
./step4/run.sh
./step5/run.sh              # needs OPENAI_API_KEY in step5/server/.env
```

- The first run executes `npm install` automatically.
- Steps 2-5 start the server in the background and the client in the foreground (Ctrl+C stops both).
- `SERVER_PORT=5001 CLIENT_PORT=3001 ./step3/run.sh` changes the ports.
- Steps 5-7 create `.env` from `.env.example` when it is missing; edit it and set `OPENAI_API_KEY`.
- All steps use the same ports, so run one step at a time.

### step6 (deployment)

```bash
./step6/run.sh                 # web: build ../step5/client, then serve it with Express (http://localhost:5000)
./step6/run.sh electron        # Electron, development (server + Vite + Electron window)
./step6/run.sh electron-prod   # Electron, production (vite build + Electron window)
./step6/run.sh dist            # package the Electron app with electron-builder
```

### step7 (standalone)

```bash
./step7/run.sh                 # Electron, development
./step7/run.sh prod            # Electron, production build
./step7/run.sh dist            # package the app
./step7/run.sh browser         # Vite dev server only (needs VITE_OPENAI_API_KEY, see .env.example)
```

## Differences from the original code

This code follows the original (same components, same data flow, same CSS layout), with changes
for teaching and a few bug fixes.

| Area | Change |
|------|--------|
| Layout | The original `dashboard.css` (fixed sizes, `@media` rules, `overlay`/`spinner`) is restored, with explanatory comments |
| `Message.js` | `SlowText` is simplified to one `useState` counter (the original re-created timers on every character) |
| Korean/Japanese input | Enter while an input method is composing no longer sends the message twice (`event.nativeEvent.isComposing`) |
| Server restart | An unknown `sessionId` is recreated instead of being ignored (the original left the input disabled forever) |
| OpenAI | 30-second timeout, so the UI never waits forever |
| `socketConn.js` | Socket handlers are registered once, not inside the `connect` callback (no duplicates after a reconnect) |
| step3 | `sendConversationMessage` sends the `sessionId` |
| step6 | `electron-builder` packages `build/` (the original pointed to `dist/`); one shared `server/`; friendly message if the React build is missing |
| step7 | `main.js` uses the same dev/production check as step 6 (the original `!app.isPackaged` made `electron-prod` open the dev URL); conversations are loaded in the initial state instead of a reducer with side effects |
| Environment | `.env.example` + automatic `.env` creation (the original file was named `env`); API key is not inlined into the bundle |
| Project | One folder and one `run.sh` per step, a `README.md` per step, no testing-library / `web-vitals` / unused dependencies |

Not included: binary files such as `favicon.ico` and `logo192.png` (Create React App works without them).

## Data structures

```txt
sessions = { sessionId: UID, conversations: [conversation] }
conversation = { id: UID, messages: [message, aiMessage] }
message   = { id: UID, content: string, aiMessage: false }
aiMessage = { id: UID, content: string, aiMessage: true }
```

WebSocket APIs (steps 2-6): `session-history`, `session-details`, `conversation-message`,
`conversation-details`, `conversation-delete`.
