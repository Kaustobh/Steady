import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import type { UserPreferences } from '../../types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const OnboardingPreferences: React.FC = () => {
  const { user, completeOnboarding, setActiveScreen } = useSteady();

  const [predictability, setPredictability] = useState<UserPreferences['dayPredictability']>(
    user.preferences?.dayPredictability || 'Unpredictable'
  );
  const [helpArea, setHelpArea] = useState<UserPreferences['helpFocusArea']>(
    user.preferences?.helpFocusArea || 'Prioritizing'
  );
  const [suggestionStyle, setSuggestionStyle] = useState<UserPreferences['suggestionStyle']>(
    user.preferences?.suggestionStyle || 'Balanced'
  );

  const handleFinish = () => {
    completeOnboarding(
      user.name || 'Friend',
      user.roles,
      user.domains,
      {
        dayPredictability: predictability,
        helpFocusArea: helpArea,
        suggestionStyle: suggestionStyle,
      }
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100%',
        padding: '24px',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div>
        {/* Nav & Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button onClick={() => setActiveScreen('onboarding-roles')} className="btn-ghost" style={{ padding: '6px' }}>
            <ArrowLeft size={20} />
          </button>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Step 2 of 2
          </span>
        </div>

        <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: '6px' }}>Planning Style</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Customize decision guidance for your energy and schedule reality.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Question 1 */}
          <div className="card">
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
              How do your days usually feel?
            </label>
            <div className="segmented-control">
              {(['Predictable', 'Mixed', 'Unpredictable'] as const).map(opt => (
                <div
                  key={opt}
                  onClick={() => setPredictability(opt)}
                  className={`segmented-option ${predictability === opt ? 'active' : ''}`}
                >
                  {opt}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              {predictability === 'Unpredictable'
                ? 'Steady will suggest shorter 15–20 min micro-task chunks.'
                : 'Steady will balance long focus blocks with quick wins.'}
            </p>
          </div>

          {/* Question 2 */}
          <div className="card">
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
              What do you need most help with?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(
                [
                  'Prioritizing',
                  'Staying focused',
                  'Balancing responsibilities',
                  'Tracking progress',
                ] as const
              ).map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setHelpArea(area)}
                  className="btn-secondary"
                  style={{
                    padding: '10px',
                    fontSize: 'var(--text-xs)',
                    justifyContent: 'flex-start',
                    borderColor: helpArea === area ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: helpArea === area ? 'var(--color-primary-highlight)' : 'var(--color-surface)',
                    color: helpArea === area ? 'var(--color-primary)' : 'var(--color-text)',
                    fontWeight: helpArea === area ? 600 : 500,
                  }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="card">
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
              How should suggestions work?
            </label>
            <div className="segmented-control">
              {(['Minimal', 'Balanced', 'Guided'] as const).map(styleOpt => (
                <div
                  key={styleOpt}
                  onClick={() => setSuggestionStyle(styleOpt)}
                  className={`segmented-option ${suggestionStyle === styleOpt ? 'active' : ''}`}
                >
                  {styleOpt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion CTA */}
      <div style={{ paddingTop: '20px', marginTop: '20px', borderTop: '1px solid var(--color-divider)' }}>
        <button onClick={handleFinish} className="btn-primary" style={{ width: '100%', padding: '16px' }}>
          Enter My Workspace <CheckCircle2 size={18} />
        </button>
      </div>
    </div>
  );
};
