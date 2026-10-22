import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar/Sidebar";
import Chat from "./Chat/Chat";
import LoadingSpinner from "./LoadingSpinner";

import "./dashboard.css";

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
