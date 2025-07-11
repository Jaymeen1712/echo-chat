const mongoose = require("mongoose");

/**
 * Database optimization utilities
 */

// Create indexes for better query performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // User collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ name: 1 });
    await db.collection('users').createIndex({ isActive: 1 });
    await db.collection('users').createIndex({ lastActive: -1 });
    
    // Conversation collection indexes
    await db.collection('conversations').createIndex({ participants: 1 });
    await db.collection('conversations').createIndex({ participantsKey: 1 }, { unique: true });
    await db.collection('conversations').createIndex({ updatedAt: -1 });
    await db.collection('conversations').createIndex({ lastMessage: 1 });
    
    // Message collection indexes
    await db.collection('messages').createIndex({ conversation: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ sender: 1 });
    await db.collection('messages').createIndex({ createdAt: -1 });
    await db.collection('messages').createIndex({ seenBy: 1 });
    await db.collection('messages').createIndex({ 
      conversation: 1, 
      isSeen: 1, 
      isDelivered: 1 
    });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
  }
};

// Aggregation pipeline for optimized conversation queries
const getConversationsAggregation = (userId, limit = 20, skip = 0) => {
  return [
    // Match conversations where user is a participant
    {
      $match: {
        participants: new mongoose.Types.ObjectId(userId),
        isGroup: false
      }
    },
    
    // Lookup last message
    {
      $lookup: {
        from: 'messages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessageData'
      }
    },
    
    // Lookup participants data
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participantsData',
        pipeline: [
          {
            $project: {
              name: 1,
              image: 1,
              isActive: 1,
              lastActive: 1
            }
          }
        ]
      }
    },
    
    // Count unread messages
    {
      $lookup: {
        from: 'messages',
        let: { conversationId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$conversation', '$$conversationId'] },
                  { $ne: ['$sender', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isSeen', false] }
                ]
              }
            }
          },
          { $count: 'unreadCount' }
        ],
        as: 'unreadMessages'
      }
    },
    
    // Add computed fields
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ['$lastMessageData', 0] },
        unreadMessagesCount: {
          $ifNull: [{ $arrayElemAt: ['$unreadMessages.unreadCount', 0] }, 0]
        }
      }
    },
    
    // Sort by last activity
    { $sort: { updatedAt: -1 } },
    
    // Pagination
    { $skip: skip },
    { $limit: limit },
    
    // Final projection
    {
      $project: {
        participants: '$participantsData',
        participantsKey: 1,
        lastMessage: 1,
        isGroup: 1,
        groupName: 1,
        groupImage: 1,
        unreadMessagesCount: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ];
};

// Optimized message aggregation with pagination
const getMessagesAggregation = (conversationId, limit = 50, skip = 0) => {
  return [
    // Match messages for conversation
    {
      $match: {
        conversation: new mongoose.Types.ObjectId(conversationId)
      }
    },
    
    // Lookup sender data
    {
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'sender',
        pipeline: [
          {
            $project: {
              name: 1,
              image: 1
            }
          }
        ]
      }
    },
    
    // Flatten sender array
    {
      $addFields: {
        sender: { $arrayElemAt: ['$sender', 0] }
      }
    },
    
    // Sort by creation date (newest first for pagination, will reverse in app)
    { $sort: { createdAt: -1 } },
    
    // Pagination
    { $skip: skip },
    { $limit: limit }
  ];
};

// Bulk update operations for better performance
const bulkUpdateMessageStatus = async (conversationId, userId, status) => {
  const Message = mongoose.model('Message');
  
  const bulkOps = [];
  
  if (status === 'seen') {
    bulkOps.push({
      updateMany: {
        filter: {
          conversation: conversationId,
          sender: { $ne: userId },
          isSeen: false
        },
        update: {
          $set: { isSeen: true },
          $addToSet: { seenBy: userId }
        }
      }
    });
  } else if (status === 'delivered') {
    bulkOps.push({
      updateMany: {
        filter: {
          conversation: conversationId,
          sender: { $ne: userId },
          isDelivered: false
        },
        update: {
          $set: { isDelivered: true }
        }
      }
    });
  }
  
  if (bulkOps.length > 0) {
    return await Message.bulkWrite(bulkOps);
  }
  
  return null;
};

// Connection pool monitoring
const monitorConnectionPool = () => {
  const db = mongoose.connection;
  
  setInterval(() => {
    const stats = {
      readyState: db.readyState,
      host: db.host,
      port: db.port,
      name: db.name
    };
    
    console.log('DB Connection Stats:', stats);
  }, 60000); // Log every minute
};

// Memory usage monitoring
const monitorMemoryUsage = () => {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    const formatBytes = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
    
    console.log('Memory Usage:', {
      rss: `${formatBytes(memUsage.rss)} MB`,
      heapTotal: `${formatBytes(memUsage.heapTotal)} MB`,
      heapUsed: `${formatBytes(memUsage.heapUsed)} MB`,
      external: `${formatBytes(memUsage.external)} MB`
    });
  }, 300000); // Log every 5 minutes
};

module.exports = {
  createIndexes,
  getConversationsAggregation,
  getMessagesAggregation,
  bulkUpdateMessageStatus,
  monitorConnectionPool,
  monitorMemoryUsage
};
