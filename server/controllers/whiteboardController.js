const Whiteboard = require('../models/Whiteboard');
const Session = require('../models/Session');

const createWhiteboard = async (req, res) => {
  try {
    const { title, isPublic } = req.body;
    const roomId = require('crypto').randomBytes(16).toString('hex');

    const whiteboard = await Whiteboard.create({
      roomId,
      title: title || 'Untitled Whiteboard',
      createdBy: req.userId,
      participants: [req.userId],
      isPublic: isPublic || false,
    });

    res.status(201).json({
      message: 'Whiteboard created successfully',
      whiteboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWhiteboards = async (req, res) => {
  try {
    const whiteboards = await Whiteboard.find({
      $or: [{ createdBy: req.userId }, { participants: req.userId }],
    }).populate('createdBy', 'username email');

    res.status(200).json({
      whiteboards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWhiteboardById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const whiteboard = await Whiteboard.findOne({ roomId }).populate('createdBy participants', 'username email');

    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }

    res.status(200).json({
      whiteboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWhiteboard = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, isPublic } = req.body;

    const whiteboard = await Whiteboard.findOneAndUpdate(
      { roomId },
      { title, isPublic },
      { new: true }
    );

    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }

    res.status(200).json({
      message: 'Whiteboard updated successfully',
      whiteboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWhiteboard = async (req, res) => {
  try {
    const { roomId } = req.params;

    const whiteboard = await Whiteboard.findOneAndDelete({ roomId });

    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }

    res.status(200).json({
      message: 'Whiteboard deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWhiteboard,
  getWhiteboards,
  getWhiteboardById,
  updateWhiteboard,
  deleteWhiteboard,
};
