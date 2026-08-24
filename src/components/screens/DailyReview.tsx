import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { Save, BarChart2, CheckCircle2 } from 'lucide-react';

export const DailyReview: React.FC = () => {
  const { submitDailyReview, setActiveScreen } = useSteady();

  const [movedForward, setMovedForward] = useState('');
  const [blockedBy, setBlockedBy] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [savedToast, setSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDailyReview({
      movedForward: movedForward.trim() || 'Completed key focus actions for today.',
      blockedBy: blockedBy.trim() || 'Handled unexpected shift interruptions.',
      tomorrowPlan: tomorrowPlan.trim() || 'Protect early morning focus window for priority task.',
      stressLevel,
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setActiveScreen('insights');
    }, 1500);
  };

  return (
    <div
      style={{
        padding: '20px 20px 32px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header & Sub-nav toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>Daily Reflection</h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Turn daily friction into adaptive progress insights.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('insights')}
          className="btn-ghost"
          style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600, gap: '4px' }}
        >
          <BarChart2 size={16} /> View Insights
        </button>
      </div>

      {savedToast && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-success)',
            backgroundColor: 'var(--color-success-bg)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} /> Daily review saved! Unlocking weekly insights...
        </div>
      )}

      {/* Prompts Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Question 1 */}
        <div className="card">
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: '6px' }}>
            1. What moved forward today?
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Completed main project deliverables..."
            value={movedForward}
            onChange={e => setMovedForward(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 'var(--text-xs)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        {/* Question 2 */}
        <div className="card">
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: '6px' }}>
            2. What blocked or interrupted you?
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Unexpected call or emergency context switch..."
            value={blockedBy}
            onChange={e => setBlockedBy(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 'var(--text-xs)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        {/* Question 3 */}
        <div className="card">
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: '6px' }}>
            3. What should change tomorrow?
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Protect early morning focus block before noise starts..."
            value={tomorrowPlan}
            onChange={e => setTomorrowPlan(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 'var(--text-xs)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        {/* Stress Slider */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)' }}>
              Overall Stress Level Today
            </label>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {stressLevel} / 5
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={stressLevel}
            onChange={e => setStressLevel(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-faint)', marginTop: '4px' }}>
            <span>1 — Calm & Steady</span>
            <span>3 — Moderate</span>
            <span>5 — High Friction</span>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '16px', marginTop: '8px' }}>
          <Save size={18} /> Save Reflection & Unlock Insights
        </button>
      </form>
    </div>
  );
};
