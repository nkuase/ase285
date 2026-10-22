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
// Receives { sessionId } and emits the session: { sessionId, conversations }
const sessionHistoryHandler = (socket, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    // The session exists: return it.
    socket.emit("session-details", {
      sessionId,
      conversations: sessions[sessionId],
    });
  } else {
    // The session does not exist: create a new session with a new ID
    // and an empty conversations list.
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
// Receives { sessionId, message, conversationId }, asks ChatGPT, and emits the
// updated conversation using the "conversation-details" API.
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

  // Transform [message, aiMessage] into [{ content, role }] for the ChatGPT API.
  // The spread operator (...) inserts each element one by one
  // (without it we would get an array inside an array).
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
    // Chat Completion request: history + the new question.
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

    // Safe extraction using optional chaining (?.): keep the old content if undefined.
    aiMessageContent =
      response?.data?.choices?.[0]?.message?.content || aiMessageContent;
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
  }

  // Make a new AI message from the returned content.
  const aiMessage = {
    content: aiMessageContent,
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

// -------------------------------------------------------- conversation-delete
const conversationDeleteHandler = (_, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    sessions[sessionId] = [];
  }
};

module.exports = { registerSocketServer };
