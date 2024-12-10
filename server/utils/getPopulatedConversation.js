const Conversation = require("../models/conversation");
const { ObjectId } = require("mongodb");

const getPopulatedConversation = async (_id, userId) => {
  const userObjectId = new ObjectId(userId);
  const conversationObjectId = new ObjectId(_id);

  const conversation = await Conversation.aggregate([
    {
      $match: {
        _id: conversationObjectId, // Match conversations that include the user
      },
    },
    {
      $lookup: {
        from: "messages", // Reference the "messages" collection
        let: { conversationId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$conversation", "$$conversationId"] }, // Match messages in the conversation
                  { $eq: ["$isSeen", false] }, // Only count unseen messages
                  { $ne: ["$sender", userObjectId] },
                ],
              },
            },
          },
          { $count: "unreadCount" }, // Count the number of unseen messages
        ],
        as: "unreadMessages",
      },
    },
    {
      $addFields: {
        unreadMessagesCount: {
          $ifNull: [{ $arrayElemAt: ["$unreadMessages.unreadCount", 0] }, 0], // Set unread count or 0 if none
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessageDetails",
      },
    },
    {
      $unwind: {
        path: "$lastMessageDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "lastMessageDetails.sender",
        foreignField: "_id",
        as: "lastMessageDetails.senderDetails",
      },
    },
    {
      $project: {
        participants: {
          _id: 1,
          name: 1,
          image: 1,
          isActive: 1,
          lastActive: 1,
        },
        lastMessage: {
          $mergeObjects: [
            "$lastMessageDetails",
            {
              sender: {
                $arrayElemAt: ["$lastMessageDetails.senderDetails", 0],
              },
            },
          ],
        },
        unreadMessagesCount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!conversation.length === 0) {
    return;
  }

  return conversation[0];
};

module.exports = { getPopulatedConversation };
