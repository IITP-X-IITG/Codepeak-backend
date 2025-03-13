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
            const { email, oldPassword, newPassword,type } = req.body;
            const user = (type === undefined || email === undefined)?null:await (
                (type==='mentor')? Mentor.findOne({ email: email }): Student.findOne({ email: email })
            );
            console.log(user);
            console.log(type);
            if (!user || type === undefined) {
                res.status(404).json({ error: 'User not found' });
                return
            }
            const token = await updatePassword(user, type === 'mentor', oldPassword, newPassword);
            res.cookie('token', token);
            res.status(200).json({ message: 'Password updated successfully', token });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
);

export default router;
