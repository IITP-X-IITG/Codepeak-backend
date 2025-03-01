import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express, { Application, Request, Response } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'
import cookieParser from 'cookie-parser'
import { authorization, RequestWithToken } from './service/auth'
const Student = require('../models/Student')
const Mentor = require('../models/Mentor')

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3000
const dbURI = process.env.URL || null

app.use(cookieParser())

app.get('/api/auth', authorization, (req, res) => {
	res.status(200).json({ 
		message: 'Authenticated',
		github: req.githubUsername || "",
		type: req.type || "",
		email: req.userEmail || ""
	});
})

if (dbURI) {
	mongoose
		.connect(dbURI)
		.then(() => {
			console.log('Connected to MongoDB')
			app.use(bodyParser.json()) // for parsing application/json
			app.use(bodyParser.urlencoded({ extended: true }))

			// express routes
			/* eslint-disable */
			app.use('/api/register/', require('./routes/register'))
			app.use('/api/add-project/', require('./routes/addProject'))
			app.use('/api/login/', require('./routes/login'))
			app.use('/api/logout/', require('./routes/logout'))
			// Register new password API route
			const passwordRoute = require('./routes/password');
			app.use('/api/password', authorization, passwordRoute.default || passwordRoute);
			// Register addTransaction middleware
			app.use('/api/transactions', require('./routes/addTransaction').default);

			app.post('/api/check-auth', authorization, async (req: RequestWithToken, res: Response) => {
				const user = (req._isMentor === undefined || req._email === undefined)?null:await (
					req._isMentor?
					Mentor.findOne({ email: req._email }):
					Student.findOne({ email: req._email })
				);
            	if (!user) {
                	res.status(404).json({ error: 'User not found' });
					return
            	}
				res.status(200).json({ user: {...user, password: undefined}, isMentor: req._isMentor }) // TODO:...
			})

			app.listen(port, () => {
				console.log(`Server is listening on port ${port}`)
			})
		})
		.catch((err) => {
			console.error('Error connecting to MongoDB:', err)
		})
}

app.use(express.static('public'))
