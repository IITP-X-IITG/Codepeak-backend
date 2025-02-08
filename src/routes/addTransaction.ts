import { Router, Request, Response } from 'express';
const router = Router();
const Transaction = require('../../models/Transactions'); // using the Transactions model

router.post('/add', async (req: Request, res: Response) => {
    try {
        const { student, mentor, project, points } = req.body;
        // Create and save a new transaction document
        const newTransaction = new Transaction({ student, mentor, project, points });
        await newTransaction.save();
        return res.status(201).json({ message: 'Transaction added successfully', data: newTransaction });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add transaction', error });
    }
});

router.get('/mentor-project', async (req: Request, res: Response) => {
    try {
        const { mentor, project } = req.query;
        
        if (!mentor || !project) {
            return res.status(400).json({ message: 'Mentor and project parameters are required' });
        }

        const transactions = await Transaction.find({
            mentor: mentor,
            project: project
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
