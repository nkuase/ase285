import { io } from "socket.io-client";
import { store } from "../store";
import {
  setConversations,
  setConversationHistory,
} from "../Dashboard/dashboardSlice";

let socket;

// Vite exposes env variables through import.meta.env (the run.sh sets VITE_SERVER_URL).
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const connectWithSocketServer = () => {
  socket = io(SERVER_URL);

  socket.on("connect", () => {
    console.log("connected with socket.io server");
    console.log(socket.id);

    socket.emit("session-history", {
      sessionId: localStorage.getItem("sessionId"),
    });
  });

  socket.on("session-details", (data) => {
    const { sessionId, conversations } = data;

    localStorage.setItem("sessionId", sessionId);
    store.dispatch(setConversations(conversations));
  });

  socket.on("conversation-details", (conversation) => {
    store.dispatch(setConversationHistory(conversation));
  });
};

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
