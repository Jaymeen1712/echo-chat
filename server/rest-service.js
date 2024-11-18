const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/createTodo", controller.createTodoActionController);

module.exports = { router };
