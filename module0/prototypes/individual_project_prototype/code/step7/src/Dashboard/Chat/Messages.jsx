import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";

const Messages = () => {
  const { selectedConversationId, conversations } = useSelector(
    (state) => state.dashboard
  );

  const conversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // Automatic scrolling to the latest message.
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

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
      <div ref={scrollRef} />
    </div>
  );
};

export default Messages;
