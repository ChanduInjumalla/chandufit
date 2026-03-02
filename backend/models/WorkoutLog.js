const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    exercises: [{
        workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
        workoutName: { type: String },
        muscleGroup: { type: String },
        sets: [{ reps: Number, weight: Number }]
    }],
    weeklyPlan: {
        Monday: [String],
        Tuesday: [String],
        Wednesday: [String],
        Thursday: [String],
        Friday: [String],
        Saturday: [String],
        Sunday: [String]
    },
    completedToday: { type: Boolean, default: false }
}, { timestamps: true });

workoutLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
