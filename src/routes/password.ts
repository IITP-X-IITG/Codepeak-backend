import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { updatePassword } from '../service/password';
import { RequestWithToken } from '../service/auth'
const Mentor = require('../../models/Mentor')
const Student = require('../../models/Student')

const router = express.Router();


router.post(
    '/update',
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
        body('oldPassword').notEmpty().withMessage('Old password required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    ],
    async (req:RequestWithToken, res:Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.array() });
            return
        }
        try {
            const { oldPassword, newPassword } = req.body;
            const user = (req._isMentor === undefined || req._email === undefined)?null:await (
                req._isMentor?
                Mentor.findOne({ email: req._email }):
                Student.findOne({ email: req._email })
            );
            if (!user || req._isMentor === undefined) {
                res.status(404).json({ error: 'User not found' });
                return
            }
            const token = await updatePassword(user, req._isMentor, oldPassword, newPassword);
            res.cookie('token', token);
            res.status(200).json({ message: 'Password updated successfully', token });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
);

export default router;
