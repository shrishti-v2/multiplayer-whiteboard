const Whiteboard = require('../models/Whiteboard');

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req;

    const whiteboard = await Whiteboard.findOne({ roomId });

    if (!whiteboard) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Add user to participants if not already added
    if (!whiteboard.participants.includes(userId)) {
      whiteboard.participants.push(userId);
      await whiteboard.save();
    }

    res.status(200).json({
      message: 'Joined room successfully',
      whiteboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req;

    const whiteboard = await Whiteboard.findOne({ roomId });

    if (!whiteboard) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Remove user from participants
    whiteboard.participants = whiteboard.participants.filter(
      (id) => id.toString() !== userId.toString()
    );
    await whiteboard.save();

    res.status(200).json({
      message: 'Left room successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { joinRoom, leaveRoom };
