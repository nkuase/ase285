import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { sendMessageToAI } from "../services/openaiService";

// Async thunk to send message and get AI response
export const sendConversationMessage = createAsyncThunk(
  'dashboard/sendMessage',
  async ({ message, conversationId, conversationMessages }) => {
    // Build message history for OpenAI
    const messages = conversationMessages.map(m => ({
      role: m.aiMessage ? 'assistant' : 'user',
      content: m.content
    }));
    
    // Add new user message
    messages.push({ role: 'user', content: message.content });
    
    // Get AI response
    const aiContent = await sendMessageToAI(messages);
    
    const aiMessage = {
      content: aiContent,
      id: uuid(),
      aiMessage: true,
    };
    
    return { message, aiMessage, conversationId };
  }
);

const initialState = {
  conversations: [],
  selectedConversationId: null,
  loading: false,
  error: null,
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
    loadConversations: (state) => {
      // Load conversations from localStorage
      const saved = localStorage.getItem('conversations');
      if (saved) {
        state.conversations = JSON.parse(saved);
      }
    },
    saveConversations: (state) => {
      // Save conversations to localStorage
      localStorage.setItem('conversations', JSON.stringify(state.conversations));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendConversationMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendConversationMessage.fulfilled, (state, action) => {
        const { message, aiMessage, conversationId } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);

        if (conversation) {
          conversation.messages.push(aiMessage);
        }
        
        state.loading = false;
        
        // Save to localStorage
        localStorage.setItem('conversations', JSON.stringify(state.conversations));
      })
      .addCase(sendConversationMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        
        // Add error message to conversation
        const { conversationId } = action.meta.arg;
        const conversation = state.conversations.find(c => c.id === conversationId);
        
        if (conversation) {
          conversation.messages.push({
            content: "Sorry, I couldn't process your message. Please try again.",
            id: uuid(),
            aiMessage: true,
            error: true,
          });
        }
      });
  },
});

export const {
  setSelectedConversationId,
  addMessage,
  deleteConversations,
  loadConversations,
  saveConversations,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
