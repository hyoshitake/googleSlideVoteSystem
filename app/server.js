const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /*   cors: {
  origin: "http://localhost:13000",
  methods: ["GET", "POST"],
  credentials: true
} */ });

app.get("/vote", (req, res) => {
  res.sendFile(__dirname + "/vote.html");
});

app.get("/manage", (req, res) => {
  res.sendFile(__dirname + "/manage.html");
});

app.get("/meter", (req, res) => {
  res.sendFile(__dirname + "/meter.html");
});

io.on("connection", (socket) => {
  console.log('a user connected');
  console.log(socket)
});

httpServer.listen(3000);
