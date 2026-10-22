# Step 3: Sessions

**Goal**: keep the conversations in a Redux store, and identify the user with a session ID.

## Run

```bash
./run.sh            # server: http://localhost:5000, client: http://localhost:3000
```

## Data structures

```txt
sessions[sessionId] = [conversation, ...]            (server)
conversation = { id, messages: [message, aiMessage] }
message      = { id, content, aiMessage: false }
```

## WebSocket API in this step

```txt
client --- session-history { sessionId } --->  server
client <-- session-details { sessionId, conversations } ---  server
client --- conversation-message { sessionId, message, conversationId } ---> server (only logs it)
```

## What is new

| File | What it does |
|------|--------------|
| `client/src/store.js` | Redux store |
| `client/src/Dashboard/dashboardSlice.js` | state fields + reducers (`setSelectedConversationId`, `setConversations`, `addMessage`) |
| `client/src/Dashboard/LoadingSpinner.js` | shown until the session is established |
| `server/src/socketServer.js` | `session-history` handler: returns the session or creates a new one |

## Key ideas

- Redux slice: `useSelector` reads a state field, `dispatch(action)` changes it.
- `localStorage` keeps the `sessionId` between page reloads.
- `selectedConversationId === "new"` means "start a new conversation".

## Try it

- F12 > Application > Local Storage: find `sessionId`.
- Restart the server and reload the page: you get a new `sessionId` (sessions live in server memory).
- Click **New Chat**, type a message: it appears in the sidebar and the server prints it.
