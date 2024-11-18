module.exports = function makeCreateTodo({
  uuidv4,
  moment,
  makeTodoTemplate,
  createTododb,
}) {
  return async function createTodo({ body }) {
    const uuid = uuidv4();
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const { parentId = null, title, isChildren } = body;

    const entitiesResult = await makeTodoTemplate.makeTodoTemplate({
      title,
      isChildren,
    });

    let insertObj = {
      uuid,
      parentId,
      title: entitiesResult.getTitle(),
      isChildren: entitiesResult.getIsChildren(),
      createdAt,
      updatedAt,
    };

    const result = await createTododb({ insertObj });

    if (result[0].affectedRows > 0) {
      const response = {
        message: "Todo created successfully!",
        uuid: insertObj.uuid,
      };
      return response;
    } else {
      return { message: "Todo is not created!" };
    }
  };
};
