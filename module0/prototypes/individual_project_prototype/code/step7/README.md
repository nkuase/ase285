# Step 7: Standalone ChatGPT Clone

**Goal**: remove the Express server. The Electron app talks to the OpenAI API directly.

```txt
Before:  Electron (React) <-- Socket.IO --> Express server <-- HTTP --> OpenAI
After:   Electron (React) <------------ HTTP ------------------------> OpenAI
```

## Run

```bash
./run.sh            # Electron, development mode
./run.sh prod       # Electron, production build
./run.sh dist       # package the app
./run.sh browser    # Vite dev server only (needs VITE_OPENAI_API_KEY, see .env.example)
```

The OpenAI API key is read from `.env` (created from `.env.example` by `run.sh`):

```txt
OPENAI_API_KEY=your_openai_api_key
```

## What changed

| Removed | Added |
|---------|-------|
| Express server (`server/`) | `src/services/openaiService.js` (calls OpenAI from the client) |
| Socket.IO client and `socketConnection/` | `createAsyncThunk` in `dashboardSlice.js` |
| server-side `sessions` | conversations saved in `localStorage` |
| `sessionId`, `LoadingSpinner` | `loading` and `error` state fields |

## The API key stays in the main process

```txt
.env --(dotenv)--> main.js --(ipcMain 'get-api-key')--> preload.js --> openaiService.js
```

The renderer asks for the key through the preload bridge; the key is never written in the client code.

## Key ideas

- `createAsyncThunk` has three outcomes: `pending` (set `loading`), `fulfilled` (add the AI message and save), `rejected` (show an error message).
- `localStorage` replaces the server memory: conversations survive an app restart.
- While `loading` is true the input is disabled, so only one question is in flight.

## Try it

- Send a question, close the app, open it again: the conversation is still there.
- Remove the key from `.env`: the app shows `Sorry, I couldn't process your message. Please try again.`
