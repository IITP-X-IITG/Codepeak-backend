import argon2 from 'argon2';
import { generateToken } from '../utils/jwt';

export async function updatePassword(user: any, oldPassword: string, newPassword: string): Promise<string> {
    // Verify the old password
    const isValid = await argon2.verify(user.password, oldPassword);
    if (!isValid) {
        throw new Error('Invalid old password');
    }
    // Hash the new password and update the user
    user.password = await argon2.hash(newPassword);
    await user.save();

    // Generate new JWT token using user's email
    const token = generateToken({ email: user.email });
    return token;
}
