const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const { todoTable } = require("../data-access");
const makeTodoTemplate = require("../entities");

const makeCreateTodo = require("./create-todo");

const createTodo = makeCreateTodo({
  uuidv4,
  Joi,
  moment,
  makeTodoTemplate,
  createTododb: todoTable.createTodo,
});

module.exports = Object.freeze({
  createTodo,
});
