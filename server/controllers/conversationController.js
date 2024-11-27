const { ObjectId } = require("mongodb");
const Conversation = require("../models/conversation");
const { sendErrors } = require("../utils/getError");
const {
  getUniqueConversationParticipantsKey,
} = require("../utils/uniqueConversationKey");
const { handleGetResponse } = require("../utils/utils");

module.exports.conversation_post = async (req, res) => {
  try {
    const { participants, isGroup = false } = req.body;

    const participantsKey = getUniqueConversationParticipantsKey(participants);

    if (!participants) {
      return res.status(400).json({ error: "Participants are required." });
    }

    const conversation = new Conversation({
      participants,
      participantsKey,
      isGroup,
      ...req.body,
    });

    await conversation.save();

    return res.status(200).json(
      handleGetResponse({
        message: `Conversations created successfully.`,
        data: conversation,
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      duplicationMessage: "Conversation already exist",
      genericMessageKey: "create conversation",
    });
  }
};

module.exports.conversation_get = async (req, res) => {
  try {
    const user = req.user;
    const userId = new ObjectId(user.userId);

    const conversations = await Conversation.find(
      {
        participants: userId,
      },
      {
        createdAt: true,
        updatedAt: true,
      }
    )
      .populate("participants", ["name", "image"])
      .populate("lastMessage", ["content"])
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: ["_id"],
        },
      })
      .sort({ updatedAt: -1 });

    if (!conversations || conversations.length === 0) {
      return res.status(202).json(
        handleGetResponse({
          message: `No conversations found for this user.`,
          data: {
            conversations: [],
          },
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: `Conversations fetched successfully.`,
        data: { conversations },
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      genericMessageKey: "get conversation",
    });
  }
};

module.exports.conversation_patch = async (req, res) => {
  try {
    const { conversationId, lastMessageId } = req.body;

    if (!conversationId || !lastMessageId) {
      return res.status(400).json(
        handleGetResponse({
          message: "conversationId, lastMessage are required.",
          isError: true,
        })
      );
    }

    const lastMessage = new ObjectId(lastMessageId);

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
      },
      {
        lastMessage,
      },
      {
        new: true,
      }
    )
      .populate("participants", ["name", "image"])
      .populate("lastMessage", ["content"])
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: ["_id"],
        },
      })
      .sort({ updatedAt: -1 });

    if (!conversation) {
      return res.status(404).json(
        handleGetResponse({
          message: `Conversation not found or user not part of this conversation.`,
          isError: true,
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: `Conversation updated successfully.`,
        data: conversation,
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      genericMessageKey: "conversation",
    });
  }
};

module.exports.conversation_delete = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json(
        handleGetResponse({
          message: "conversationId is required.",
          isError: true,
        })
      );
    }

    const conversation = await Conversation.deleteOne({
      _id: conversationId,
    });

    if (!conversation) {
      return res.status(404).json(
        handleGetResponse({
          message: `Conversation not found or user not part of this conversation.`,
          isError: true,
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: `Conversation deleted successfully.`,
        data: conversation,
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      genericMessageKey: "delete conversation",
    });
  }
};
