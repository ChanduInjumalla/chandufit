const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    muscleGroup: {
        type: String,
        enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'],
        required: true
    },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    equipment: { type: String, default: 'Bodyweight' },
    instructions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
