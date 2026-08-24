import React from 'react';
import { useSteady } from '../../context/SteadyContext';
import { Compass, FolderKanban, BookMarked, BarChart3 } from 'lucide-react';
import type { ActiveScreen } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, user } = useSteady();

  // Hide bottom navigation during onboarding flows and full Focus Mode
  if (!user.onboardingCompleted || activeScreen.startsWith('onboarding') || activeScreen === 'focus') {
    return null;
  }

  const navItems: { label: string; icon: React.ReactNode; screen: ActiveScreen }[] = [
    { label: 'Now', icon: <Compass size={20} />, screen: 'home' },
    { label: 'Projects', icon: <FolderKanban size={20} />, screen: 'projects' },
    { label: 'Resources', icon: <BookMarked size={20} />, screen: 'resources' },
    { label: 'Review', icon: <BarChart3 size={20} />, screen: 'review' },
  ];

  const isSelected = (screen: ActiveScreen) => {
    if (screen === 'home' && (activeScreen === 'home' || activeScreen === 'breakdown')) return true;
    if (screen === 'review' && (activeScreen === 'review' || activeScreen === 'insights')) return true;
    return activeScreen === screen;
  };

  return (
    <nav
      aria-label="Main Navigation"
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--color-chrome-bg)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-divider)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
      }}
    >
      {navItems.map(item => {
        const active = isSelected(item.screen);
        return (
          <button
            key={item.label}
            onClick={() => setActiveScreen(item.screen)}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              height: '100%',
              color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: active ? 600 : 500,
              fontSize: '11px',
              transition: 'color var(--transition-fast)',
              border: 'none',
              background: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: active ? 'var(--color-surface)' : 'transparent',
                boxShadow: active ? 'var(--neu-shadow-pressed)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              {item.icon}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
