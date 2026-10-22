const { Server } = require("socket.io");

const registerSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Simple API 1: Echo message back to sender
    socket.on("echo", (message) => {
      console.log(`Echo from ${socket.id}: ${message}`);
      socket.emit("echo-response", message);
    });

    // Simple API 2: Broadcast message to all clients
    socket.on("broadcast", (message) => {
      console.log(`Broadcast from ${socket.id}: ${message}`);
      io.emit("broadcast-message", {
        from: socket.id,
        message: message,
      });
    });

    // Simple API 3: Send message to specific room
    socket.on("join-room", (roomName) => {
      socket.join(roomName);
      console.log(`${socket.id} joined room: ${roomName}`);
      socket.emit("room-joined", roomName);
    });

    socket.on("room-message", (data) => {
      console.log(`Room message from ${socket.id} to ${data.room}: ${data.message}`);
      io.to(data.room).emit("room-message-received", {
        from: socket.id,
        message: data.message,
      });
    });

    // Simple API 4: Get current time from server
    socket.on("get-time", () => {
      socket.emit("current-time", new Date().toISOString());
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { registerSocketServer };
