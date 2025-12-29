import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionEstablished: false,
  conversations: [],
  selectedConversationId: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedConversationId: (state, action) => {
      state.selectedConversationId = action.payload;
    },
    addMessage: (state, action) => {
      const { message, conversationId } = action.payload;

      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      );

      if (conversation) {
        conversation.messages.push(message);
      } else {
        state.conversations.push({
          id: conversationId,
          messages: [message],
        });
      }
    },
    deleteConversations: (state) => {
      state.conversations = [];
      state.selectedConversationId = null;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.sessionEstablished = true;
    },
    setConversationHistory: (state, action) => {
      const { id, messages } = action.payload;

      const conversation = state.conversations.find((c) => c.id === id);

      if (conversation) {
        conversation.messages = messages;
      } else {
        state.conversations.push({
          id,
          messages,
        });
      }
    },
  },
});

export const {
  setSelectedConversationId,
  addMessage,
  deleteConversations,
  setConversations,
  setConversationHistory,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
