const express = require('express');
const {
  createWhiteboard,
  getWhiteboards,
  getWhiteboardById,
  updateWhiteboard,
  deleteWhiteboard,
} = require('../controllers/whiteboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createWhiteboard);
router.get('/', getWhiteboards);
router.get('/:roomId', getWhiteboardById);
router.put('/:roomId', updateWhiteboard);
router.delete('/:roomId', deleteWhiteboard);

module.exports = router;
