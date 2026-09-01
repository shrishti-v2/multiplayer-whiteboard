const mongoose = require('mongoose');

const drawingActionSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: {
        type: String,
        enum: ['draw', 'shape', 'erase', 'clear', 'undo', 'redo'],
        required: true,
      },
      tool: String,
      points: [Object],
      startPos: Object,
      endPos: Object,
      color: String,
      size: Number,
      opacity: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// TTL Index - Delete old actions after 30 days
drawingActionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('DrawingAction', drawingActionSchema);
