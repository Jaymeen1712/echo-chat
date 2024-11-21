const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/],
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

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
