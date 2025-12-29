import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar/Sidebar.jsx";
import Chat from "./Chat/Chat.jsx";

import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard_container">
      <Sidebar />
      <Chat />
    </div>
  );
};

export default Dashboard;
