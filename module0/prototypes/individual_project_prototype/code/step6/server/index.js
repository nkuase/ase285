const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const socketServer = require("./src/socketServer");

const app = express();

// WebSocket and Express share one HTTP server.
const server = http.createServer(app);
socketServer.registerSocketServer(server);

app.use(cors());

// ------------------------------------------------------------------------
// STEP 1: Serve the static React build files
// ------------------------------------------------------------------------
// 1. Serve all static files (CSS, JS, images, etc.) from the build directory.
// 2. Express automatically serves files from this directory when requested.
// (The build is created with "npm run build" in the step5 client directory.)
const buildPath =
  process.env.BUILD_PATH || path.join(__dirname, "../../step5/client/build");

// Friendly message when the React app has not been compiled yet.
if (!fs.existsSync(path.join(buildPath, "index.html"))) {
  console.warn(`React build not found: ${buildPath}`);
  console.warn('Run "npm run build" in the step5 client directory first (or use ./run.sh).');
}

app.use(express.static(buildPath));

// ------------------------------------------------------------------------
// STEP 2: API routes
// ------------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is working", message: "Hello from API" });
});

// Add more API routes here as needed
// app.get("/api/...", ...)
// app.post("/api/...", ...)

// ------------------------------------------------------------------------
// STEP 3: Handle React Router (SPA routing)
// ------------------------------------------------------------------------
// This MUST be the last route: for any route that does not match the API routes
// or the static files, serve the React app's index.html.
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  console.log(`Serving React app from: ${buildPath}`);
});
