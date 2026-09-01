const express = require('express');
const { joinRoom, leaveRoom } = require('../controllers/roomController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/:roomId/join', joinRoom);
router.post('/:roomId/leave', leaveRoom);

module.exports = router;
