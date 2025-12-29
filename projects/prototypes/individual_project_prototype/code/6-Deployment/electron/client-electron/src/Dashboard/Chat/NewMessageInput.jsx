import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsSend } from "react-icons/bs";
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

  const proceedMessage = () => {
    const message = {
      aiMessage: false,
      content,
      id: uuid(),
      animate: false,
    };

    console.log(message);

    const conversationId =
      selectedConversationId === "new" ? uuid() : selectedConversationId;

    // append this message to our local store
    dispatch(
      addMessage({
        conversationId,
        message,
      })
    );

    dispatch(setSelectedConversationId(conversationId));

    // send message to the server
    sendConversationMessage(message, conversationId);

    // reset value of the input
    setContent("");
  };

  const handleSendMessage = () => {
    if (content.length > 0) {
      proceedMessage();
    }
  };

  const handleKeyPressed = (event) => {
    if (event.code === "Enter" && content.length > 0) {
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
        disabled={
          selectedConversation &&
          !selectedConversation.messages[
            selectedConversation.messages.length - 1
          ].aiMessage
        }
      />
      <div className="new_message_icon_container" onClick={handleSendMessage}>
        <BsSend color="grey" />
      </div>
    </div>
  );
};

export default NewMessageInput;
