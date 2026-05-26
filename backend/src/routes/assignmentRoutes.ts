import express from 'express';
import { createAssignment, getAssignments, getAssignmentById } from '../controllers/assignmentController';

const router = express.Router();

router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);

export default router;
