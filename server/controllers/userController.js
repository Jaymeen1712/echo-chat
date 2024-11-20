const bcrypt = require("bcrypt");
const User = require("../models/user");
const { handleGetResponse } = require("../utils/utils");

const createUser = async (req, res) => {
  try {
    const { email, isActive, name, password, image } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, name, and password are required." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      isActive,
      name,
      password: hashedPassword,
      image,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json(
      handleGetResponse({
        message: "User created successfully",
        data: newUser,
      })
    );
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json(
        handleGetResponse({
          message: "Validation error. Check input data.",
          isError: true,
        })
      );
    }

    // 2. MongoError (e.g., duplicate email error)
    if (error.code === 11000) {
      // 11000 is a MongoDB error code for duplicate key
      return res.status(409).json(
        handleGetResponse({
          message: "User with this email already exists.",
          isError: true,
        })
      );
    }

    // 3. Custom business logic errors
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(
        handleGetResponse({
          message: error.message,
          isError: true,
        })
      );
    }

    // 4. Generic server errors
    return res.status(500).json(
      handleGetResponse({
        message: "Could not create user due to a server error.",
        isError: true,
      })
    );
  }
};

module.exports = {
  createUser,
};
