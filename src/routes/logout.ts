import express, { Request, Response } from 'express'
const router = express.Router()

router.post('/', (req: Request, res: Response) => {
    res.clearCookie('token');
	res.status(200).json({ message: 'Logout successful' })
})
module.exports = router
