const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    entries: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        foodName: { type: String },
        grams: { type: Number, required: true, min: 1 },
        meal: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], default: 'lunch' },
        calories: { type: Number },
        protein: { type: Number },
        carbs: { type: Number },
        fats: { type: Number }
    }],
    waterIntake: { type: Number, default: 0 }, // litres
    notes: { type: String, default: '' }
}, { timestamps: true });

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
