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
    // 1. Set the selected conversation ("new" means a new conversation).
    setSelectedConversationId: (state, action) => {
      state.selectedConversationId = action.payload;
    },

    // 2. Set the conversations from the server; the communication is now established.
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.sessionEstablished = true;
    },

    // 3. Add a message to the conversation (create the conversation if it does not exist).
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
  },
});

export const { setSelectedConversationId, setConversations, addMessage } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
