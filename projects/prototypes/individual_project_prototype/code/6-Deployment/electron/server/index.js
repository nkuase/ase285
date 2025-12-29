const express = require("express");
const http = require("http");
const cors = require("cors");
const socketServer = require("./src/socketServer");

const openai = require("./src/ai");

const app = express();

const server = http.createServer(app);
socketServer.registerSocketServer(server);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello server is working");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`App started listening at port ${PORT}`);
});
