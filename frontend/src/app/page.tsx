'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { FiPlus, FiSearch, FiFilter, FiMoreVertical, FiFile } from 'react-icons/fi';
import { useStore } from '@/store/useStore';
import { getSocket } from '@/services/socket';

export default function Dashboard() {
    const { assignments, setAssignments, updateAssignmentStatus } = useStore();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/assignments' || 'http://localhost:5000/api/assignments')
            .then(res => res.json())
            .then(data => {
                setAssignments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        const socket = getSocket();
        if (socket) {
            socket.on('assignment-status', (data: { id: string, status: any }) => {
                updateAssignmentStatus(data.id, data.status);
            });
            socket.on('assignment-completed', (data: { id: string, result: any }) => {
                updateAssignmentStatus(data.id, 'completed');
            });
        }

        return () => {
            if (socket) {
                socket.off('assignment-status');
                socket.off('assignment-completed');
            }
        };
    }, [setAssignments, updateAssignmentStatus]);

    if (loading) return <div>Loading...</div>;

    if (assignments.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <FiFile style={{ opacity: 0.5 }} />
                </div>
                <h2 className={styles.emptyTitle}>No assignments yet</h2>
                <p className={styles.emptySubtitle}>
                    Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
                <Link href="/create" style={{ textDecoration: 'none' }}>
                    <button className={styles.primaryBtn}>
                        <FiPlus /> Create Your First Assignment
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Assignments <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'normal' }}>Manage and create assignments for your classes.</span></h1>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.filter}>
                    <FiFilter /> Filter By
                </div>
                <div className={styles.searchBox}>
                    <FiSearch color="#9ca3af" />
                    <input type="text" placeholder="Search Assignment" />
                </div>
            </div>

            <div className={styles.grid}>
                {assignments.map(assignment => (
                    <div 
                        key={assignment._id} 
                        className={styles.card} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/assignment/${assignment._id}`)}
                    >
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Quiz on Subject</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className={styles.statusText}>
                                    <span className={`${styles.statusIndicator} ${styles['status-' + assignment.status]}`}></span>
                                    {assignment.status}
                                </span>
                                <button style={{ padding: '4px' }} onClick={(e) => e.stopPropagation()}><FiMoreVertical /></button>
                            </div>
                        </div>
                        <div className={styles.cardFooter}>
                            <span>Assigned on: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
                 <Link href="/create" style={{ textDecoration: 'none' }}>
                    <button className={styles.primaryBtn}>
                        <FiPlus /> Create Assignment
                    </button>
                </Link>
            </div>
        </div>
    );
}
