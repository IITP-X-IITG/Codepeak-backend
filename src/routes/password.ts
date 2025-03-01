import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { updatePassword } from '../service/password';
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
    async (req:Request, res:Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.array() });
            return
        }
        try {
            const { oldPassword, newPassword } = req.body;
            const user = (req.type === undefined || req.userEmail === undefined)?null:await (
                req.type?
                Mentor.findOne({ email: req.userEmail }):
                Student.findOne({ email: req.userEmail })
            );
            if (!user || req.type === undefined) {
                res.status(404).json({ error: 'User not found' });
                return
            }
            const token = await updatePassword(user, req.type === 'mentor', oldPassword, newPassword);
            res.cookie('token', token);
            res.status(200).json({ message: 'Password updated successfully', token });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
);

export default router;
