import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { FiHome, FiUsers, FiFileText, FiTool, FiBook, FiSettings, FiPlus } from 'react-icons/fi';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', icon: <FiHome />, path: '/' },
        { name: 'My Groups', icon: <FiUsers />, path: '/groups' },
        { name: 'Assignments', icon: <FiFileText />, path: '/assignment', badge: '10' },
        { name: 'AI Teacher\'s Toolkit', icon: <FiTool />, path: '/toolkit' },
        { name: 'My Library', icon: <FiBook />, path: '/library' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>V</div>
                VedaAI
            </div>

            <Link href="/create" style={{ textDecoration: 'none' }}>
                <button className={styles.createBtn}>
                    <FiPlus /> Create Assignment
                </button>
            </Link>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link 
                        key={item.name} 
                        href={item.path} 
                        className={`${styles.navItem} ${pathname.startsWith(item.path) && item.path !== '/' || pathname === item.path ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        {item.name}
                        {item.badge && <span className={styles.badge}>{item.badge}</span>}
                    </Link>
                ))}
            </nav>

            <div className={styles.navItem} style={{ marginTop: 'auto', marginBottom: '16px' }}>
                <span className={styles.icon}><FiSettings /></span>
                Settings
            </div>

            <div className={styles.profile}>
                <div className={styles.avatar}>D</div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Delhi Public School</span>
                    <span className={styles.userRole}>Bokaro Steel City</span>
                </div>
            </div>
        </aside>
    );
}
