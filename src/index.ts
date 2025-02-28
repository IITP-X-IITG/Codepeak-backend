import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express, { Application, Request, Response } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'
import cookieParser from 'cookie-parser'
import { authorization } from './service/auth'

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
			// Register new password API route
			const passwordRoute = require('./routes/password');
			app.use('/api/password', passwordRoute.default || passwordRoute);
			// Register addTransaction middleware
			app.use('/api/transactions', require('./routes/addTransaction').default);

			app.listen(port, () => {
				console.log(`Server is listening on port ${port}`)
			})
		})
		.catch((err) => {
			console.error('Error connecting to MongoDB:', err)
		})
}

app.use(express.static('public'))
