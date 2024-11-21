const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

// protected routes
router.get("/me", authenticateToken, getUser);

module.exports = router;
