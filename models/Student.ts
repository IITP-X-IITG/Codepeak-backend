import { Schema, model } from 'mongoose'

const studentSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	instituteEmail: {
		type: String,
		required: true,
		unique: true,
	},
	phoneno: {
		type: String,
		required: true,
		unique: true,
	},
	organization: {
		type: String,
		required: true,
	},
	githubProfile: {
		type: String,
		required: true,
		unique: true,
	},
	otherProfile: {
		type: String,
		required: true,
		unique: true,
	},
	firstTime: {
		type: Boolean,
		required: true,
	},
})

module.exports = model('Student', studentSchema)
