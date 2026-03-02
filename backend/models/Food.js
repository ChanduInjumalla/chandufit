const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    teluguName: { type: String, default: '' },
    region: {
        type: String,
        enum: ['Indian', 'International', 'Telugu', 'Other'],
        default: 'Indian'
    },
    category: { type: String, default: 'General' }, // e.g. Protein, Carb, Vegetable
    caloriesPer100g: { type: Number, required: true },
    protein: { type: Number, required: true },   // grams per 100g
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

foodSchema.index({ name: 'text', teluguName: 'text' });

module.exports = mongoose.model('Food', foodSchema);
