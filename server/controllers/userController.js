const bcrypt = require("bcrypt");
const User = require("../models/user");

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
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Could not create user." });
  }
};

module.exports = {
  createUser,
};
