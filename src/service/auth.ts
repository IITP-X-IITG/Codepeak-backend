import { Request, Response, NextFunction } from 'express'
import { verifyAndDecodeToken } from '../utils/jwt'
import { GitUsername } from '../service/getGitUsername'
const Student = require('../../models/Student')

// Extend the Express Request type to include our custom property
declare global {
  namespace Express {
    interface Request {
      githubUsername?: string;
      userEmail?: string;
	  type?: string;
    }
  }
}

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
		if (!token) {
			res.status(401).json({ message: 'Authentication required' })
			return;
		}

		const decoded = verifyAndDecodeToken(token)
		if (!decoded) {
			res.status(401).json({ message: 'Invalid token' })
			return;
		}
		
		const userEmail = decoded.email;
		console.log('Authenticated by auth service', userEmail);
			
		try {
			const result = await GitUsername(userEmail);
			
			if (result.success) {
				// Store information in the request object for later use
				req.githubUsername = result.message;
				req.userEmail = userEmail;
				req.type = result.type;
				// Pass control to the next middleware/route handler
				next();
			} else {
				// If no GitHub username found but authentication was successful
				req.userEmail = userEmail;
				next();
			}
		} catch (error) {
			console.error('Error processing GitHub username:', error);
			res.status(500).json({ message: 'Internal server error' });
			return;
		}
	} catch (error) {
		res.status(401).json({ message: 'Invalid token' })
		return;
	}
}
