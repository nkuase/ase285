import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsSend } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import { addMessage, setSelectedConversationId, sendConversationMessage } from "../dashboardSlice";

const NewMessageInput = () => {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const selectedConversationId = useSelector(
    (state) => state.dashboard.selectedConversationId
  );

  const conversations = useSelector((state) => state.dashboard.conversations);
  const loading = useSelector((state) => state.dashboard.loading);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const proceedMessage = () => {
    const message = {
      aiMessage: false,
      content,
      id: uuid(),
    };

    const conversationId =
      selectedConversationId === "new" ? uuid() : selectedConversationId;

    // Add user message to store
    dispatch(
      addMessage({
        conversationId,
        message,
      })
    );

    dispatch(setSelectedConversationId(conversationId));

    // Get conversation messages for context
    const conversation = conversations.find(c => c.id === conversationId);
    const conversationMessages = conversation ? conversation.messages : [];

    // Send message to AI
    dispatch(sendConversationMessage({ 
      message, 
      conversationId,
      conversationMessages 
    }));

    // Reset input
    setContent("");
  };

  const handleSendMessage = () => {
    if (content.length > 0 && !loading) {
      proceedMessage();
    }
  };

  const handleKeyPressed = (event) => {
    if (event.code === "Enter" && content.length > 0 && !loading) {
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
