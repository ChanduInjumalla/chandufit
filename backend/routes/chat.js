const router = require('express').Router();
const auth = require('../middleware/auth');
const { chat, clearChat } = require('../controllers/chatController');

router.post('/', auth, chat);
router.delete('/clear', auth, clearChat);

module.exports = router;
