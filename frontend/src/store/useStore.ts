import { create } from 'zustand';

interface Assignment {
    _id: string;
    dueDate: string;
    totalQuestions: number;
    totalMarks: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
}

interface StoreState {
    assignments: Assignment[];
    setAssignments: (assignments: Assignment[]) => void;
    addAssignment: (assignment: Assignment) => void;
    updateAssignmentStatus: (id: string, status: 'pending' | 'processing' | 'completed' | 'failed') => void;
}

export const useStore = create<StoreState>((set) => ({
    assignments: [],
    setAssignments: (assignments) => set({ assignments }),
    addAssignment: (assignment) => set((state) => ({ assignments: [assignment, ...state.assignments] })),
    updateAssignmentStatus: (id, status) => set((state) => ({
        assignments: state.assignments.map(a => a._id === id ? { ...a, status } : a)
    }))
}));
