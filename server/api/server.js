require("dotenv").config();
const { createServer } = require("node:http");
const Cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const router = require("../routes/routes");
const { Server } = require("socket.io");
const {
  handleDisconnectUser,
  handleConnectUser,
} = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

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

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(Cors());

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const clients = {};

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);

  socket.on("register", (userId) => {
    if (userId) {
      clients[userId] = socket.id;
      handleConnectUser(userId);
    }

    // Notify all clients about the updated user list
    io.emit("online-users", Object.keys(clients));
    console.log("🚀 ~ socket.on register ~ clients:", clients);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const disconnectedUserId = Object.keys(clients).find(
      (key) => clients[key] === socket.id
    );

    if (disconnectedUserId) {
      handleDisconnectUser(disconnectedUserId);
      delete clients[disconnectedUserId];
    }
  });

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

  // Relay offer to the target user
  socket.on("send-offer", ({ senderUserDetails, targetUserId, offer }) => {
    const targetUserSocketId = clients[targetUserId];
    if (targetUserSocketId) {
      io.to(targetUserSocketId).emit("receive-offer", {
        senderUserDetails,
        targetUserId,
        offer,
      });
      console.log(`Offer sent from ${socket.id} to ${targetUserId}`);
    } else {
      console.error(`Target user ${targetUserId} not found`);
    }
  });

  // Relay answer to the target user
  socket.on("send-answer", ({ senderUserId, answer }) => {
    const targetUserSocketId = clients[senderUserId];
    if (targetUserSocketId) {
      io.to(targetUserSocketId).emit("receive-answer", {
        answer,
      });
      console.log(`Answer sent from ${socket.id} to ${senderUserId}`);
    } else {
      console.error(`Target user ${senderUserId} not found`);
    }
  });

  socket.on("send-ice-candidate", ({ targetUserId, candidate }) => {
    console.log(`ICE Candidate from ${socket.id} to ${targetUserId}`);
    const targetUserSocketId = clients[targetUserId];

    if (targetUserSocketId) {
      io.to(targetUserSocketId).emit("receive-ice-candidate", {
        targetUserId,
        candidate,
      });
      console.log(`Relayed ICE candidate to ${targetUserId}`);
    } else {
      console.error(`Target user ${targetUserId} not found`);
    }
  });

  // Live messages
  socket.on("update-seen-messages", async ({ conversationId }) => {
    message_controller.handleUpdateIsSeen(conversationId);
  });
});

app.use("/chat-service", router);
