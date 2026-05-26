import { IAssignment } from '../models/Assignment';

// For now, this mocks the LLM response. 
// Once you add the API key, this can be swapped with a real LLM call.
export const generateQuestionPaper = async (assignment: IAssignment) => {
    // Simulate delay for generation
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Create sections based on question types requested
    const sections = assignment.questionTypes.map((qt, index) => {
        const questions = [];
        for (let i = 0; i < qt.count; i++) {
            // Distribute difficulty randomly for the mock
            const difficulties = ['Easy', 'Moderate', 'Hard'];
            const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
            
            questions.push({
                text: `Mock question ${i + 1} for type: ${qt.type}`,
                difficulty: diff,
                marks: qt.marks
            });
        }

        const sectionLetter = String.fromCharCode(65 + index); // A, B, C, etc.
        return {
            title: `Section ${sectionLetter}`,
            instruction: `Attempt all questions. Each question carries ${qt.marks} marks.`,
            questions
        };
    });

    return {
        schoolName: "Delhi Public School, Sector-4, Bokaro",
        subject: "English",
        className: "5th",
        timeAllowed: "45 minutes",
        maximumMarks: assignment.totalMarks,
        generalInstructions: "All questions are compulsory unless stated otherwise.",
        sections
    };
};
