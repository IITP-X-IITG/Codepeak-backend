import { Router, Request, Response } from 'express';
import { addTransaction, updateTransaction } from '../service/transaction';
const Leaderboard = require('../../models/Leaderboard');
const router = Router();

router.post('/add', async (req: Request, res: Response) => {
    try {
        const { student, mentor, project, points, type, open } = req.body;
        const result = await addTransaction(student, mentor, project, points, type, open);
        
        if (!result.success) {
            return res.status(400).json({ 
                message: result.message,
                error: result.error 
            });
        }
        
        return res.status(201).json({ message: result.message });
    } catch (error) {
        console.error("Error in add transaction route:", error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

router.post('/update', async (req: Request, res: Response) => {
    try {
        const { student, project, points, open } = req.body;
        const result = await updateTransaction(student, project, points, open);
        
        if (!result.success) {
            return res.status(400).json({ 
                message: result.message,
                error: result.error 
            });
        }
        
        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error in update transaction route:", error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
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

router.get('/leaderboard', async (req: Request, res: Response) => {
    try {
        const leaderboard = await Leaderboard.find({})
            .sort({ points: -1 }) // Sort by points in descending order
            .limit(100); // Get top 10 students

        return res.status(200).json({
            message: 'Leaderboard fetched successfully',
            data: leaderboard
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({
            message: 'Failed to fetch leaderboard',
            error
        });
    }
});

export default router;
