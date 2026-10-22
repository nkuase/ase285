import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  addMessage,
  setSelectedConversationId,
  sendConversationMessage,
} from "../dashboardSlice";

const NewMessageInput = () => {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const selectedConversationId = useSelector(
    (state) => state.dashboard.selectedConversationId
  );
  const conversations = useSelector((state) => state.dashboard.conversations);

  // loading is true while we are waiting for the ChatGPT answer.
  const loading = useSelector((state) => state.dashboard.loading);

  const proceedMessage = () => {
    const message = {
      aiMessage: false,
      content,
      id: uuid(),
      animate: false,
    };

    // "new" means a new conversation: create a new ID, otherwise use the existing one.
    const conversationId =
      selectedConversationId === "new" ? uuid() : selectedConversationId;

    // Get the conversation messages (before this message) for the context.
    const conversation = conversations.find((c) => c.id === conversationId);
    const conversationMessages = conversation ? conversation.messages : [];

    // Show the user's message immediately.
    dispatch(
      addMessage({
        conversationId,
        message,
      })
    );

    dispatch(setSelectedConversationId(conversationId));

    // Send the message to ChatGPT (async thunk): no socket / server any more.
    dispatch(
      sendConversationMessage({
        message,
        conversationId,
        conversationMessages,
      })
    );

    setContent("");
  };

  const handleSendMessage = () => {
    if (content.length > 0 && !loading) {
      proceedMessage();
    }
  };

  const handleKeyPressed = (event) => {
    // isComposing is true while an input method (e.g. Korean, Japanese) is still
    // composing a character: Enter then only confirms the character, not the message.
    if (
      event.key === "Enter" &&
      !event.nativeEvent.isComposing &&
      content.length > 0 &&
      !loading
    ) {
      proceedMessage();
    }
  };

  return (
    <div className="new_message_input_container">
      <input
        className="new_message_input"
        placeholder={loading ? "Waiting for response..." : "Send a message ..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyPressed}
        disabled={loading}
      />
      <div className="new_message_icon_container" onClick={handleSendMessage}>
        <BsSend color={loading ? "lightgrey" : "grey"} />
      </div>
    </div>
  );
};

export default NewMessageInput;
