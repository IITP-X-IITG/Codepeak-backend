import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface JWTPayload {
	email: string
}

export const generateToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '14d' })
}

export const verifyToken = (token: string): boolean => {
	try {
		jwt.verify(token, JWT_SECRET)
		return true
	} catch (error) {
		return false
	}
}

export const decodeToken = (token: string) => {
	try {
	  return jwt.decode(token); // This doesn't verify the signature
	} catch (error) {
	  return null;
	}
};