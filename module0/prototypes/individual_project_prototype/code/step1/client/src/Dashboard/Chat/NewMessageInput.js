import React, { useState } from "react";
import { BsSend } from "react-icons/bs";

// Step 1: the input only stores what the user types (nothing is sent yet).
const NewMessageInput = () => {
  const [content, setContent] = useState("");

  return (
    <div className="new_message_input_container">
      <input
        className="new_message_input"
        placeholder="Send a message ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="new_message_icon_container">
        <BsSend color="grey" />
      </div>
    </div>
  );
};

export default NewMessageInput;
