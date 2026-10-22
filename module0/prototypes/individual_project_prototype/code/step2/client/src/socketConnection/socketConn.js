import { io } from "socket.io-client";

let socket;

// Change the port if necessary (the run.sh passes REACT_APP_SERVER_URL).
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export const connectWithSocketServer = () => {
  socket = io(SERVER_URL);

  // Invoked when the server accepts the connection.
  socket.on("connect", () => {
    console.log("connected with socket.io server");
    console.log(socket.id);
  });
};
