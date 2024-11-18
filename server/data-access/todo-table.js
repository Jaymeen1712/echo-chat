module.exports = function makeTodoTable({ connection }) {
  return Object.freeze({
    createTodo,
  });

  async function createTodo({ insertObj }) {
    const sql = `INSERT INTO todo SET ?`;
    const result = await connection.query(sql, insertObj);
    return result;
  }
};
