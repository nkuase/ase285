const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const socketServer = require("./src/socketServer");

const openai = require("./src/ai");

const app = express();

const server = http.createServer(app);
socketServer.registerSocketServer(server);

// Enable CORS for development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// ===================================
// STEP 1: Serve Static React Build Files
// ===================================
// Define the path to the React build directory
const buildPath = path.join(__dirname, '../../../5-Working_with_OpenAI_API/client/build');

// Serve all static files (CSS, JS, images, etc.) from the build directory
// Express will automatically serve files from this directory when requested
app.use(express.static(buildPath));

// ===================================
// STEP 2: API Routes (Add your API endpoints here)
// ===================================
// Example: API endpoint for testing
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is working", message: "Hello from API" });
});

// Add more API routes here as needed
// app.get("/api/...", ...)
// app.post("/api/...", ...)

// ===================================
// STEP 3: Handle React Router (SPA Routing)
// ===================================
// This MUST be the last route
// For any route that doesn't match API routes or static files,
// serve the React app's index.html
// This allows React Router to handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ===================================
// STEP 4: Start the Server
// ===================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  console.log(`Serving React app from: ${buildPath}`);
});
