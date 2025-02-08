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

export default router;
