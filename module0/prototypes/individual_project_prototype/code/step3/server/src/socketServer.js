const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");

// sessions[sessionId] = [conversation, ...]
// conversation = { id: UID, messages: [message, aiMessage] }
let sessions = {};

const registerSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on("session-history", (data) => {
      sessionHistoryHandler(socket, data);
    });

    socket.on("conversation-message", (data) => {
      conversationMessageHandler(socket, data);
    });
  });
};

// 1. session-history: return the conversations of the sessionId
const sessionHistoryHandler = (socket, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    socket.emit("session-details", {
      sessionId,
      conversations: sessions[sessionId],
    });
  } else {
    // Unknown (or missing) sessionId: create a new session
    const newSessionId = uuid();

    sessions[newSessionId] = [];

    const sessionDetails = {
      sessionId: newSessionId,
      conversations: [],
    };

    socket.emit("session-details", sessionDetails);
  }
};

// 2. conversation-message: in this step, we only display the data
const conversationMessageHandler = (socket, data) => {
  console.log("message came from client side");
  console.log(data);
};

module.exports = { registerSocketServer };
