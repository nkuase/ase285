import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { addMessage, setSelectedConversationId } from "../dashboardSlice";
import { sendConversationMessage } from "../../socketConnection/socketConn";

const NewMessageInput = () => {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const selectedConversationId = useSelector(
    (state) => state.dashboard.selectedConversationId
  );
  const conversations = useSelector((state) => state.dashboard.conversations);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // Disabled while we are waiting for the AI answer.
  const isWaitingForAnswer = Boolean(
    selectedConversation &&
      !selectedConversation.messages[selectedConversation.messages.length - 1]
        .aiMessage
  );

  const proceedMessage = () => {
    const message = {
      aiMessage: false,
      content,
      id: uuid(),
      animate: false,
    };

    const conversationId =
      selectedConversationId === "new" ? uuid() : selectedConversationId;

    dispatch(
      addMessage({
        conversationId,
        message,
      })
    );

    dispatch(setSelectedConversationId(conversationId));

    sendConversationMessage(message, conversationId);

    setContent("");
  };

  const handleKeyPressed = (event) => {
    // isComposing is true while an input method (e.g. Korean, Japanese) is still
    // composing a character: Enter then only confirms the character, not the message.
    if (
      event.key === "Enter" &&
      !event.nativeEvent.isComposing &&
      content.length > 0 &&
      !isWaitingForAnswer
    ) {
      proceedMessage();
    }
  };

  const handleSendMessage = () => {
    if (content.length > 0 && !isWaitingForAnswer) {
      proceedMessage();
    }
  };

  return (
    <div className="new_message_input_container">
      <input
        className="new_message_input"
        placeholder="Send a message ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyPressed}
        disabled={isWaitingForAnswer}
      />
      <div className="new_message_icon_container" onClick={handleSendMessage}>
        <BsSend color="grey" />
      </div>
    </div>
  );
};

export default NewMessageInput;
