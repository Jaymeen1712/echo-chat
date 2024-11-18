const useCases = require("../usecases");

const makeCreateTodoActionController = require("./create-todo-controller");
const createTodoActionController = makeCreateTodoActionController({
  createTodo: useCases.createTodo,
});

module.exports = Object.freeze({
  createTodoActionController,
});
