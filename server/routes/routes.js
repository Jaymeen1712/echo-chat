const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
  searchUsers_get,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const conversation_controller = require("../controllers/conversationController");
const message_controller = require("../controllers/messageController");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

// protected routes

// User routes
router.get("/me", authenticateToken, getUser);
router.get("/searchUsers", authenticateToken, searchUsers_get);

// Conversation routes
router.post(
  "/conversation",
  authenticateToken,
  conversation_controller.conversation_post
);
router.get(
  "/conversations",
  authenticateToken,
  conversation_controller.conversation_get
);
router.put(
  "/conversation",
  authenticateToken,
  conversation_controller.conversation_put
);
router.delete(
  "/conversation",
  authenticateToken,
  conversation_controller.conversation_delete
);

// Message routes
router.post("/message", authenticateToken, message_controller.message_post);
router.get("/messages", authenticateToken, message_controller.message_get);
router.delete("/message", authenticateToken, message_controller.message_delete);

module.exports = router;
