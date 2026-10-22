import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

// Step 3: the click handler does nothing yet (it is implemented in step 4).
const DeleteConversationsButton = () => {
  return (
    <div className="list_item delete_conv_button" onClick={() => {}}>
      <div className="list_item_icon">
        <AiOutlineDelete color="white" />
      </div>
      <p className="list_item_text">Delete conversations</p>
    </div>
  );
};

export default DeleteConversationsButton;
