import React from "react";
import Message from "./Message";

// Step 1: only two mock messages.
//  - the first one is the user's question
//  - the second one is the AI generated message
const Messages = () => {
  return (
    <div className="chat_messages_container">
      <Message content="Hello ai" aiMessage={false} />
      <Message animate content="hello here is ai." aiMessage={true} />
    </div>
  );
};

export default Messages;
