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

  const proceedMessage = () => {
    // The user's input becomes the content of the message.
    const message = {
      aiMessage: false,
      content,
      id: uuid(),
      animate: false,
    };

    // "new" means a new conversation: create a new ID, otherwise use the existing one.
    const conversationId =
      selectedConversationId === "new" ? uuid() : selectedConversationId;

    // Store the message in the state field.
    dispatch(
      addMessage({
        conversationId,
        message,
      })
    );

    dispatch(setSelectedConversationId(conversationId));

    // Send the message to the server using WebSocket.
    sendConversationMessage(message, conversationId);

    // Reset the value of the input.
    setContent("");
  };

  const handleKeyPressed = (event) => {
    // isComposing is true while an input method (e.g. Korean, Japanese) is still
    // composing a character: Enter then only confirms the character, not the message.
    if (
      event.key === "Enter" &&
      !event.nativeEvent.isComposing &&
      content.length > 0
    ) {
      proceedMessage();
    }
  };

  const handleSendMessage = () => {
    if (content.length > 0) {
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
      />
      <div className="new_message_icon_container" onClick={handleSendMessage}>
        <BsSend color="grey" />
      </div>
    </div>
  );
};

export default NewMessageInput;
