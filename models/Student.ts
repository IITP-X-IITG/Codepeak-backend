import { Schema, model } from 'mongoose'

const studentSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	institute: {
		type: String,
		required: true,
	},
	phoneno: {
		type: String,
		required: true,
		unique: true,
	},
	profilePage: {
		type: String,
		required: false,
		unique: true,
	},
	githubProfile: {
		type: String,
		required: true,
		unique: true,
	},
	gitlabProfile: {
		type: String,
		required: false,
		unique: true,
	},
	otherProfile: {
		type: String,
		required: false,
		unique: true,
	},
	firstTime: {
		type: Boolean,
		required: true,
	},
})

module.exports = model('Student', studentSchema)
