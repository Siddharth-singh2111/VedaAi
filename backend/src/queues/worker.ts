import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import Assignment from '../models/Assignment';
import { generateQuestionPaper } from '../services/llmService';
import { getIO } from '../services/socket';

dotenv.config();

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null
});

export const startWorker = () => {
    const worker = new Worker('assignment-generation', async (job) => {
        const { assignmentId } = job.data;
        console.log(`Processing job for assignment: ${assignmentId}`);

        try {
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) {
                throw new Error('Assignment not found');
            }

            assignment.status = 'processing';
            await assignment.save();

            // Notify frontend
            getIO().emit('assignment-status', { id: assignmentId, status: 'processing' });

            // Generate paper via LLM (or mock)
            const generatedPaper = await generateQuestionPaper(assignment);

            assignment.generatedPaper = generatedPaper;
            assignment.status = 'completed';
            await assignment.save();

            console.log(`Job completed for assignment: ${assignmentId}`);
            
            // Notify frontend
            getIO().emit('assignment-completed', { id: assignmentId, result: assignment });

        } catch (error) {
            console.error(`Error processing job for assignment ${assignmentId}:`, error);
            
            await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
            getIO().emit('assignment-status', { id: assignmentId, status: 'failed' });
            throw error;
        }
    }, { connection });

    worker.on('failed', (job, err) => {
        if(job) {
            console.log(`Job ${job.id} has failed with ${err.message}`);
        }
    });

    console.log('BullMQ Worker started successfully');
};
