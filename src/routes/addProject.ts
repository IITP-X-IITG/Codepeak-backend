/* eslint-disable */
const express = require('express')
const Project = require('../../models/Project')
const router = express.Router()
import { body, validationResult } from 'express-validator'

// @route   POST /api/add-project
// @desc    Add project
// @access  Public
// @body    title, description, tags, mentor, mentorGithub, languages, githubLink, image, sponsored, year
router.post(
	'/',
	body('title').isString(),
	body('description').isString(),
	body('tags').isArray(),
	body('mentor').isString(),
	body('mentorGithub').isString(),
	body('languages').isArray(),
	body('githubLink').isString(),
	body('image').isString(),
	body('sponsored').isBoolean(),
	body('year').isNumeric(),
	async (
		req: {
			body: {
				title: string
				description: string
				tags: string[]
				mentor: string
				mentorGithub: string
				languages: string[]
				githubLink: string
				image: string | undefined
				sponsored: boolean
				year: number
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
			// check if project already exists
			let project = await Project.findOne({ githubLink: req.body.githubLink })
			if (project) {
				return res.status(400).json({ error: { msg: 'Project already exists' } })
			}

			const newProject = new Project(req.body)
			await newProject.save()
			res.status(200).json({ message: 'Project added successfully' })
		} catch (err: any) {
			console.error(err.message)
			res.status(500).json({ error: 'Server Error' })
		}
	}
)

module.exports = router
