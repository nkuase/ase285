import { createSlice } from "@reduxjs/toolkit";

// conversation = { id: UID, messages: [message, aiMessage] }
const initialState = {
  sessionEstablished: false,
  conversations: [],
  selectedConversationId: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Set the selected conversation ("new" means a new conversation).
    setSelectedConversationId: (state, action) => {
      state.selectedConversationId = action.payload;
    },

    // Set the conversations from the server; the communication is now established.
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.sessionEstablished = true;
    },

    // Add a message to the conversation (create the conversation if it does not exist).
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

    // NEW: replace the messages of the conversation with the ones from the server
    // (this adds the AI message). Create the conversation if it is not found.
    setConversationHistory: (state, action) => {
      const { id, messages } = action.payload;

      const conversation = state.conversations.find((c) => c.id === id);

      if (conversation) {
        conversation.messages = messages;
      } else {
        state.conversations.push({ id, messages });
      }
    },

    // NEW: remove all conversations and unselect the conversation.
    deleteConversations: (state) => {
      state.conversations = [];
      state.selectedConversationId = null;
    },
  },
});

export const {
  setSelectedConversationId,
  setConversations,
  addMessage,
  setConversationHistory,
  deleteConversations,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
