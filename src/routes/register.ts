const express = require('express')
const Student = require('../../models/Student')
const Mentor = require('../../models/Mentor')
const router = express.Router()
const { body, validationResult } = require('express-validator')

router.post(
	'/student',
	body('firstname').isLength({ min: 1 }).withMessage('Name is required'),
	body('lastname').isLength({ min: 1 }).withMessage('Email is required'),
	body('email').isLength({ min: 1 }).withMessage('Email is required'),
    body('instituteEmail').isLength({ min: 1 }).withMessage('Institute Email is required'),
    body('phoneno').isLength({ min: 1 }).withMessage('Phone Number is required'),
    body('organization').isLength({ min: 1 }).withMessage('Organization is required'),
    body('githubProfile').isLength({ min: 1 }).withMessage('Github Profile is required'),
    body('otherProfile').isLength({ min: 1 }).withMessage('Other Profile is required'),
    body('firstTime').isLength({ min: 1 }).withMessage('First Time is required'),
	async (req: { body: { firstname: any; lastname: any; email: any; instituteEmail: any; phoneno: any; organization: any; githubProfile: any; otherProfile: any; firstTime: any } }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: any; message?: any }): void; new(): any } } }) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() })
		}

		try {
			const { firstname, lastname, email, instituteEmail, phoneno, organization, githubProfile, otherProfile, firstTime } = req.body
			let user = new Student({
                firstname,
                lastname,
                email,
                instituteEmail,
                phoneno,
                organization,
                githubProfile,
                otherProfile,
                firstTime
            })
			await user.save()
			res.status(200).json({ message: 'User created successfully' })
		} catch (err: any) {
			res.status(500).json({ error: err.message })
		}
	}
)

module.exports = router
