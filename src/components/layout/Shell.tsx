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
    </div>
  );
};
