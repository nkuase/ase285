import { io } from "socket.io-client";
import { store } from "../store";
import {
  setConversations,
  setConversationHistory,
} from "../Dashboard/dashboardSlice";

let socket;

// Change the port if necessary (the run.sh passes REACT_APP_SERVER_URL).
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export const connectWithSocketServer = () => {
  socket = io(SERVER_URL);

  socket.on("connect", () => {
    console.log("connected with socket.io server");
    console.log(socket.id);

    // Ask the server for the session (the sessionId is kept in localStorage).
    socket.emit("session-history", {
      sessionId: localStorage.getItem("sessionId"),
    });
  });

  // The server returns the session: store the sessionId and the conversations.
  socket.on("session-details", (data) => {
    const { sessionId, conversations } = data;

    localStorage.setItem("sessionId", sessionId);
    store.dispatch(setConversations(conversations));
  });

  // The server returns the updated conversation (message + aiMessage).
  socket.on("conversation-details", (conversation) => {
    store.dispatch(setConversationHistory(conversation));
  });
};

// The current sessionId is read from localStorage.
export const sendConversationMessage = (message, conversationId) => {
  socket.emit("conversation-message", {
    sessionId: localStorage.getItem("sessionId"),
    message,
    conversationId,
  });
};

export const deleteConversations = () => {
  socket.emit("conversation-delete", {
    sessionId: localStorage.getItem("sessionId"),
  });
};
