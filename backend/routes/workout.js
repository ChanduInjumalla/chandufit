const router = require('express').Router();
const { getWorkouts, logWorkout, getTodayLog, getWeeklyConsistency } = require('../controllers/workoutController');
const auth = require('../middleware/auth');

router.get('/', auth, getWorkouts);
router.get('/log/today', auth, getTodayLog);
router.get('/consistency', auth, getWeeklyConsistency);
router.post('/log', auth, logWorkout);

module.exports = router;
