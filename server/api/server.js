require("dotenv").config();
const { createServer } = require("node:http");
const Cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const router = require("../routes/routes");
const { Server } = require("socket.io");
const {
  getPopulatedConversation,
} = require("../utils/getPopulatedConversation");

const port = process.env.PORT || 4000;

const app = express();
const server = createServer(app);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Database Connection Established!");
});

app.use(express.json());
app.use(Cors());

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Conversations
  socket.on("conversation-updated", async ({ conversation, receiverId }) => {
    io.emit("update-conversation", {
      conversation,
      receiverId,
    });
  });

  // Messages
  socket.on("message-updated", async ({ message }) => {
    io.emit("update-message", {
      message,
    });
  });
});

app.use("/chat-service", router);