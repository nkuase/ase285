const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");
const openai = require("./ai");

// sessions[sessionId] = [conversation, ...]
// conversation = { id: UID, messages: [message, aiMessage] }
// message      = { id: UID, content: string, aiMessage: false }
// aiMessage    = { id: UID, content: string, aiMessage: true }
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

// ------------------------------------------------------------ session-history
const sessionHistoryHandler = (socket, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    socket.emit("session-details", {
      sessionId,
      conversations: sessions[sessionId],
    });
  } else {
    const newSessionId = uuid();

    sessions[newSessionId] = [];

    const sessionDetails = {
      sessionId: newSessionId,
      conversations: [],
    };

    socket.emit("session-details", sessionDetails);
  }
};

// ------------------------------------------------------- conversation-message
const conversationMessageHandler = async (socket, data) => {
  const { sessionId, message, conversationId } = data;

  // The server may have been restarted: the old sessionId is unknown, so start it again.
  // (Without this, the client would wait forever for an answer that never comes.)
  if (!sessions[sessionId]) sessions[sessionId] = [];

  // Previous messages of this conversation (the history for ChatGPT).
  const previousConversationMessages = [];

  const existingConversation = sessions[sessionId].find(
    (c) => c.id === conversationId
  );

  if (existingConversation) {
    previousConversationMessages.push(
      ...existingConversation.messages.map((m) => ({
        content: m.content,
        role: m.aiMessage ? "assistant" : "user",
      }))
    );
  }

  // Used when ChatGPT does not return an answer.
  let aiMessageContent = "Sorry, I could not get an answer from ChatGPT.";

  try {
    const response = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          ...previousConversationMessages,
          { role: "user", content: message.content },
        ],
      },
      // Give up after 30 seconds, so the client never waits forever.
      { timeout: 30000 }
    );

    aiMessageContent =
      response?.data?.choices?.[0]?.message?.content || aiMessageContent;
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
  }

  const aiMessage = {
    content: aiMessageContent,
    id: uuid(),
    aiMessage: true,
  };

  const conversation = sessions[sessionId].find((c) => c.id === conversationId);

  if (!conversation) {
    sessions[sessionId].push({
      id: conversationId,
      messages: [message, aiMessage],
    });
  } else {
    conversation.messages.push(message, aiMessage);
  }

  const updatedConversation = sessions[sessionId].find(
    (c) => c.id === conversationId
  );

  socket.emit("conversation-details", updatedConversation);
};

// -------------------------------------------------------- conversation-delete
const conversationDeleteHandler = (_, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    sessions[sessionId] = [];
  }
};

module.exports = { registerSocketServer };
