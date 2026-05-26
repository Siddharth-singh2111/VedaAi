'use client';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { initSocket } from '@/services/socket';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  useEffect(() => {
    // Initialize Socket Connection
    const socket = initSocket();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ marginLeft: '260px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ 
              height: '72px', 
              background: 'var(--sidebar-bg)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0 32px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assignment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E5E7EB' }}></div>
                <span style={{ fontWeight: 500 }}>John Doe ⌄</span>
              </div>
            </header>
            <div style={{ padding: '32px', flex: 1, background: 'var(--background)' }}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
