const { Server } = require("socket.io");
const {
  handleDisconnectUser,
  handleConnectUser,
} = require("../controllers/userController");
const message_controller = require("../controllers/messageController");
const { clients } = require("../utils/utils");
const {
  getPopulatedConversation,
} = require("../utils/getPopulatedConversation");

class SocketManager {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.SOCKET_CORS_URL,
        methods: ["GET", "POST"],
      },
      // Performance optimizations
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 1e6, // 1MB
      allowEIO3: true,
      transports: ['websocket', 'polling'],
      // Connection state recovery
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true,
      }
    });

    this.messageQueue = new Map(); // Queue for offline users
    this.typingUsers = new Map(); // Track typing users
    this.userRooms = new Map(); // Track user room memberships
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User Connected: ${socket.id}`);

      // User registration
      socket.on("register", (userId) => {
        this.handleUserRegistration(socket, userId);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        this.handleUserDisconnection(socket);
      });

      // Conversation events
      socket.on("conversation-updated", async (data) => {
        await this.handleConversationUpdate(socket, data);
      });

      // Message events
      socket.on("message-updated", async (data) => {
        await this.handleMessageUpdate(socket, data);
      });

      // Typing indicators
      socket.on("typing-start", (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on("typing-stop", (data) => {
        this.handleTypingStop(socket, data);
      });

      // Message seen/delivered status
      socket.on("update-seen-messages", (data) => {
        this.handleMessageSeen(socket, data);
      });

      // WebRTC signaling
      socket.on("send-offer", (data) => {
        this.handleWebRTCOffer(socket, data);
      });

      socket.on("send-answer", (data) => {
        this.handleWebRTCAnswer(socket, data);
      });

      socket.on("send-ice-candidate", (data) => {
        this.handleICECandidate(socket, data);
      });

      // Join/leave conversation rooms
      socket.on("join-conversation", (conversationId) => {
        this.joinConversationRoom(socket, conversationId);
      });

      socket.on("leave-conversation", (conversationId) => {
        this.leaveConversationRoom(socket, conversationId);
      });

      // Error handling
      socket.on("error", (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  handleUserRegistration(socket, userId) {
    if (userId) {
      // Store user connection
      clients[userId] = socket.id;
      socket.userId = userId;
      
      // Update user online status
      handleConnectUser(userId);
      
      // Join user to their personal room
      socket.join(`user:${userId}`);
      
      // Deliver queued messages
      this.deliverQueuedMessages(userId);
      
      // Notify all clients about updated user list
      this.io.emit("online-users", Object.keys(clients));
      
      console.log(`User ${userId} registered with socket ${socket.id}`);
    }
  }

  handleUserDisconnection(socket) {
    console.log(`User disconnected: ${socket.id}`);
    
    const disconnectedUserId = Object.keys(clients).find(
      (key) => clients[key] === socket.id
    );

    if (disconnectedUserId) {
      // Update user offline status
      handleDisconnectUser(disconnectedUserId);
      
      // Remove from clients
      delete clients[disconnectedUserId];
      
      // Stop typing indicators
      this.handleTypingStop(socket, { userId: disconnectedUserId });
      
      // Leave all rooms
      this.leaveAllRooms(socket);
    }
    
    // Notify all clients about updated user list
    this.io.emit("online-users", Object.keys(clients));
  }

  async handleConversationUpdate(socket, { conversationId, receiverId }) {
    try {
      const populatedConversation = await getPopulatedConversation(conversationId);
      
      // Emit to conversation room
      this.io.to(`conversation:${conversationId}`).emit("update-conversation", {
        conversation: populatedConversation,
        receiverId,
      });
    } catch (error) {
      console.error("Error handling conversation update:", error);
    }
  }

  async handleMessageUpdate(socket, { message }) {
    try {
      const conversationId = message.conversation;
      
      // Emit to conversation room
      this.io.to(`conversation:${conversationId}`).emit("update-message", {
        message,
      });
      
      // If recipient is offline, queue the message
      const recipientId = this.getRecipientId(message);
      if (recipientId && !clients[recipientId]) {
        this.queueMessage(recipientId, message);
      }
    } catch (error) {
      console.error("Error handling message update:", error);
    }
  }

  handleTypingStart(socket, { conversationId, userId }) {
    if (!conversationId || !userId) return;
    
    const typingKey = `${conversationId}:${userId}`;
    
    // Clear existing timeout
    if (this.typingUsers.has(typingKey)) {
      clearTimeout(this.typingUsers.get(typingKey));
    }
    
    // Emit typing start to conversation room (except sender)
    socket.to(`conversation:${conversationId}`).emit("receive-true-typing", {
      conversationId,
      userId
    });
    
    // Auto-stop typing after 3 seconds
    const timeout = setTimeout(() => {
      this.handleTypingStop(socket, { conversationId, userId });
    }, 3000);
    
    this.typingUsers.set(typingKey, timeout);
  }

  handleTypingStop(socket, { conversationId, userId }) {
    if (!conversationId || !userId) return;
    
    const typingKey = `${conversationId}:${userId}`;
    
    // Clear timeout
    if (this.typingUsers.has(typingKey)) {
      clearTimeout(this.typingUsers.get(typingKey));
      this.typingUsers.delete(typingKey);
    }
    
    // Emit typing stop to conversation room (except sender)
    socket.to(`conversation:${conversationId}`).emit("receive-false-typing", {
      conversationId,
      userId
    });
  }

  handleMessageSeen(socket, { conversationId, senderId }) {
    if (!conversationId || !senderId) return;
    
    // Emit to conversation room
    this.io.to(`conversation:${conversationId}`).emit("messages-seen", {
      conversationId,
      seenBy: senderId
    });
  }

  handleWebRTCOffer(socket, { senderUserDetails, targetUserId, offer }) {
    const targetUserSocketId = clients[targetUserId];
    if (targetUserSocketId) {
      this.io.to(targetUserSocketId).emit("receive-offer", {
        senderUserDetails,
        targetUserId,
        offer,
      });
      console.log(`Offer sent from ${socket.id} to ${targetUserId}`);
    } else {
      console.error(`Target user ${targetUserId} not found`);
    }
  }

  handleWebRTCAnswer(socket, { targetUserId, answer }) {
    const targetUserSocketId = clients[targetUserId];
    if (targetUserSocketId) {
      this.io.to(targetUserSocketId).emit("receive-answer", {
        answer,
      });
    }
  }

  handleICECandidate(socket, { targetUserId, candidate }) {
    const targetUserSocketId = clients[targetUserId];
    if (targetUserSocketId) {
      this.io.to(targetUserSocketId).emit("receive-ice-candidate", {
        candidate,
      });
    }
  }

  joinConversationRoom(socket, conversationId) {
    if (!conversationId) return;
    
    socket.join(`conversation:${conversationId}`);
    
    // Track room membership
    if (!this.userRooms.has(socket.userId)) {
      this.userRooms.set(socket.userId, new Set());
    }
    this.userRooms.get(socket.userId).add(`conversation:${conversationId}`);
  }

  leaveConversationRoom(socket, conversationId) {
    if (!conversationId) return;
    
    socket.leave(`conversation:${conversationId}`);
    
    // Update room membership tracking
    if (this.userRooms.has(socket.userId)) {
      this.userRooms.get(socket.userId).delete(`conversation:${conversationId}`);
    }
  }

  leaveAllRooms(socket) {
    if (socket.userId && this.userRooms.has(socket.userId)) {
      const rooms = this.userRooms.get(socket.userId);
      rooms.forEach(room => socket.leave(room));
      this.userRooms.delete(socket.userId);
    }
  }

  queueMessage(userId, message) {
    if (!this.messageQueue.has(userId)) {
      this.messageQueue.set(userId, []);
    }
    
    const userQueue = this.messageQueue.get(userId);
    userQueue.push({
      message,
      timestamp: Date.now()
    });
    
    // Limit queue size to prevent memory issues
    if (userQueue.length > 100) {
      userQueue.shift(); // Remove oldest message
    }
  }

  deliverQueuedMessages(userId) {
    if (this.messageQueue.has(userId)) {
      const messages = this.messageQueue.get(userId);
      const socketId = clients[userId];
      
      if (socketId && messages.length > 0) {
        // Send queued messages
        messages.forEach(({ message }) => {
          this.io.to(socketId).emit("update-message", { message });
        });
        
        // Clear the queue
        this.messageQueue.delete(userId);
        
        console.log(`Delivered ${messages.length} queued messages to user ${userId}`);
      }
    }
  }

  getRecipientId(message) {
    // This would need to be implemented based on your message structure
    // Return the recipient user ID from the message
    return null; // Placeholder
  }

  // Cleanup method for graceful shutdown
  cleanup() {
    // Clear all typing timeouts
    this.typingUsers.forEach(timeout => clearTimeout(timeout));
    this.typingUsers.clear();
    
    // Clear message queues
    this.messageQueue.clear();
    
    // Clear room tracking
    this.userRooms.clear();
  }
}

module.exports = SocketManager;
