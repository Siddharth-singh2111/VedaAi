import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionType {
    type: string;
    count: number;
    marks: number;
}

export interface IAssignment extends Document {
    dueDate: Date;
    questionTypes: IQuestionType[];
    totalQuestions: number;
    totalMarks: number;
    additionalInstructions: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    generatedPaper?: any;
    createdAt: Date;
}

const QuestionTypeSchema = new Schema({
    type: { type: String, required: true },
    count: { type: Number, required: true },
    marks: { type: Number, required: true }
});

const AssignmentSchema = new Schema({
    dueDate: { type: Date, required: true },
    questionTypes: [QuestionTypeSchema],
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    additionalInstructions: { type: String },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    generatedPaper: { type: Schema.Types.Mixed }, // Will store the JSON structure of the paper
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
