const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    activeUsers: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        username: String,
        cursorX: Number,
        cursorY: Number,
        color: String,
        socketId: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// TTL Index - Delete inactive sessions after 24 hours
sessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Session', sessionSchema);
