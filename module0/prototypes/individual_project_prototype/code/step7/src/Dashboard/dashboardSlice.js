import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { sendMessageToAI } from "../services/openaiService";

const STORAGE_KEY = "conversations";

// Conversations are persisted in localStorage (there is no server any more).
const loadConversations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load conversations:", error);
    return [];
  }
};

const saveConversations = (conversations) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversations:", error);
  }
};

// createAsyncThunk: use an async function (ChatGPT request) in the Redux slice.
// It does what the server did before: build the history, add the new question,
// and get the AI response.
export const sendConversationMessage = createAsyncThunk(
  "dashboard/sendMessage",
  async ({ message, conversationId, conversationMessages }) => {
    // Build the message history for OpenAI
    const messages = conversationMessages.map((m) => ({
      role: m.aiMessage ? "assistant" : "user",
      content: m.content,
    }));

    // Add the new user message
    messages.push({ role: "user", content: message.content });

    // Get the AI response
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
  conversations: loadConversations(),
  selectedConversationId: null,
  loading: false, // waiting for the ChatGPT answer
  error: null, // error in the communication with ChatGPT
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

      saveConversations(state.conversations);
    },

    deleteConversations: (state) => {
      state.conversations = [];
      state.selectedConversationId = null;
    },
  },

  // Process the three cases of the async thunk: pending, fulfilled, rejected.
  extraReducers: (builder) => {
    builder
      // waiting (pending)
      .addCase(sendConversationMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success (fulfilled): add the AI message and store the conversations
      .addCase(sendConversationMessage.fulfilled, (state, action) => {
        const { aiMessage, conversationId } = action.payload;

        const conversation = state.conversations.find(
          (c) => c.id === conversationId
        );

        if (conversation) {
          conversation.messages.push(aiMessage);
        }

        state.loading = false;

        // Save to localStorage
        saveConversations(state.conversations);
      })

      // failure (rejected): set the error and add an error message to the conversation
      .addCase(sendConversationMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;

        const { conversationId } = action.meta.arg;
        const conversation = state.conversations.find(
          (c) => c.id === conversationId
        );

        if (conversation) {
          conversation.messages.push({
            content: "Sorry, I couldn't process your message. Please try again.",
            id: uuid(),
            aiMessage: true,
            error: true,
          });
        }

        saveConversations(state.conversations);
      });
  },
});

export const { setSelectedConversationId, addMessage, deleteConversations } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
