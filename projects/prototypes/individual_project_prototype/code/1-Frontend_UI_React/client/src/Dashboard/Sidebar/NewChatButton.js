import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const NewChatButton = () => {
  return (
    <div className="new_chat_button" onClick={() => {}}>
      <div className="new_chat_button_icon">
        <AiOutlinePlus color="white" />
      </div>
      <p className="new_chat_button_text">New Chat</p>
    </div>
  );
};

export default NewChatButton;
