"use strict";

const { Sequelize } = require("sequelize");

async function up({ context: queryInterface }) {
  return queryInterface.createTable("todo", {
    id: {
      type: Sequelize.INTEGER(255),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },
    parentId: {
      type: Sequelize.INTEGER(255),
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    isChildren: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.STRING(255),
    },
    updatedAt: {
      type: Sequelize.STRING(255),
    },
  });
}

async function down({ context: queryInterface }) {
  return queryInterface.dropTable("todo");
}

module.exports = { up, down };
