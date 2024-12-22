const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://docs.google.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/vote", (req, res) => {
  res.sendFile(__dirname + "/vote.html");
});

app.get("/manage", (req, res) => {
  res.sendFile(__dirname + "/manage.html");
});

let store = {};
io.on("connection", (socket) => {
  socket.on("join", (msg) => {
    console.log('received join:' + msg.roomId);
    userObj = {
      'room': msg.roomId,
      'name': msg.name
    }
    store = userObj;
    socket.join(msg.roomId);
    console.log('joined:' + msg.roomId);
  })

  socket.on("post", (msg) => {
    console.log('received message:');
    io.to(store.room).emit("message", msg);
    console.log('broadcasted message:');
  });
});

httpServer.listen(3000);
