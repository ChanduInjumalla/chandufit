const Workout = require('../models/Workout');
const WorkoutLog = require('../models/WorkoutLog');

const today = () => new Date().toISOString().split('T')[0];

// GET /api/workouts?muscleGroup=Chest
exports.getWorkouts = async (req, res) => {
    try {
        const { muscleGroup } = req.query;
        const query = muscleGroup ? { muscleGroup } : {};
        const workouts = await Workout.find(query);
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/workouts/log — Log today's workout
exports.logWorkout = async (req, res) => {
    try {
        const { exercises, date } = req.body;
        const d = date || today();

        let log = await WorkoutLog.findOne({ userId: req.user.id, date: d });
        if (!log) {
            log = await WorkoutLog.create({
                userId: req.user.id,
                date: d,
                exercises,
                completedToday: true
            });
        } else {
            if (exercises) log.exercises = exercises;
            log.completedToday = true;
            await log.save();
        }
        res.json(log);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/workouts/log/today
exports.getTodayLog = async (req, res) => {
    try {
        const d = today();
        const log = await WorkoutLog.findOne({ userId: req.user.id, date: d });
        res.json(log || { completedToday: false, exercises: [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/workouts/consistency — last 7 days
exports.getWeeklyConsistency = async (req, res) => {
    try {
        const results = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = await WorkoutLog.findOne({ userId: req.user.id, date: dateStr });
            results.push({ date: dateStr, completed: !!(log && log.completedToday) });
        }
        const completed = results.filter(r => r.completed).length;
        res.json({ data: results, consistency: Math.round((completed / 7) * 100) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
