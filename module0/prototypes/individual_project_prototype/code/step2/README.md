# Step 2: Express Server with WebSocket

**Goal**: add a Node.js (Express) server and connect the React client to it with Socket.IO.

## Run

```bash
./run.sh            # server: http://localhost:5000, client: http://localhost:3000
SERVER_PORT=5001 CLIENT_PORT=3001 ./run.sh      # use other ports
```

## What is new

| File | What it does |
|------|--------------|
| `server/index.js` | Express app + HTTP server; registers the socket server |
| `server/src/socketServer.js` | Socket.IO server; logs `user connected <id>` |
| `client/src/socketConnection/socketConn.js` | `connectWithSocketServer()` connects to the server |
| `client/src/App.js` | calls `connectWithSocketServer()` once with `useEffect(..., [])` |

## Key ideas

- Express and WebSocket share one HTTP server.
- `useEffect` with an empty dependency array runs only once, on mount.
- The server port is set with `PORT`; the client must connect to the same port.

## Try it

- Open the browser console (F12): you should see `connected with socket.io server`.
- Look at the server terminal: `user connected ...` appears for every browser tab.
- Open <http://localhost:5000/> in the browser: `Hello server is working`.
