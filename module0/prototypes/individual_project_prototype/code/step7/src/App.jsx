import { useEffect } from "react";
import Dashboard from "./Dashboard/Dashboard";
import { initializeOpenAI } from "./services/openaiService";

function App() {
  // Initialize the OpenAI client (instead of connecting to the socket server).
  useEffect(() => {
    initializeOpenAI();
  }, []);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
