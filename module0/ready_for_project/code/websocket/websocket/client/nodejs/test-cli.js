// Demonstrates connect/disconnect + emit/listen usage
const io = require('socket.io-client');

// Connect to server
const socket = io('http://localhost:5000');

// Connection events
socket.on("connect", () => {
  console.log("✓ Connected to server");
  console.log(`✓ Socket ID: ${socket.id}\n`); 
  
  // Emit various test events
  socket.emit("echo", "Hello, server!");
  socket.emit("broadcast", "Hi everyone!");  
  socket.emit("join-room", "test-room");
  socket.emit("room-message", { room: "test-room", message: "Hello room!" });
  socket.emit("get-time");
  
  console.log("✓ All test events emitted\n");
});

socket.on("disconnect", () => {
  console.log("✗ Disconnected from server");
});

// Listen for server responses
socket.on("echo-response", (message) => {
  console.log(`[Echo Response] ${message}`);
});

socket.on("broadcast-message", (data) => {
  console.log(`[Broadcast] From ${data.from}: ${data.message}`);
});

socket.on("room-joined", (roomName) => {
  console.log(`[Room] Joined: ${roomName}`);  
});

socket.on("room-message-received", (data) => {
  console.log(`[Room Message] From ${data.from}: ${data.message}`);
});

socket.on("current-time", (time) => {
  console.log(`[Server Time] ${time}\n`);  
});

// Disconnect after 3 seconds to allow responses to arrive
setTimeout(() => {
  console.log("Disconnecting...");
  socket.disconnect();
  process.exit(0);
}, 3000);
