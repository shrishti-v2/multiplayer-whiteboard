const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: 'Untitled Whiteboard',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    canvas: {
      width: {
        type: Number,
        default: 1200,
      },
      height: {
        type: Number,
        default: 700,
      },
      backgroundColor: {
        type: String,
        default: '#ffffff',
      },
    },
    thumbnail: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Whiteboard', whiteboardSchema);
