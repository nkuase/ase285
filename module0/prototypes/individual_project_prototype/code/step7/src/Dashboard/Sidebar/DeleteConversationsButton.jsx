import React from "react";
import { useDispatch } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
// No server communication any more: no need to rename the reducer.
import { deleteConversations } from "../dashboardSlice";

const DeleteConversationsButton = () => {
  const dispatch = useDispatch();

  const handleDeleteConversations = () => {
    // Clear from localStorage
    localStorage.removeItem("conversations");

    // Clear from the Redux store
    dispatch(deleteConversations());
  };

  return (
    <div
      className="list_item delete_conv_button"
      onClick={handleDeleteConversations}
    >
      <div className="list_item_icon">
        <AiOutlineDelete color="white" />
      </div>
      <p className="list_item_text">Delete conversations</p>
    </div>
  );
};

export default DeleteConversationsButton;
