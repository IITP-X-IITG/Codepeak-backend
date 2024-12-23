import express, { Request, Response } from 'express';
const Student = require('../../models/Student')
const Mentor = require('../../models/Mentor')
const { generateToken } = require('../utils/jwt');
const router = express.Router();

router.post('/login/students', (req: Request, res: Response) => {
    const { email, password } = req.body;
    Student.findOne({ email: email })
        .then((user: typeof Student) => {
            if (!user) {
                return res.status(404).json({ message: 'Student not found' });
            }
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            const token = generateToken({ email: user.email });
            res.cookie("token", token);
            res.status(200).json({ message: 'Login successful' });
        }).catch((err: any) => {
            res.status(500).json({ error: err.message });
        });
});

router.post('/login/mentors', (req, res) => {
    const { email, password } = req.body;
    Mentor.findOne({ email: email })
        .then((user: typeof Student) => {
            if (!user) {
                return res.status(404).json({ message: 'Mentor not found' });
            }
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            const token = generateToken({ email: user.email });
            res.cookie("token", token);
            res.status(200).json({ message: 'Login successful' });
        }).catch((err: any) => {
            res.status(500).json({ error: err.message });
        });
});