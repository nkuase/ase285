# Step 4: Sending Messages from Server

**Goal**: the server answers each message with an AI message (a mock "Hello here is AI" for now).

## Run

```bash
./run.sh            # server: http://localhost:5000, client: http://localhost:3000
```

## WebSocket API in this step

```txt
client --- conversation-message { sessionId, message, conversationId } ---> server
client <-- conversation-details { id, messages: [message, aiMessage] } ---  server
client --- conversation-delete { sessionId } ---> server
```

## What is new

| File | What it does |
|------|--------------|
| `server/src/socketServer.js` | `conversationMessageHandler` makes the `aiMessage`, stores the conversation, emits `conversation-details`; `conversationDeleteHandler` empties the session |
| `client/src/Dashboard/dashboardSlice.js` | new reducers `setConversationHistory`, `deleteConversations` |
| `client/src/socketConnection/socketConn.js` | handles `conversation-details`; `deleteConversations()` |
| `client/src/Dashboard/Sidebar/DeleteConversationsButton.js` | removes the conversations on the client and on the server |

## Key ideas

- The client shows the user's message immediately (`addMessage`), then replaces the messages with the server's version (`setConversationHistory`).
- A reducer is renamed on import (`deleteConversations as deleteConversationsFromStore`) to avoid a name conflict with the socket function.

## Try it

- Send a message: the answer `Hello here is AI` appears with the typing effect.
- Reload the page: the conversations come back from the server (same `sessionId`).
- Click **Delete conversations**, then reload: the list is empty.
