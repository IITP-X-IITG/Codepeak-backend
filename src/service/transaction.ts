const Transaction = require('../../models/Transactions');
const Leaderboard = require('../../models/Leaderboard');
import dotenv from 'dotenv';
const mongoose = require('mongoose');

interface TransactionResult {
    success: boolean;
    message: string;
    error?: any;
}

dotenv.config({ path: __dirname + '/../../.env' });
const dbURI = process.env.URL || null;
const TIMEOUT_MS = 5000; // 5 seconds timeout
console.log("dbURI", process.env.URL);
export const addTransaction = async (
    student: any, 
    mentor: any, 
    project: any, 
    points: any, 
    type: any, 
    open: any
): Promise<TransactionResult> => {
    try {
        // First establish connection
        await mongoose.connect(dbURI);
        
        // Create transaction with timeout
        const newTransaction = new Transaction({ student, mentor, project,deleteIndex: project.split('/pull/')[0] , points, type, open });
        await Promise.race([
            newTransaction.save(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Transaction save timeout')), TIMEOUT_MS)
            )
        ]);

        // Update leaderboard with timeout
        const studentData = await Promise.race([
            Leaderboard.findOne({ student }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Leaderboard query timeout')), TIMEOUT_MS)
            )
        ]);

        if (!studentData) {
            const newStudentData = new Leaderboard({ student, points });
            await Promise.race([
                newStudentData.save(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Leaderboard save timeout')), TIMEOUT_MS)
                )
            ]);
        } else {
            studentData.points += points;
            await Promise.race([
                studentData.save(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Leaderboard update timeout')), TIMEOUT_MS)
                )
            ]);
        }

        return { success: true, message: 'Transaction completed successfully' };
    } catch (error: any) {
        console.error("Error in transaction:", error);
        return {
            success: false,
            message: error.message || 'Transaction failed',
            error
        };
    }
}

export const updateTransaction = async (student: any, project: any, points: any, open: any): Promise<TransactionResult> => {
    try {
        await mongoose.connect(dbURI);
        // Find transaction with timeout
        const transaction = await Promise.race([
            Transaction.findOne({ project }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Transaction query timeout')), TIMEOUT_MS)
            )
        ]);

        if (!transaction) {
            return { success: false, message: 'Transaction not found' };
        }

        const studentData = await Promise.race([
            Leaderboard.findOne({ student }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Leaderboard query timeout')), TIMEOUT_MS)
            )
        ]);

        if (!studentData) {
            return { success: false, message: 'Student data not found' };
        }

        studentData.points = studentData.points - transaction.points + points;
        transaction.points = points;
        transaction.open = open;

        // Save both updates concurrently with timeout
        await Promise.race([
            Promise.all([transaction.save(), studentData.save()]),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Save operations timeout')), TIMEOUT_MS)
            )
        ]);

        return { success: true, message: 'Transaction updated successfully' };
    } catch (error:any) {
        console.error("Error updating transaction:", error);
        return {
            success: false,
            message: error.message || 'Update failed',
            error
        };
    }
}