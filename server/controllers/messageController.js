const { ObjectId } = require("mongodb");
const Message = require("../models/message");
const { sendErrors } = require("../utils/getError");
const { handleGetResponse } = require("../utils/utils");

module.exports.message_post = async (req, res) => {
  try {
    const { senderId, conversationId, content } = req.body;

    const sender = new ObjectId(senderId);
    const conversation = new ObjectId(conversationId);

    if (!senderId || !conversationId || !content) {
      return res
        .status(400)
        .json({ error: "SenderId, conversationId and content are required." });
    }

    const message = new Message({
      sender,
      conversation,
      content,
    });

    await message.save();

    return res.status(200).json(
      handleGetResponse({
        message: `Message created successfully.`,
        data: message,
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      duplicationMessage: "Message already exist",
      genericMessageKey: "create message",
    });
  }
};

module.exports.message_get = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = new ObjectId(conversationId);

    const messages = await Message.find({
      conversation,
    })
      .populate("sender", ["name", "image"])
      .sort({ updatedAt: -1 });

    if (!messages || messages.length === 0) {
      return res.status(202).json(
        handleGetResponse({
          message: `No messages found for this user.`,
          data: {
            messages: [],
          },
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: `Messages fetched successfully.`,
        data: { messages },
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      genericMessageKey: "get messages",
    });
  }
};

module.exports.message_delete = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json(
        handleGetResponse({
          message: "Message ID is required.",
          isError: true,
        })
      );
    }

    const message = await Message.deleteOne({
      _id: messageId,
    });

    if (!message) {
      return res.status(404).json(
        handleGetResponse({
          message: `Message not found.`,
          isError: true,
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: `Message deleted successfully.`,
        data: message,
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      genericMessageKey: "delete message",
    });
  }
};
