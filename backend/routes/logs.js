const router = require('express').Router();
const { getDailyLog, addFoodEntry, removeFoodEntry, getDailySummary, getWeeklySummary } = require('../controllers/logsController');
const auth = require('../middleware/auth');

router.get('/daily', auth, getDailyLog);
router.post('/daily', auth, addFoodEntry);
router.delete('/daily/:entryId', auth, removeFoodEntry);
router.get('/summary', auth, getDailySummary);
router.get('/weekly', auth, getWeeklySummary);

module.exports = router;
