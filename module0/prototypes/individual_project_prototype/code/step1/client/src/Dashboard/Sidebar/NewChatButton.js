import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

// The function is given as a prop (a no-op by default in this step).
const NewChatButton = ({ handleSetSelectedChat = () => {} }) => {
  const handleChooseNewChat = () => {
    handleSetSelectedChat("new");
  };

  return (
    <div className="new_chat_button" onClick={handleChooseNewChat}>
      <div className="new_chat_button_icon">
        <AiOutlinePlus color="white" />
      </div>
      <p className="new_chat_button_text">New Chat</p>
    </div>
  );
};

export default NewChatButton;
