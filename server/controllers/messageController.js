const { ObjectId } = require("mongodb");
const Message = require("../models/message");
const { sendErrors } = require("../utils/getError");
const { handleGetResponse } = require("../utils/utils");
const Conversation = require("../models/conversation");

module.exports.message_post = async (req, res) => {
  try {
    const { senderId, conversationId, content, files } = req.body;
    const clients = req.onlineClients;

    const sender = new ObjectId(senderId);
    const conversation = new ObjectId(conversationId);

    if (!senderId || !conversationId) {
      return res
        .status(400)
        .json({ error: "SenderId and conversationId are required." });
    }

    // Find the other participant ID from the conversation
    const conversationDetails = await Conversation.findById(
      conversation
    ).populate("participants");

    const otherParticipantID = new ObjectId(
      conversationDetails?.participants.find((participant) => {
        return new ObjectId(participant._id).valueOf() !== senderId;
      })._id
    ).valueOf();

    const isRecipientOnline = clients[otherParticipantID];

    const message = new Message({
      sender,
      conversation,
      content,
      files,
      isDelivered: !!isRecipientOnline,
    });

    await message.save();

    // Use `populate` for only "sender" with selected fields
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      ["name", "image"]
    );

    return res.status(200).json(
      handleGetResponse({
        message: `Message created successfully.`,
        data: populatedMessage,
      })
    );
  } catch (error) {
    console.error("Error in message_post:", error);
    sendErrors({
      res,
      error,
      duplicationMessage: "Message already exists",
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

module.exports.handleUpdateIsSeen = async (conversationId, senderId) => {
  try {
    if (!conversationId) {
      return;
    }

    const conversationObjectId = new ObjectId(conversationId);
    const senderObjectId = new ObjectId(senderId);

    await Message.updateMany(
      {
        conversation: conversationObjectId,
        isSeen: false,
        sender: { $ne: senderObjectId },
      },
      {
        $set: { isSeen: true },
      }
    );

    const messages = await Message.find({
      conversation: conversationObjectId,
    })
      .populate("sender", ["name", "image"])
      .sort({ updatedAt: -1 });

    if (!messages || messages.length === 0) {
      return [];
    }

    return messages;
  } catch (error) {
    console.error(error);
    return [];
  }
};
