const express = require("express");
const { createUser } = require("../controllers/userController");
const router = express.Router();

// Define the route for creating a user
router.post("/user", createUser);

module.exports = router;