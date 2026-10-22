import React from "react";
import Messages from "./Messages";
import NewMessageInput from "./NewMessageInput";

// Displays the ChatGPT logo (it is used when no conversation is selected, from step 3).
export const ChatLogo = () => {
  return (
    <div className="chat_gpt_logo_container">
      <p className="chat_gpt_logo">ChatGPT</p>
    </div>
  );
};

// The Chat component shows the messages (Messages) and gets the input from users (NewMessageInput).
const Chat = () => {
  return (
    <div className="chat_container">
      <div className="chat_selected_container">
        <Messages />
        <NewMessageInput />
      </div>
    </div>
  );
};

export default Chat;
