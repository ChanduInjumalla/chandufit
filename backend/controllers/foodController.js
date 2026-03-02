const Food = require('../models/Food');

// GET /api/foods?search=chicken&region=Indian
exports.searchFoods = async (req, res) => {
    try {
        const { search, region, limit = 20 } = req.query;
        const query = { isApproved: true };
        if (region) query.region = region;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { teluguName: { $regex: search, $options: 'i' } }
            ];
        }
        const foods = await Food.find(query).limit(Number(limit));
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/foods/:id
exports.getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/foods (admin)
exports.addFood = async (req, res) => {
    try {
        const food = await Food.create({ ...req.body, addedBy: req.user.id });
        res.status(201).json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/foods/regions — list all available regions
exports.getRegions = async (req, res) => {
    res.json(['Indian', 'International', 'Telugu', 'Other']);
};
