/* eslint-disable */
import { Request, Response } from 'express'
const express = require('express')
const Student = require('../../models/Student')
const Mentor = require('../../models/Mentor')
import * as argon2 from 'argon2'
const router = express.Router()
import { body, validationResult } from 'express-validator'
import { generateToken } from '../utils/jwt'

// @route   POST /api/register/student
// @desc    Register student
// @access  Public
// @body    firstname, lastname, email, instituteEmail, phoneno, organization, githubProfile, otherProfile, firstTime
// @return  JSON object
router.post(
	'/student',
	body('firstname').isLength({ min: 1 }).withMessage('Name is required'),
	body('firstname').trim().isAlpha().withMessage('First name must contain only letters'),
	body('lastname').trim().isAlpha().withMessage('Last name must contain only letters'),
	body('email').isLength({ min: 1 }).withMessage('Email is required'),
	body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
	body('password').isLength({ min: 1 }).withMessage('Password is required'),
	body('institute').isLength({ min: 1 }).withMessage('Institute is required'),
	body('phoneno').isLength({ min: 1 }).withMessage('Phone Number is required'),
	body('phoneno')
		.matches(/^[0-9]{10}$/)
		.withMessage('Phone number must be 10 digits'),
	body('githubProfile').isLength({ min: 1 }).withMessage('Github Profile is required'),
	body('firstTime').isLength({ min: 1 }).withMessage('First Time is required'),
	async (
		req: {
			body: {
				firstname: any
				lastname: any
				email: any
				password: any
				institute: any
				instituteEmail: any | undefined
				phoneno: number
				profilePage: any
				gitlabProfile: any
				githubProfile: any
				otherProfile: any
				firstTime: any
			}
		},
		res: Response
	) => {
		const errors = validationResult(req)
		// if (true) {
		// 	return res.status(400).json({ error: "Student registration is disabled for now" })
		// }
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() })
		}

		try {
			const {
				firstname,
				lastname,
				email,
				password,
				institute,
				phoneno,
				profilePage,
				gitlabProfile,
				githubProfile,
				otherProfile,
				firstTime,
			} = req.body
			const password_hash = await argon2.hash(password)
			const student: typeof Student = {
				firstname,
				lastname,
				email,
				password: password_hash,
				institute,
				phoneno,
				profilePage,
				gitlabProfile,
				githubProfile,
				otherProfile,
				firstTime,
			}
			if (req.body.instituteEmail !== undefined) {
				student.instituteEmail = req.body.instituteEmail
			}
			let user = new Student(student)
			const token = generateToken({ email: email })
			console.log(token)
			await user.save()

			res.cookie('token', token)
			res.status(200).json({ message: 'User created successfully' })
		} catch (err: any) {
			res.status(500).json({ error: err.message })
		}
	}
)

// @route   POST /api/register/mentor
// @desc    Register mentor
// @access  Public
// @body    firstname, lastname, email, phoneno, organization, githubProfile, otherProfile, firstTime, willReview, projectLinks
// @return  JSON object
router.post(
	'/mentor',
	body('firstname').isLength({ min: 1 }).withMessage('Name is required'),
	body('firstname').trim().isAlpha().withMessage('First name must contain only letters'),
	body('lastname').trim().isAlpha().withMessage('Last name must contain only letters'),
	body('email').isLength({ min: 1 }).withMessage('Email is required'),
	body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
	body('phoneno').isLength({ min: 1 }).withMessage('Phone Number is required'),
	body('phoneno')
		.matches(/^[0-9]{10}$/)
		.withMessage('Phone number must be 10 digits'),
	body('organization').isLength({ min: 1 }).withMessage('Organization is required'),
	body('githubProfile').isLength({ min: 1 }).withMessage('Github Profile is required'),
	body('otherProfile').isLength({ min: 1 }).withMessage('Other Profile is required'),
	body('projectList').isLength({ min: 1 }).withMessage('Project List is required'),
	body('firstTime').isLength({ min: 1 }).withMessage('First Time is required'),
	body('willReview').isLength({ min: 1 }).withMessage('Will Review is required'),
	async (
		req: {
			body: {
				firstname: any
				lastname: any
				email: any
				password: any
				phoneno: number
				organization: any
				githubProfile: any
				gitlabProfile: any
				otherProfile: any
				projectList: any
				projectDetails: any | undefined
				firstTime: any
				willReview: any
			}
		},
		res: {
			status: (arg0: number) => {
				(): any
				new (): any
				json: { (arg0: { error?: any; message?: any }): void; new (): any }
			}
		}
	) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() })
		}

		try {
			const {
				firstname,
				lastname,
				email,
				password,
				phoneno,
				organization,
				githubProfile,
				gitlabProfile,
				otherProfile,
				projectList,
				firstTime,
				willReview,
			} = req.body
			const password_hash = await argon2.hash(password)
			const mentor: typeof Mentor = {
				firstname,
				lastname,
				email,
				password: password_hash,
				phoneno,
				organization,
				githubProfile,
				gitlabProfile,
				otherProfile,
				projectList,
				firstTime,
				willReview,
			}
			if (req.body.projectDetails !== undefined) {
				mentor.projectDetails = req.body.projectDetails
			}

			let user = new Mentor(mentor)
			await user.save()
			res.status(200).json({ message: 'User created successfully' })
		} catch (err: any) {
			res.status(500).json({ error: err.message })
		}
	}
)

module.exports = router
