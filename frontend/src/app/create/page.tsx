'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { FiUploadCloud, FiPlus, FiMinus, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '@/store/useStore';

interface QuestionType {
    id: string;
    type: string;
    count: number;
    marks: number;
}

export default function CreateAssignment() {
    const router = useRouter();
    const { addAssignment } = useStore();
    const [loading, setLoading] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
        { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
        { id: '2', type: 'Short Questions', count: 3, marks: 2 },
    ]);
    const [error, setError] = useState('');

    const availableTypes = ['Multiple Choice Questions', 'Short Questions', 'Diagram/Graph-Based Questions', 'Numerical Problems', 'Long Answer Questions'];

    const handleAddType = () => {
        setQuestionTypes([...questionTypes, { id: Date.now().toString(), type: availableTypes[0], count: 1, marks: 1 }]);
    };

    const handleRemoveType = (id: string) => {
        setQuestionTypes(questionTypes.filter(qt => qt.id !== id));
    };

    const updateType = (id: string, field: keyof QuestionType, value: any) => {
        setQuestionTypes(questionTypes.map(qt => {
            if (qt.id === id) {
                // validation to prevent negative values
                if (field === 'count' || field === 'marks') {
                    if (value < 1) value = 1;
                }
                return { ...qt, [field]: value };
            }
            return qt;
        }));
    };

    const totalQuestions = questionTypes.reduce((acc, curr) => acc + curr.count, 0);
    const totalMarks = questionTypes.reduce((acc, curr) => acc + (curr.count * curr.marks), 0);

    const handleSubmit = async () => {
        if (!dueDate) {
            setError('Due Date is required');
            return;
        }
        if (questionTypes.length === 0) {
            setError('Add at least one question type');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/assignments' || 'http://localhost:5000/api/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dueDate,
                    questionTypes,
                    totalQuestions,
                    totalMarks,
                    additionalInstructions
                })
            });

            if (!res.ok) throw new Error('Failed to create assignment');

            const data = await res.json();
            addAssignment(data.assignment);
            
            // Redirect back to dashboard to see status
            router.push('/');
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Assignment Details</h1>
                <p className={styles.subtitle}>Basic information about your assignment</p>
            </div>

            <div className={styles.uploadArea}>
                <FiUploadCloud className={styles.uploadIcon} />
                <h3 className={styles.uploadTitle}>Choose a file or drag & drop it here</h3>
                <p className={styles.uploadSubtitle}>JPEG, PNG, upto 10MB (PDF/text also supported)</p>
                <button className={styles.browseBtn}>Browse Files</button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '32px' }}>Upload images of your preferred document/image</p>

            <div className={styles.formGroup}>
                <label className={styles.label}>Due Date</label>
                <input 
                    type="date" 
                    className={styles.input} 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                {error && <p className={styles.errorText}>{error}</p>}
            </div>

            <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <label className={styles.label} style={{ margin: 0 }}>Question Type</label>
                    <div style={{ display: 'flex', gap: '32px', marginRight: '64px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>No. of Questions</span>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>Marks</span>
                    </div>
                </div>

                {questionTypes.map((qt) => (
                    <div key={qt.id} className={styles.questionTypeRow}>
                        <select 
                            className={styles.input} 
                            value={qt.type}
                            onChange={(e) => updateType(qt.id, 'type', e.target.value)}
                        >
                            {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        
                        <div className={styles.numberControl}>
                            <button className={styles.iconBtn} onClick={() => updateType(qt.id, 'count', qt.count - 1)}><FiMinus /></button>
                            <span style={{ flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>{qt.count}</span>
                            <button className={styles.iconBtn} onClick={() => updateType(qt.id, 'count', qt.count + 1)}><FiPlus /></button>
                        </div>

                        <div className={styles.numberControl}>
                            <button className={styles.iconBtn} onClick={() => updateType(qt.id, 'marks', qt.marks - 1)}><FiMinus /></button>
                            <span style={{ flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>{qt.marks}</span>
                            <button className={styles.iconBtn} onClick={() => updateType(qt.id, 'marks', qt.marks + 1)}><FiPlus /></button>
                        </div>

                        <button className={styles.removeBtn} onClick={() => handleRemoveType(qt.id)}>
                            <FiX />
                        </button>
                    </div>
                ))}
                
                <button className={styles.addBtn} onClick={handleAddType}>
                    <div className={styles.iconBtn} style={{ background: '#111', color: 'white', width: '20px', height: '20px' }}>
                        <FiPlus size={12} />
                    </div>
                    Add Question Type
                </button>

                <div className={styles.summary}>
                    <div>Total Questions : <span style={{ color: 'var(--text-secondary)' }}>{totalQuestions}</span></div>
                    <div>Total Marks : <span style={{ color: 'var(--text-secondary)' }}>{totalMarks}</span></div>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Additional Information (For better output)</label>
                <textarea 
                    className={styles.input} 
                    rows={4} 
                    placeholder="e.g Generate a question paper for 3 hour exam duration..."
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                />
            </div>

            <div className={styles.footer}>
                <button className={styles.prevBtn} onClick={() => router.back()}>
                    <FiArrowLeft style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Previous
                </button>
                <button className={styles.nextBtn} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Processing...' : 'Next'} <FiArrowRight />
                </button>
            </div>
        </div>
    );
}
