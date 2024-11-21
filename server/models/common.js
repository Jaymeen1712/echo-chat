const typingSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isTyping: { type: Boolean, default: false },
});

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Typing", typingSchema);
module.exports = mongoose.model("Notification", notificationSchema);
