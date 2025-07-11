const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
  searchUsers_get,
  updateUser_patch,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const conversation_controller = require("../controllers/conversationController");
const message_controller = require("../controllers/messageController");
const { clients } = require("../utils/utils");

// Import rate limiting and validation middleware
const {
  authLimiter,
  messageLimiter,
  uploadLimiter,
} = require("../middleware/rateLimitMiddleware");
const {
  validateUserRegistration,
  validateUserLogin,
  validateMessageCreation,
  validateConversationCreation,
  validateUserSearch,
  validateObjectId,
  validateUserUpdate,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Authentication routes with rate limiting and validation
router.post("/register", authLimiter, validateUserRegistration, createUser);
router.post("/login", authLimiter, validateUserLogin, loginUser);

// Protected routes

// User routes
router.get("/me", authenticateToken, getUser);
router.post(
  "/searchUsers",
  authenticateToken,
  validateUserSearch,
  searchUsers_get
);
router.patch(
  "/update-user",
  authenticateToken,
  validateUserUpdate,
  updateUser_patch
);

// Conversation routes
router.post(
  "/conversation",
  authenticateToken,
  validateConversationCreation,
  conversation_controller.conversation_post
);
router.get(
  "/conversations",
  authenticateToken,
  conversation_controller.conversation_get
);
router.patch(
  "/conversation",
  authenticateToken,
  conversation_controller.conversation_patch
);
router.delete(
  "/conversation/:conversationId",
  authenticateToken,
  validateObjectId("conversationId"),
  conversation_controller.conversation_delete
);
router.post(
  "/get-files-count",
  authenticateToken,
  uploadLimiter,
  conversation_controller.getFilesCount_post
);
router.post(
  "/get-all-files",
  authenticateToken,
  uploadLimiter,
  conversation_controller.getAllFiles_post
);

// Message routes
router.post(
  "/message",
  authenticateToken,
  messageLimiter,
  validateMessageCreation,
  (req, _res, next) => {
    req.onlineClients = clients;
    next();
  },
  message_controller.message_post
);
router.get(
  "/messages/:conversationId",
  authenticateToken,
  validateObjectId("conversationId"),
  message_controller.message_get
);
router.delete(
  "/message/:messageId",
  authenticateToken,
  validateObjectId("messageId"),
  message_controller.message_delete
);

module.exports = router;
