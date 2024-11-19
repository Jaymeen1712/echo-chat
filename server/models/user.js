const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      unique: true, // Ensures emails are unique
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    image: {
      type: String, // URL of the user's profile image
      required: false,
    },
    password: {
      type: String,
      required: true, // Password hash for authentication
    },
    isActive: {
      type: Boolean,
      default: true, // Indicates if the user account is active
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("User", userSchema);
