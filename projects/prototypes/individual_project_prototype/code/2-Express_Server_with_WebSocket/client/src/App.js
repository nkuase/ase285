import { useEffect } from "react";
import Dashboard from "./Dashboard/Dashboard";
import { connectWithSocketServer } from "./socketConnection/socketConn";

function App() {
  useEffect(() => {
    connectWithSocketServer();
  }, []);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
