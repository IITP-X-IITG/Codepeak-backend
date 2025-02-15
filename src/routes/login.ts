import express, { Request, Response } from 'express'
const Student = require('../../models/Student')
const Mentor = require('../../models/Mentor')
const { generateToken } = require('../utils/jwt')
import * as argon2 from 'argon2'
const router = express.Router()

router.post('/students', (req: Request, res: Response) => {
	// TODO: body validation
	const { email, password } = req.body
	Student.findOne({ email: email })
		.then((user: typeof Student) => {
			if (!user) {
				return res.status(404).json({ message: 'Student not found' })
			}
			argon2.verify(user.password, password).then((equal) => {
				if (!equal) {
					return res.status(401).json({ message: 'Invalid password' })
				}
				const token = generateToken({ email: user.email, isMentor: false })
				res.cookie('token', token)
				res.status(200).json({ message: 'Login successful' })
			})
		})
		.catch((err: any) => {
			res.status(500).json({ error: err.message })
		})
})

router.post('/mentors', (req, res) => {
	const { email, password } = req.body
	Mentor.findOne({ email: email })
		.then((user: typeof Student) => {
			if (!user) {
				return res.status(404).json({ message: 'Mentor not found' })
			}
			argon2.verify(user.password, password).then((equal) => {
				if (!equal) {
					return res.status(401).json({ message: 'Invalid password' })
				}
				const token = generateToken({ email: user.email, isMentor: true })
				res.cookie('token', token)
				res.status(200).json({ message: 'Login successful' })
			})
			.catch((err: any) => {
				res.status(500).json({ error: err.message })
			})
		})
})
module.exports = router
/* vi: set et sw=4: */
