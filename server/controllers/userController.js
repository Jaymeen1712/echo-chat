const bcrypt = require("bcrypt");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const { handleGetResponse } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const { sendErrors } = require("../utils/getError");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

const createUser = async (req, res) => {
  try {
    const { email, isActive, name, password, image } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, name and password are required." });
    }

    const newUser = new User({
      email,
      isActive,
      name,
      password,
      image,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json(
      handleGetResponse({
        message: "User created successfully",
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      duplicationMessage: "User with this email already exists.",
      genericMessageKey: "create user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json(
        handleGetResponse({
          message: "Email and password are required.",
          isError: true,
        })
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json(
        handleGetResponse({
          message: "Invalid email or password.",
          isError: true,
        })
      );
    }

    // Compare provided password with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json(
        handleGetResponse({
          message: "Invalid password.",
          isError: true,
        })
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    // Send response with the token
    res.status(200).json(
      handleGetResponse({
        message: "Login successful.",
        data: { token },
      })
    );
  } catch (error) {
    console.error("Error logging in user:", error);

    // 1. ValidationError for any validation failures
    if (error.name === "ValidationError") {
      return res.status(400).json(
        handleGetResponse({
          message: "Validation error. Check input data.",
          isError: true,
        })
      );
    }

    // 2. Generic server errors
    return res.status(500).json(
      handleGetResponse({
        message: "Could not log in user due to a server error.",
        isError: true,
      })
    );
  }
};

const getUser = async (req, res) => {
  try {
    const user = req.user;

    const populatedUser = await User.findById(user.userId, "name email image");

    if (!populatedUser) {
      return res.status(404).json(
        handleGetResponse({
          message: "User not found.",
          isError: true,
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: "User data retrieved successfully.",
        data: { user: { ...populatedUser.toObject(), ...user } },
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      handleGetResponse({
        message: "Could not log in user due to a server error.",
        isError: true,
      })
    );
  }
};

const searchUsers_get = async (req, res) => {
  try {
    const { query = "" } = req.body;
    const user = req.user;

    const users = await User.aggregate([
      // Match users whose name matches the query
      {
        $match: {
          name: { $regex: query, $options: "i" },
        },
      },
      // Lookup conversations to check relationships
      {
        $lookup: {
          from: "conversations",
          let: { userId: "$_id", requestingUserId: user._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  // Check if the user ID is a participant in the conversation
                  $and: [
                    { $in: ["$$userId", "$participants"] },
                    { $in: ["$$requestingUserId", "$participants"] },
                  ],
                },
              },
            },
          ],
          as: "userConversations",
        },
      },
      // Filter out users who have conversations with the requesting user
      {
        $match: {
          userConversations: { $size: 0 },
        },
      },
      // Select the desired fields
      {
        $project: {
          name: 1,
          image: 1,
        },
      },
    ]);

    // const users = await User.find({
    //   $or: [
    //     { name: { $regex: query, $options: "i" } },
    //     // { email: { $regex: query, $options: "i" } },
    //   ],
    // }).select(["name", "image"]);

    if (users.length === 0) {
      return res.status(200).json(
        handleGetResponse({
          message: "No users found matching the query.",
          data: { users: [] },
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: "User data fetched successfully.",
        data: { users },
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      handleGetResponse({
        message: "Could not find users due to a server error.",
        isError: true,
      })
    );
  }
};

const updateUser_patch = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const updateData = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "Invalid user ID.",
        data: { user: null },
      });
    }

    await User.findOneAndUpdate({ _id: userId }, updateData);

    const populatedUser = await User.findById(userId, "name email image");

    if (!populatedUser) {
      return res.status(404).json(
        handleGetResponse({
          message: "No user found.",
          data: { users: [] },
        })
      );
    }

    return res.status(200).json(
      handleGetResponse({
        message: "User data updated successfully.",
        data: { user: { ...populatedUser.toObject(), ...req.user } },
      })
    );
  } catch (error) {
    sendErrors({
      res,
      error,
      duplicationMessage: "User already exist",
      genericMessageKey: "update user",
    });
  }
};

const handleDisconnectUser = async (userId) => {
  try {
    if (!userId) {
      return;
    }

    await User.findOneAndUpdate(
      { _id: userId },
      {
        lastActive: Date.now(),
        isActive: false,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const handleConnectUser = async (userId) => {
  try {
    if (!userId) {
      return;
    }

    await User.findOneAndUpdate(
      { _id: userId },
      {
        isActive: true,
      }
    );

    const userObjectId = new ObjectId(userId);

    // Change isDelivered to true on user connection
    // Step 1: Fetch conversation IDs where the user is a participant
    const conversations = await Conversation.aggregate([
      { $match: { participants: userObjectId } },
      { $project: { _id: 1 } },
    ]);

    const conversationIds = conversations.map((conv) => conv._id);

    // Step 2: Update messages in those conversations
    await Message.updateMany(
      {
        conversation: { $in: conversationIds },
        isDelivered: false,
      },
      { $set: { isDelivered: true } }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  searchUsers_get,
  updateUser_patch,
  handleDisconnectUser,
  handleConnectUser,
};
