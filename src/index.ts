import express from 'express'
require('dotenv').config()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'http://localhost'
const app = express()

app.get('/', (_req, res) => {
	res.send('Hello world in TS express code!')
})

// start the server
app.listen(PORT, () => {
	console.log(`App started on ${HOST}:${PORT}/`)
})
