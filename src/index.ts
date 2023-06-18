import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express, { Application } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3000
const dbURI = process.env.URL || null

if (dbURI) {
	mongoose
		.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
		.then(() => {
			console.log('Connected to MongoDB')
			app.use(bodyParser.json()) // for parsing application/json
			app.use(bodyParser.urlencoded({ extended: true }))

			// express routes
			/* eslint-disable */
			app.use('/api/register/', require('./routes/register'))
			app.use('/api/add-project/', require('./routes/addProject'))

			app.listen(port, () => {
				console.log(`Server is listening on port ${port}`)
			})
		})
		.catch((err) => {
			console.error('Error connecting to MongoDB:', err)
		})
}
