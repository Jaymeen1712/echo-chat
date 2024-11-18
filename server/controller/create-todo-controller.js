module.exports = function makeCreateTodoActionController({ createTodo }) {
  return async function createTodoActionController(req, res) {
    try {
      const response = await createTodo({ body: req.body });
      res.send(response);
    } catch (error) {
      res.status(400).json({
        message: 'Data is required',
      });      
    }
  };
};
