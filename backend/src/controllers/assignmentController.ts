import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { addAssignmentJob } from '../queues/queue';

export const createAssignment = async (req: Request, res: Response) => {
    try {
        const { dueDate, questionTypes, totalQuestions, totalMarks, additionalInstructions } = req.body;

        const assignment = new Assignment({
            dueDate,
            questionTypes,
            totalQuestions,
            totalMarks,
            additionalInstructions
        });

        await assignment.save();

        // Add to BullMQ queue
        await addAssignmentJob(assignment.id);

        res.status(201).json({ message: 'Assignment created and added to queue', assignment });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ error: 'Failed to create assignment' });
    }
};

export const getAssignments = async (req: Request, res: Response) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
};

export const getAssignmentById = async (req: Request, res: Response) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assignment' });
    }
};
