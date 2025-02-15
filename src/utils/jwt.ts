import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface JWTPayload {
	email: string,
	isMentor: boolean
}

export const generateToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '14d' })
}

export const verifyToken = (token: string): JWTPayload | null => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded || (typeof decoded === 'string')) {
			return null;
		}
		return {
			email: decoded.email,
			isMentor: decoded.isMentor,
		}
	} catch (error) {
		return null;
	}
}
