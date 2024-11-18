const Joi = require("joi");

const buildMakeTodoTemplate = require("./create-todo-entities");
const makeTodoTemplate = buildMakeTodoTemplate({ Joi });

module.exports = Object.freeze({
  makeTodoTemplate,
});
