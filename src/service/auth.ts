import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export const authorization = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) {
			return res.status(401).json({ message: 'Authentication required' })
		}

		const decoded = verifyToken(token)
		if (!decoded) {
			return res.status(401).json({ message: 'Invalid token' })
		} else {
			console.log('Authenticated by auth service')
		}
		next()
	} catch (error) {
		res.status(401).json({ message: 'Invalid token' })
	}
}
