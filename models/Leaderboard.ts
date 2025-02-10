import { Schema, model } from 'mongoose'

const leaderboardSchema = new Schema({
	student: {
		type: String,
		required: true,
	},
	points: {
		type: Number,
		required: true,
	},
})
module.exports = model('leaderboard', leaderboardSchema)
