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

    socket.on("conversation-delete", (data) => {
      conversationDeleteHandler(socket, data);
    });
  });
};

// session-history: return the conversations of the sessionId
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

// conversation-message: get the message, make the (mock) aiMessage,
// and return the updated conversation to the client.
const conversationMessageHandler = (socket, data) => {
  const { sessionId, message, conversationId } = data;

  // The server may have been restarted: the old sessionId is unknown, so start it again.
  // (Without this, the client would wait forever for an answer that never comes.)
  if (!sessions[sessionId]) sessions[sessionId] = [];

  // For now, we don't use the ChatGPT API: we mimic the ChatGPT output.
  const aiMessage = {
    content: "Hello here is AI",
    id: uuid(),
    aiMessage: true,
  };

  const conversation = sessions[sessionId].find((c) => c.id === conversationId);

  if (!conversation) {
    // New conversation
    sessions[sessionId].push({
      id: conversationId,
      messages: [message, aiMessage],
    });
  } else {
    // Existing conversation: append the message and the AI message.
    conversation.messages.push(message, aiMessage);
  }

  const updatedConversation = sessions[sessionId].find(
    (c) => c.id === conversationId
  );

  socket.emit("conversation-details", updatedConversation);
};

// conversation-delete: delete the conversations attached to the sessionId
const conversationDeleteHandler = (_, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    sessions[sessionId] = [];
  }
};

module.exports = { registerSocketServer };
