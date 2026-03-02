const User = require('../models/User');
const DailyLog = require('../models/DailyLog');
const WorkoutLog = require('../models/WorkoutLog');
const { calculateMacros, calculateBMR, calculateTDEE, calculateTargetCalories, getAge } = require('../utils/calculations');

const yesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
};

const RULES = [
    { id: 'no_workout', deduction: 10, message: '🚨 No workout logged yesterday! You owe 20 push-ups right now.' },
    { id: 'low_protein', deduction: 8, message: '⚠️ Protein below 70% yesterday. Eat 2 eggs or a protein shake immediately.' },
    { id: 'calorie_overshoot', deduction: 5, message: '🔴 Calories overshot target yesterday. Cut 100 kcal from today\'s carbs.' }
];

// GET /api/discipline/score
exports.getScore = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const violations = await checkViolations(user);
        res.json({
            score: user.disciplineScore,
            violations,
            status: user.disciplineScore >= 80 ? 'GOOD' : user.disciplineScore >= 60 ? 'WARNING' : 'DANGER',
            punishments: violations.map(v => RULES.find(r => r.id === v)?.message).filter(Boolean)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/discipline/recalculate — run nightly check
exports.recalculate = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const violations = await checkViolations(user);

        let deduction = 0;
        for (const v of violations) {
            const rule = RULES.find(r => r.id === v);
            if (rule) deduction += rule.deduction;
        }

        const newScore = Math.max(0, Math.min(100, user.disciplineScore - deduction));
        user.disciplineScore = newScore;
        await user.save();

        res.json({
            score: newScore,
            deducted: deduction,
            violations,
            punishments: violations.map(v => RULES.find(r => r.id === v)?.message).filter(Boolean)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/discipline/reset — reset to 100
exports.resetScore = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { disciplineScore: 100 });
        res.json({ score: 100, message: 'Score reset to 100. Fresh start! 🔥' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function checkViolations(user) {
    const violations = [];
    const date = yesterday();

    // Check workout
    const workoutLog = await WorkoutLog.findOne({ userId: user._id, date });
    if (!workoutLog || !workoutLog.completedToday) violations.push('no_workout');

    // Check protein
    const foodLog = await DailyLog.findOne({ userId: user._id, date });
    if (user.weight) {
        const age = user.dob ? getAge(user.dob) : 25;
        const bmr = calculateBMR(user.weight, user.height || 170, age, user.gender || 'male');
        const tdee = calculateTDEE(bmr, user.activityLevel || 'moderate');
        const targetCals = calculateTargetCalories(tdee, user.goal || 'maintain');
        const macros = calculateMacros(user.weight, targetCals);

        if (foodLog) {
            const totalProtein = foodLog.entries.reduce((s, e) => s + (e.protein || 0), 0);
            const totalCalories = foodLog.entries.reduce((s, e) => s + (e.calories || 0), 0);
            if (totalProtein < macros.protein * 0.7) violations.push('low_protein');
            if (totalCalories > targetCals * 1.1) violations.push('calorie_overshoot');
        } else {
            violations.push('low_protein');
        }
    }

    return violations;
}
