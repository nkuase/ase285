import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

// When the button is clicked, the function given as the prop is executed with "new".
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
