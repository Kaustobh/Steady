import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </main>
      <BottomNav />

      {/* Clean Neumorphic Copyright Notice (Left Bottom Corner) */}
      <footer
        style={{
          padding: '8px 20px 12px 20px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'var(--color-bg)',
          borderTop: '1px solid var(--color-divider)',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 500,
            color: 'var(--color-text-faint)',
            letterSpacing: '0.02em',
            fontFamily: 'var(--font-body)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          © 2026 Kaustobh Bhattacharya • Steady
        </span>
      </footer>
    </div>
  );
};
