import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";

const Messages = () => {
  const { selectedConversationId, conversations } = useSelector(
    (state) => state.dashboard
  );

  // Find the conversation with the selectedConversationId.
  const conversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // Automatic scrolling: scrollRef points to a real DOM element (the last <div>).
  // useRef() creates an object whose .current is the DOM node React assigns.
  const scrollRef = useRef();

  // Scroll down to the latest message whenever the messages are updated.
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
          // Only the last (AI) message is animated.
          animate={index === conversation.messages.length - 1 && m.aiMessage}
        />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default Messages;
