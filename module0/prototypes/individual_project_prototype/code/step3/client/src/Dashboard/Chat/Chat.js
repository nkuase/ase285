import React from "react";
import { useSelector } from "react-redux";
import Messages from "./Messages";
import NewMessageInput from "./NewMessageInput";

// Displays the ChatGPT logo.
export const ChatLogo = () => {
  return (
    <div className="chat_gpt_logo_container">
      <p className="chat_gpt_logo">ChatGPT</p>
    </div>
  );
};

const Chat = () => {
  const selectedConversationId = useSelector(
    (state) => state.dashboard.selectedConversationId
  );

  return (
    <div className="chat_container">
      {!selectedConversationId ? (
        // No selected conversation yet: display the ChatGPT logo.
        <ChatLogo />
      ) : (
        // Display the messages and the new message input.
        <div className="chat_selected_container">
          <Messages />
          <NewMessageInput />
        </div>
      )}
    </div>
  );
};

export default Chat;
