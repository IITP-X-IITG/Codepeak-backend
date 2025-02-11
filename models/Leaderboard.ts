import { Schema, model } from 'mongoose'

const leaderboardSchema = new Schema({
    student: {
        type: String,
        required: true,
        unique: true,  // Ensure each student appears only once
    },
    points: {
        type: Number,
        required: true,
        default: 0,    // Start with 0 points
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
});

// Add index for faster sorting
leaderboardSchema.index({ points: -1 });

module.exports = model('leaderboard', leaderboardSchema)
