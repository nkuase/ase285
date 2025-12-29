import { io } from "socket.io-client";

let socket;

export const connectWithSocketServer = () => {
  socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("connected with socket.io server");
    console.log(socket.id);
  });
};
