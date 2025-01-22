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
	password: {
		type: String,
		required: true,
	},
	institute: {
		type: String,
		required: true,
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
	profilePage: {
		type: String,
		required: false,
		sparse: true,
	},
	githubProfile: {
		type: String,
		required: true,
		unique: true,
	},
	gitlabProfile: {
		type: String,
		required: false,
		sparse: true,
	},
	otherProfile: {
		type: String,
		required: false,
		sparse: true,
	},
	firstTime: {
		type: Boolean,
		required: true,
	},
})

module.exports = model('Student', studentSchema)
