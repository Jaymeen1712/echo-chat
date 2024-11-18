module.exports = function buildMakeTodoTemplate({ Joi }) {
  return async function makeTodoTemplate({ parentId, title, isChildren }) {
    const schema = Joi.object({
      title: Joi.string().required().min(3),
      isChildren: Joi.boolean().required(),
    });

    const { value, error } = schema.validate({
      title,
      isChildren,
    });

    if (error) throw error.details[0].message;

    return Object.freeze({
      getTitle: () => value.title,
      getIsChildren: () => value.isChildren,
    });
  };
};
