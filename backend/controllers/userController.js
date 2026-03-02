const User = require('../models/User');
const WeightLog = require('../models/WeightLog');
const {
    calculateBMI, calculateBMR, calculateTDEE,
    calculateTargetCalories, calculateMacros, getAge, estimateBodyFat, generateDietPlan
} = require('../utils/calculations');

// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
    try {
        const { height, weight, gender, activityLevel, goal, bodyType, budget, dob } = req.body;
        const updates = {};
        if (height) updates.height = height;
        if (weight) updates.weight = weight;
        if (gender) updates.gender = gender;
        if (activityLevel) updates.activityLevel = activityLevel;
        if (goal) updates.goal = goal;
        if (bodyType) updates.bodyType = bodyType;
        if (budget) updates.budget = budget;
        if (dob) updates.dob = dob;
        updates.profileComplete = true;

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');

        // Log weight
        if (weight) {
            const today = new Date().toISOString().split('T')[0];
            await WeightLog.findOneAndUpdate(
                { userId: req.user.id, date: today },
                { weight },
                { upsert: true, new: true }
            );
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/user/metrics
exports.getMetrics = async (req, res) => {
    try {
        const user = req.user;
        if (!user.height || !user.weight || !user.gender) {
            return res.status(400).json({ message: 'Please complete your profile first' });
        }
        const age = user.dob ? getAge(user.dob) : 25;
        const { bmi, category: bmiCategory } = calculateBMI(user.weight, user.height);
        const bmr = calculateBMR(user.weight, user.height, age, user.gender);
        const tdee = calculateTDEE(bmr, user.activityLevel);
        const targetCalories = calculateTargetCalories(tdee, user.goal);
        const macros = calculateMacros(user.weight, targetCalories);
        const bodyFat = estimateBodyFat(bmi, age, user.gender);

        res.json({
            bmi, bmiCategory, bmr, tdee, targetCalories, macros, bodyFat, age,
            weight: user.weight, height: user.height, goal: user.goal,
            activityLevel: user.activityLevel
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/user/diet-plan
exports.getDietPlan = async (req, res) => {
    try {
        const user = req.user;
        if (!user.weight || !user.goal) return res.status(400).json({ message: 'Complete profile first' });
        const age = user.dob ? getAge(user.dob) : 25;
        const bmr = calculateBMR(user.weight, user.height || 170, age, user.gender || 'male');
        const tdee = calculateTDEE(bmr, user.activityLevel);
        const targetCalories = calculateTargetCalories(tdee, user.goal);
        const macros = calculateMacros(user.weight, targetCalories);
        const plan = generateDietPlan(user.weight, user.goal, user.budget || 'medium', targetCalories, macros);
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/user/weight-history
exports.getWeightHistory = async (req, res) => {
    try {
        const logs = await WeightLog.find({ userId: req.user.id }).sort({ date: 1 }).limit(90);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/user/weight
exports.logWeight = async (req, res) => {
    try {
        const { weight, date } = req.body;
        const d = date || new Date().toISOString().split('T')[0];
        const log = await WeightLog.findOneAndUpdate(
            { userId: req.user.id, date: d },
            { weight },
            { upsert: true, new: true }
        );
        // Also update user current weight
        await User.findByIdAndUpdate(req.user.id, { weight });
        res.json(log);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
