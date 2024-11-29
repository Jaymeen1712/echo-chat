const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: false },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    files: [
      {
        data: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number, required: false },
      },
    ],
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
