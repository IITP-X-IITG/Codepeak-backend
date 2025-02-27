const Student = require('../../models/Student');
const Mentor = require('../../models/Mentor');
import dotenv from 'dotenv';
const mongoose = require('mongoose');

interface TransactionResult {
    success: boolean;
    message: string;
    error?: any;
}

dotenv.config();
const dbURI = process.env.URL || null;

export const GitUsername = async (userEmail: any): Promise<TransactionResult> => {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(dbURI);
        }
        
        // First check if the user is a student
        const student = await Student.findOne({ email: userEmail });
        if (student) {
            return { success: true, message: student.githubProfile };
        }
        
        // If not a student, check if the user is a mentor
        const mentor = await Mentor.findOne({ email: userEmail });
        if (mentor) {
            return { success: true, message: mentor.githubProfile };
        }
        
        // If neither, return not found
        return { success: false, message: 'User not found' };
    } catch (error) {
        console.error('Error in GitUsername:', error);
        return { success: false, message: 'Error connecting to MongoDB', error };
    }
}