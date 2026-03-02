const router = require('express').Router();
const { searchFoods, getFoodById, addFood, getRegions } = require('../controllers/foodController');
const auth = require('../middleware/auth');

router.get('/', auth, searchFoods);
router.get('/regions', getRegions);
router.get('/:id', auth, getFoodById);
router.post('/', auth, addFood);

module.exports = router;
