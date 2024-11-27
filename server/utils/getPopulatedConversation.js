const Conversation = require("../models/conversation");

const getPopulatedConversation = async (_id) => {
  return await Conversation.findById(
    _id,
    {
      createdAt: true,
      updatedAt: true,
    },
    {
      new: true,
    }
  )
    .populate("participants", ["name", "image"]) // Populates the participants field with name and image
    .populate("lastMessage", ["content"]) // Populates the lastMessage field with content
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender", // Further populates the sender inside lastMessage
        select: ["_id"], // Includes only the _id field
      },
    });
};

module.exports = { getPopulatedConversation };
