import express from 'express';
import { body, validationResult } from 'express-validator';
import { updatePassword } from '../service/password';
const Student = require('../../models/Student')

const router = express.Router();

const findUserByEmail = async (email: string) => {
    return Student.findOne({ email });
};

router.post(
    '/update',
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
        body('oldPassword').notEmpty().withMessage('Old password required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    ],
    async (req:any, res:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
            const { email, oldPassword, newPassword } = req.body;
            const user = await findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const token = await updatePassword(user, oldPassword, newPassword);
            res.cookie('token', token);
            res.status(200).json({ message: 'Password updated successfully', token });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
);

export default router;
