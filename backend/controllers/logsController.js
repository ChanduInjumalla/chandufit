const DailyLog = require('../models/DailyLog');
const Food = require('../models/Food');

const today = () => new Date().toISOString().split('T')[0];

// GET /api/logs/daily?date=YYYY-MM-DD
exports.getDailyLog = async (req, res) => {
    try {
        const date = req.query.date || today();
        let log = await DailyLog.findOne({ userId: req.user.id, date });
        if (!log) log = { userId: req.user.id, date, entries: [], waterIntake: 0 };
        res.json(log);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/logs/daily — add a food entry
exports.addFoodEntry = async (req, res) => {
    try {
        const { foodId, grams, meal, date } = req.body;
        const d = date || today();
        const food = await Food.findById(foodId);
        if (!food) return res.status(404).json({ message: 'Food not found' });

        const ratio = grams / 100;
        const entry = {
            foodId,
            foodName: food.name,
            grams,
            meal: meal || 'lunch',
            calories: parseFloat((food.caloriesPer100g * ratio).toFixed(1)),
            protein: parseFloat((food.protein * ratio).toFixed(1)),
            carbs: parseFloat((food.carbs * ratio).toFixed(1)),
            fats: parseFloat((food.fats * ratio).toFixed(1))
        };

        let log = await DailyLog.findOne({ userId: req.user.id, date: d });
        if (!log) {
            log = await DailyLog.create({ userId: req.user.id, date: d, entries: [entry] });
        } else {
            log.entries.push(entry);
            await log.save();
        }
        res.json(log);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/logs/daily/:entryId
exports.removeFoodEntry = async (req, res) => {
    try {
        const { date } = req.query;
        const d = date || today();
        const log = await DailyLog.findOne({ userId: req.user.id, date: d });
        if (!log) return res.status(404).json({ message: 'Log not found' });
        log.entries = log.entries.filter(e => e._id.toString() !== req.params.entryId);
        await log.save();
        res.json(log);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/logs/summary?date=YYYY-MM-DD
exports.getDailySummary = async (req, res) => {
    try {
        const date = req.query.date || today();
        const log = await DailyLog.findOne({ userId: req.user.id, date });
        if (!log) {
            return res.json({ calories: 0, protein: 0, carbs: 0, fats: 0, entries: 0 });
        }
        const totals = log.entries.reduce((acc, e) => {
            acc.calories += e.calories || 0;
            acc.protein += e.protein || 0;
            acc.carbs += e.carbs || 0;
            acc.fats += e.fats || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        res.json({ ...totals, entries: log.entries.length, date });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/logs/weekly — last 7 days calorie data
exports.getWeeklySummary = async (req, res) => {
    try {
        const results = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = await DailyLog.findOne({ userId: req.user.id, date: dateStr });
            const calories = log
                ? log.entries.reduce((s, e) => s + (e.calories || 0), 0)
                : 0;
            const protein = log
                ? log.entries.reduce((s, e) => s + (e.protein || 0), 0)
                : 0;
            results.push({ date: dateStr, calories: parseFloat(calories.toFixed(0)), protein: parseFloat(protein.toFixed(0)) });
        }
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
