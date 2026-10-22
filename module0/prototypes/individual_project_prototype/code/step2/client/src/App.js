import { useEffect } from "react";
import Dashboard from "./Dashboard/Dashboard";
import { connectWithSocketServer } from "./socketConnection/socketConn";

function App() {
  // useEffect runs after the component first renders.
  // The empty array [] means: run this effect only one time, on component mount.
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
