const mysql = require("mysql2");
const config = require("../config");

const connection = mysql
  .createConnection({
    port: config.mysql.port,
    host: config.mysql.host,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database,
  })
  .promise();

const makeTodoTable = require("./todo-table");
const todoTable = makeTodoTable({ connection });

module.exports = Object.freeze({
  todoTable,
});
