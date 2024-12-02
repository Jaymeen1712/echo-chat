const bcrypt = require("bcrypt");
const User = require("../models/user");
const { handleGetResponse } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const { sendErrors } = require("../utils/getError");

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

    const users = await User.aggregate([
      {
        $match: {
          name: { $regex: query, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "conversations",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$userId", "$participants"],
                },
              },
            },
          ],
          as: "userConversations",
        },
      },
      {
        $match: {
          userConversations: { $size: 0 },
        },
      },
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

module.exports = {
  createUser,
  loginUser,
  getUser,
  searchUsers_get,
};
