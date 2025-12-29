import React from "react";
import { useSelector } from "react-redux";
import Message from "./Message";

const Messages = () => {
  const { selectedConversationId, conversations } = useSelector(
    (state) => state.dashboard
  );

  const conversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="chat_messages_container">
      {conversation?.messages.map((m, index) => (
        <Message
          key={m.id}
          content={m.content}
          aiMessage={m.aiMessage}
          animate={index === conversation.messages.length - 1 && m.aiMessage}
        />
      ))}
    </div>
  );
};

export default Messages;
