import { Router, Request, Response } from 'express';
const router = Router();
const Transaction = require('../../models/Transactions'); 
const leaderboard = require('../../models/Leaderboard');

router.post('/add', async (req: Request, res: Response) => {
    try {
        const { student, mentor, project, points, type, open } = req.body;
        // Create and save a new transaction document
        const newTransaction = new Transaction({ student, mentor, project, points, type, open });
        await newTransaction.save();
        // Update the leaderboard
        if(leaderboard.findOne({ student })){
            const studentData = await leaderboard.findOne({ student });
            studentData.points += points;
        } else {
            const newStudentData = new leaderboard({ student, points });
            await newStudentData.save();
        }

        return res.status(201).json({ message: 'Transaction added successfully', data: newTransaction });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add transaction', error });
    }
});

router.post('/update', async (req: Request, res: Response) => {
    try {
        const { student, mentor, project, points, type, open } = req.body;
        // Find the transaction to update
        const transaction = await Transaction.findOne({ student, mentor, project, type, open });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        // Update the transaction
        const studentData = await leaderboard.findOne({ student });
        studentData.points = studentData.points - transaction.points + points;
        transaction.points = points;
        await transaction.save();
        await studentData.save();
        return res.status(201).json({ message: 'Transaction updated successfully', data: transaction });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add transaction', error });
    }
});

router.get('/mentor-project', async (req: Request, res: Response) => {
    try {
        const { mentor } = req.query;
        
        if (!mentor) {
            return res.status(400).json({ message: 'Mentor parameters are required' });
        }

        const transactions = await Transaction.find({
            mentor: mentor
        });

        return res.status(200).json({ 
            message: 'Transactions fetched successfully', 
            data: transactions 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Failed to fetch transactions', 
            error 
        });
    }
});

router.get('/student-project', async (req: Request, res: Response) => {
    try {
        const { student } = req.query;
        
        if (!student) {
            return res.status(400).json({ message: 'student and project parameters are required' });
        }

        const transactions = await Transaction.find({
            student: student,
        });

        return res.status(200).json({ 
            message: 'Transactions fetched successfully', 
            data: transactions 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Failed to fetch transactions', 
            error 
        });
    }
});

export default router;
