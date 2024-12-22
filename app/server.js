const fs = require('fs');
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

app.get('/audio/post', (req, res) => {
  fs.readFile('./post.mp3', (err, data) => {
    res.send(data);
  });
});

app.get("/manage", (req, res) => {
  res.sendFile(__dirname + "/manage.html");
});

io.on("connection", (socket) => {
  socket.on("join", (msg) => {
    console.log('received join:' + msg.roomCode);
    socket.join(msg.roomCode);
  })

  socket.on("post", (msg) => {
    console.log('received vote:');
    io.to(msg.roomCode).emit("vote");
    console.log('broadcasted vote:');
  });
});

httpServer.listen(3000);
