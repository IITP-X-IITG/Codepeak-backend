import { Request, Response, NextFunction } from 'express'
import { verifyToken, decodeToken } from '../utils/jwt'
import { GitUsername } from '../service/getGitUsername'
const Student = require('../../models/Student')
const Mentor = require('../../models/Mentor')

// Extend the Express Request type to include our custom property
declare global {
  namespace Express {
    interface Request {
      githubUsername?: string;
      userEmail?: string;
      isMentor?: boolean;
    }
  }
}

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) {
			return res.status(401).json({ message: 'Authentication required' })
		}

		const decoded = verifyToken(token)
		if (!decoded) {
			return res.status(401).json({ message: 'Invalid token' })
		}
		
		const userEmail = decodeToken(token).email;
		console.log('Authenticated by auth service', userEmail);
			
		try {
			const result = await GitUsername(userEmail);
			
			// Check if user is a mentor
			const mentor = await Mentor.findOne({ email: userEmail });
			const isMentor = !!mentor;
			
			if (result.success) {
				// Store information in the request object for later use
				req.githubUsername = result.message;
				req.userEmail = userEmail;
				req.isMentor = isMentor;
				// Pass control to the next middleware/route handler
				next();
			} else {
				// If no GitHub username found but authentication was successful
				req.userEmail = userEmail;
				req.isMentor = isMentor;
				next();
			}
		} catch (error) {
			console.error('Error processing GitHub username:', error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	} catch (error) {
		return res.status(401).json({ message: 'Invalid token' })
	}
}

export const mentorAuthorization = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// This middleware should be used after authorization middleware
		if (!req.userEmail) {
			return res.status(401).json({ message: 'Authentication required' });
		}
		
		if (!req.isMentor) {
			return res.status(403).json({ message: 'Only mentors can perform this action' });
		}
		
		// If the user is a mentor, proceed to the next middleware/route handler
		next();
	} catch (error) {
		console.error('Error in mentor authorization:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}
