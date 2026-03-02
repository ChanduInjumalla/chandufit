const router = require('express').Router();
const { getScore, recalculate, resetScore } = require('../controllers/disciplineController');
const auth = require('../middleware/auth');

router.get('/score', auth, getScore);
router.post('/recalculate', auth, recalculate);
router.post('/reset', auth, resetScore);

module.exports = router;
