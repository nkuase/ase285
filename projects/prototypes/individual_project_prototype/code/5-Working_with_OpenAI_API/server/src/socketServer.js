const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");
const openai = require("./ai");

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

const sessionHistoryHandler = (socket, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    // send existing session data back to user

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

const conversationMessageHandler = async (socket, data) => {
  const { sessionId, message, conversationId } = data;

  const previousConversationMessages = [];

  if (!sessions[sessionId]) return;

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

  let aiMessageContent = "Error occurred when trying to get message from the AI";

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        ...previousConversationMessages,
        { role: "user", content: message.content },
      ],
    });
    aiMessageContent = response?.data?.choices?.[0]?.message?.content || aiMessageContent;
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

  const updatedConversation = sessions[sessionId].find((c) => c.id === conversationId);
  socket.emit("conversation-details", updatedConversation);
};

const conversationDeleteHandler = (_, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    sessions[sessionId] = [];
  }
};

module.exports = { registerSocketServer };
