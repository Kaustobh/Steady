import React, { useRef } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { Sun, Moon, RotateCcw, Download, Upload } from 'lucide-react';
import type { StorageDataExport } from '../../types';

export const Header: React.FC = () => {
  const { theme, toggleTheme, activeScreen, setActiveScreen, user, resetDemoData, exportData } = useSteady();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activeScreen === 'focus') {
    return null;
  }

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'onboarding-welcome':
        return '';
      case 'onboarding-roles':
        return 'Step 1 of 2: Roles';
      case 'onboarding-prefs':
        return 'Step 2 of 2: Preferences';
      case 'home':
        return 'Today';
      case 'breakdown':
        return 'Task Breakdown';
      case 'projects':
        return 'Projects';
      case 'resources':
        return 'Resources Hub';
      case 'review':
        return 'Daily Review';
      case 'insights':
        return 'Weekly Insights';
      default:
        return '';
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steady_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: StorageDataExport = JSON.parse(event.target?.result as string);
        if (data.user && data.tasks) {
          localStorage.setItem('steady_user', JSON.stringify(data.user));
          localStorage.setItem('steady_tasks', JSON.stringify(data.tasks));
          localStorage.setItem('steady_projects', JSON.stringify(data.projects || []));
          localStorage.setItem('steady_resources', JSON.stringify(data.resources || []));
          localStorage.setItem('steady_reviews', JSON.stringify(data.dailyReviews || []));
          window.location.reload();
        } else {
          alert('Invalid Steady backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const title = getScreenTitle();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: activeScreen.startsWith('onboarding') ? 'none' : '1px solid var(--color-divider)',
        backgroundColor: 'var(--color-chrome-bg)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Mark */}
      <div
        onClick={() => user.onboardingCompleted && setActiveScreen('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: user.onboardingCompleted ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary)',
            boxShadow: 'var(--neu-shadow-flat)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '16px',
            fontFamily: 'var(--font-display)',
          }}
        >
          S
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
          }}
        >
          Steady
        </span>
      </div>

      {/* Screen Title Indicator if not onboarding */}
      {title && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--neu-shadow-flat)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {title}
        </span>
      )}

      {/* Right Controls: Theme Switcher, Data Export/Import & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={toggleTheme}
          aria-label="Toggle light/dark theme"
          className="btn-ghost"
          style={{ padding: '6px', borderRadius: '50%' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user.onboardingCompleted && (
          <>
            <button
              onClick={handleExportBackup}
              aria-label="Export Data Backup"
              className="btn-ghost"
              style={{ padding: '6px', borderRadius: '50%' }}
              title="Download local JSON data backup"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Import Data Backup"
              className="btn-ghost"
              style={{ padding: '6px', borderRadius: '50%' }}
              title="Restore local JSON data backup"
            >
              <Upload size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportBackup}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button
              onClick={resetDemoData}
              aria-label="Reset Application Data"
              className="btn-ghost"
              style={{ padding: '6px', borderRadius: '50%' }}
              title="Reset application data & restart setup"
            >
              <RotateCcw size={16} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
