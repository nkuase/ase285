import React from "react";
import Message from "./Message";

// Step 2: still two mock messages.
const Messages = () => {
  return (
    <div className="chat_messages_container">
      <Message content="Hello ai" aiMessage={false} />
      <Message animate content="hello here is ai." aiMessage={true} />
    </div>
  );
};

export default Messages;
