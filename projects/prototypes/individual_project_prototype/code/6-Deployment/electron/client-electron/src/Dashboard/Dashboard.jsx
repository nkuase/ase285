import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar/Sidebar.jsx";
import Chat from "./Chat/Chat.jsx";

import "./dashboard.css";
import LoadingSpinner from "./LoadingSpinner.jsx";

const Dashboard = () => {
  const sessionEstablished = useSelector(
    (state) => state.dashboard.sessionEstablished
  );

  return (
    <div className="dashboard_container">
      <Sidebar />
      <Chat />
      {!sessionEstablished && <LoadingSpinner />}
    </div>
  );
};

export default Dashboard;
