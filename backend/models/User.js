const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    dob: { type: Date },

    // Body stats
    height: { type: Number }, // cm
    weight: { type: Number }, // kg
    gender: { type: String, enum: ['male', 'female', 'other'] },
    activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'heavy'],
        default: 'moderate'
    },
    goal: {
        type: String,
        enum: ['fat_loss', 'muscle_gain', 'maintain'],
        default: 'maintain'
    },
    bodyType: {
        type: String,
        enum: ['ectomorph', 'mesomorph', 'endomorph']
    },
    budget: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    // Profile status
    profileComplete: { type: Boolean, default: false },

    // Discipline
    disciplineScore: { type: Number, default: 100 },

    createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
