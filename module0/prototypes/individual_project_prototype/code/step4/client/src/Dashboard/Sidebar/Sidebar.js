import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NewChatButton from "./NewChatButton";
import ListItem from "./ListItem";
import DeleteConversationsButton from "./DeleteConversationsButton";
import { setSelectedConversationId } from "../dashboardSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  // Get the conversations from the state field.
  const conversations = useSelector((state) => state.dashboard.conversations);

  // Update the selectedConversationId state field.
  const handleSetSelectedChat = (id) => {
    dispatch(setSelectedConversationId(id));
  };

  return (
    <div className="sidebar_container">
      {/* 1. NewChatButton */}
      <NewChatButton handleSetSelectedChat={handleSetSelectedChat} />

      {/* 2. ListItem (one per conversation) */}
      {conversations.map((c) => (
        <ListItem
          key={c.id}
          title={c.messages[0]?.content}
          conversationId={c.id}
          handleSetSelectedChat={handleSetSelectedChat}
        />
      ))}

      {/* 3. DeleteConversationsButton */}
      <DeleteConversationsButton />
    </div>
  );
};

export default Sidebar;
