'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { FiDownload } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';

export default function AssignmentOutput() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [assignment, setAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const paperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/assignments/${id}`)
            .then(res => res.json())
            .then(data => {
                setAssignment(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleDownloadPDF = () => {
        if (!paperRef.current) return;
        
        const opt = {
            margin:       10,
            filename:     `Question_Paper_${id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(paperRef.current).set(opt).save();
    };

    if (loading) return <div>Loading...</div>;
    if (!assignment) return <div>Assignment not found</div>;

    if (assignment.status !== 'completed' || !assignment.generatedPaper) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Assignment is still generating...</h2>
                <p>Status: {assignment.status}</p>
                <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', marginTop: '16px', background: '#111', color: 'white', borderRadius: '8px' }}>Refresh</button>
            </div>
        );
    }

    const paper = assignment.generatedPaper;

    const getDifficultyClass = (diff: string) => {
        if (diff.toLowerCase() === 'easy') return styles.diffEasy;
        if (diff.toLowerCase() === 'moderate') return styles.diffModerate;
        if (diff.toLowerCase() === 'hard' || diff.toLowerCase() === 'challenging') return styles.diffHard;
        return '';
    };

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div className={styles.topText}>
                    <strong>Certainly, Lakshya!</strong> Here are customized Question Paper for your {paper.className} {paper.subject} classes on the NCERT chapters:
                </div>
                <button className={styles.downloadBtn} onClick={handleDownloadPDF}>
                    <FiDownload /> Download as PDF
                </button>
            </div>

            <div className={styles.paper} ref={paperRef}>
                <div className={styles.header}>
                    <div className={styles.schoolName}>{paper.schoolName}</div>
                    <div className={styles.subject}>Subject: {paper.subject}</div>
                    <div className={styles.className}>Class: {paper.className}</div>
                </div>

                <div className={styles.metaInfo}>
                    <span>Time Allowed: {paper.timeAllowed}</span>
                    <span>Maximum Marks: {paper.maximumMarks}</span>
                </div>

                <div className={styles.generalInstructions}>
                    {paper.generalInstructions}
                </div>

                <div className={styles.studentInfo}>
                    <div className={styles.studentInfoRow}>
                        <span>Name:</span><div className={styles.underline}></div>
                    </div>
                    <div className={styles.studentInfoRow}>
                        <span>Roll Number:</span><div className={styles.underline}></div>
                    </div>
                    <div className={styles.studentInfoRow}>
                        <span>Class: {paper.className} Section:</span><div className={styles.underline}></div>
                    </div>
                </div>

                {paper.sections.map((section: any, idx: number) => (
                    <div key={idx} className={styles.section}>
                        <div className={styles.sectionTitle}>{section.title}</div>
                        {idx === 0 && <div className={styles.sectionSubtitle}>Short Answer Questions</div>}
                        <div className={styles.sectionInstruction}>{section.instruction}</div>

                        <ul className={styles.questionList}>
                            {section.questions.map((q: any, qIdx: number) => (
                                <li key={qIdx} className={styles.questionItem}>
                                    <div className={styles.questionNum}>{qIdx + 1}.</div>
                                    <div className={styles.questionContent}>
                                        <span className={`${styles.difficulty} ${getDifficultyClass(q.difficulty)}`}>[{q.difficulty}]</span>{' '}
                                        {q.text} <span className={styles.marks}>[{q.marks} Marks]</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className={styles.endText}>End of Question Paper</div>
            </div>
        </div>
    );
}
