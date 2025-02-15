import { Request, Response, NextFunction } from 'express'
import { verifyToken, JWTPayload } from '../utils/jwt'

export interface RequestWithToken extends Request{
	_email?: String;
	_isMentor?: boolean;
}

export const authorization = (req: RequestWithToken, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
		if (!token) {
			res.status(401).json({ message: 'Authentication required' })
			return
		}

		const decoded = verifyToken(token)
		if (!decoded) {
			res.status(401).json({ message: 'Invalid token' })
			return
		} else {
			console.log('Authenticated by auth service')
		}
		req._email = decoded.email;
		req._isMentor = decoded.isMentor;
		next()
	} catch (error) {
		res.status(401).json({ message: 'Invalid token' })
	}
}
