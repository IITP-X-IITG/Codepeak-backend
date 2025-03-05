/* eslint-disable */
const express = require('express')
const Project = require('../../models/Project')
const Transaction = require('../../models/Transactions')
const Leaderboard = require('../../models/Leaderboard')
const router = express.Router()
import { body, validationResult } from 'express-validator'
import { authorization, mentorAuthorization } from '../service/auth'


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

router.post(
	'/update',authorization,mentorAuthorization,
	body('title').isString(),
	body('description').isString(),
	body('tags').isArray(),
	body('languages').isArray(),
	body('githubLink').isString(),
	async (
		req: {
			body: {
				title: string
				description: string
				tags: string[]
				languages: string[]
				githubLink: string
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
			// check if project exists
			let project = await Project.findOne({ githubLink: req.body.githubLink })
			if (!project) {
				return res.status(404).json({ error: { msg: 'Project not found' } })
			}

			// Update the project
			const updateResult = await Project.findOneAndUpdate(
				{ githubLink: req.body.githubLink },
				{
					$set: {
						title: req.body.title,
						description: req.body.description,
						tags: req.body.tags,
						languages: req.body.languages,
					}
				},
				{ new: true } // Return the updated document
			)

			res.status(200).json({ message: 'Project updated successfully', project: updateResult })
		} catch (err: any) {
			console.error(err.message)
			res.status(500).json({ error: 'Server Error' })
		}
	}
)

router.get('/get', async (req: any, res: any) => {
	try {
		const { githubLink } = req.query
		if (!githubLink) {
			return res.status(400).json({ error: 'GitHub link is required' })
		}
		const project = await Project.findOne({ githubLink })
		if (!project) {
			return res.status(404).json({ error: 'Project not found' })
		}
		res.status(200).json({ message: 'Project fetched successfully', data: project })
	} catch (error: any) {
		console.error(error.message)
		res.status(500).json({ error: 'Server Error' })
	}
})

router.get('/get-all', async (req: any, res: any) => {
	try {
		const projects = await Project.find()
		res.status(200).json({ message: 'Projects fetched successfully', data: projects })
	} catch (error: any) {
		console.error(error.message)
		res.status(500).json({ error: 'Server Error' })
	}
})

router.delete('/delete',authorization,mentorAuthorization ,async (req: any, res: any) => {
    try {
        const { githubLink } = req.body;
        
        if (!githubLink) {
            return res.status(400).json({ error: 'GitHub link is required' });
        }

        const project = await Project.findOne({ githubLink });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await Project.findOneAndDelete({ githubLink });
		const transaction = await Transaction.find({ deleteIndex: githubLink });
        if (transaction) {
			await Transaction.updateMany({ deleteIndex: githubLink }, { $set: { open: false } });
		} else {
			return res.status(404).json({ error: 'Transaction not found' });
		}
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
})

module.exports = router
