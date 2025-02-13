import { Schema, model } from 'mongoose'

const mentorSchema = new Schema({
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
	password: {
		type: String,
		required: true,
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
	projectList: {
		type: String,
		required: true,
	},
	projectDetails: {
		type: String,
		required: false,
	},
	willReview: {
		type: String,
		required: true,
	},
	firstTime: {
		type: Boolean,
		required: true,
	},
})

module.exports = model('Mentor', mentorSchema)
