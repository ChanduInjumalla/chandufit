const router = require('express').Router();
const { updateProfile, getMetrics, getDietPlan, getWeightHistory, logWeight } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.put('/profile', auth, updateProfile);
router.get('/metrics', auth, getMetrics);
router.get('/diet-plan', auth, getDietPlan);
router.get('/weight-history', auth, getWeightHistory);
router.post('/weight', auth, logWeight);

module.exports = router;
