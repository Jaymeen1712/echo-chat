const { ObjectId } = require("mongodb");
const Conversation = require("../models/conversation");
const { sendErrors } = require("../utils/getError");
const {
  getUniqueConversationParticipantsKey,
} = require("../utils/uniqueConversationKey");
const { handleGetResponse } = require("../utils/utils");
const Message = require("../models/message");

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

    // const conversations = await Conversation.find(
    //   {
    //     participants: userId,
    //   },
    //   {
    //     createdAt: true,
    //     updatedAt: true,
    //   }
    // )
    //   .populate("participants", ["name", "image", "isActive", "lastActive"])
    //   .populate("lastMessage", ["content"])
    //   .populate({
    //     path: "lastMessage",
    //     populate: {
    //       path: "sender",
    //       select: ["_id"],
    //     },
    //   })
    //   .sort({ updatedAt: -1 });

    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: userId, // Match conversations that include the user
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
                    { $ne: ["$sender", userId] }, // Exclude messages sent by the user
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
      { $sort: { updatedAt: -1 } },
    ]);

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
      .populate("participants", ["name", "image", "isActive", "lastActive"])
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

module.exports.getFilesCount_post = async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json(
        handleGetResponse({
          message: "Conversation ID is required.",
          isError: true,
        })
      );
    }

    const conversation = new ObjectId(conversationId);

    // Build the pipeline
    const pipeline = [
      {
        $match: {
          conversation,
        },
      },
      { $unwind: "$files" }, // Decompose the files array into individual documents
      {
        $facet: {
          images: [
            { $match: { "files.type": { $regex: "^image/" } } },
            { $count: "count" },
          ],
          documents: [
            { $match: { "files.type": { $regex: "^application/" } } },
            { $count: "count" },
          ],
          audio_files: [
            { $match: { "files.type": { $regex: "^audio/" } } },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          images: { $arrayElemAt: ["$images.count", 0] },
          documents: { $arrayElemAt: ["$documents.count", 0] },
          audio_files: { $arrayElemAt: ["$audio_files.count", 0] },
        },
      },
      {
        $addFields: {
          images: { $ifNull: ["$images", 0] },
          documents: { $ifNull: ["$documents", 0] },
          audio_files: { $ifNull: ["$audio_files", 0] },
        },
      },
    ];

    // Execute the aggregation
    const result = await Message.aggregate(pipeline);

    // Return the result or an empty object if no files found
    return res.json(result[0] || { images: 0, documents: 0, audio_files: 0 });
  } catch (error) {
    sendErrors({
      res,
      error,
      genericMessageKey: "get files count",
    });
  }
};

module.exports.getAllFiles_post = async (req, res) => {
  try {
    const { conversationId, files, limit } = req.body;

    // Validate input
    if (
      !conversationId ||
      !files ||
      !Array.isArray(files) ||
      files.length === 0
    ) {
      return res.status(400).json(
        handleGetResponse({
          message: "Conversation ID and at least one file type are required.",
          isError: true,
        })
      );
    }

    const fileTypeMapping = {
      image: "^image/",
      document: "^application/",
      audio: "^audio/",
    };

    // Validate file types
    const invalidFileTypes = files.filter((file) => !fileTypeMapping[file]);
    if (invalidFileTypes.length > 0) {
      return res.status(400).json(
        handleGetResponse({
          message: `Invalid file type(s): ${invalidFileTypes.join(
            ", "
          )}. Allowed types: image, document, audio.`,
          isError: true,
        })
      );
    }

    const conversation = new ObjectId(conversationId);

    // Build the $match stage to filter by file types dynamically
    const fileMatchConditions = files.map((file) => ({
      "files.type": { $regex: fileTypeMapping[file] },
    }));

    const pipeline = [
      {
        $match: {
          conversation,
        },
      },
      { $unwind: "$files" }, // Decompose the files array into individual documents
      {
        $match: {
          $or: fileMatchConditions, // Match any of the file types in the array
        },
      },
      {
        $group: {
          _id: "$files.type", // Group by file type (assuming files have a 'type' field)
          files: { $push: { messageId: "$_id", file: "$files" } }, // Collect matching files with messageId
        },
      },
    ];

    // Apply the limit if it's provided
    if (limit) {
      const limitNumber = parseInt(limit, 10);
      if (isNaN(limitNumber) || limitNumber <= 0) {
        return res.status(400).json(
          handleGetResponse({
            message: "Invalid limit value.",
            isError: true,
          })
        );
      }

      pipeline.push({
        $project: {
          _id: 1,
          files: { $slice: ["$files", limitNumber] }, // Limit the number of files per type
        },
      });
    }

    // Flatten the grouped results back into a single array
    pipeline.push({
      $unwind: "$files", // Break down the limited files array back into individual documents
    });

    pipeline.push({
      $replaceRoot: {
        newRoot: "$files", // Replace the root document with the file information
      },
    });

    // Run the aggregation pipeline
    const result = await Message.aggregate(pipeline);

    // Group the result by file type
    const groupedResult = result.reduce((acc, { file, messageId }) => {
      const fileType = file.type.split("/")[0]; // Get the file type from the MIME type (image, audio, document)
      if (!acc[fileType]) {
        acc[fileType] = [];
      }
      acc[fileType].push({ messageId, file });
      return acc;
    }, {});

    return res.status(200).json(
      handleGetResponse({
        message: "Files retrieved successfully.",
        data: groupedResult,
      })
    );
  } catch (error) {
    // Handle errors
    sendErrors({
      res,
      error,
      genericMessageKey: "get files",
    });
  }
};
