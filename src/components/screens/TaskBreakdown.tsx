import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { ArrowLeft, Square, Play, Sparkles, BookMarked, Plus, X } from 'lucide-react';

export const TaskBreakdown: React.FC = () => {
  const { activeTask, toggleSubstep, autoSplitTask, startFocusOnTask, setActiveScreen } = useSteady();
  const [showAutoSplitModal, setShowAutoSplitModal] = useState(false);
  const [customStepText, setCustomStepText] = useState('');

  if (!activeTask) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>No active task selected.</p>
        <button onClick={() => setActiveScreen('home')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const handleAutoSplit = () => {
    // Simulated smart micro-steps based on domain
    const generatedSteps = [
      'Gather authoritative sources (5m)',
      'Extract key figures & metrics (10m)',
      'Draft core conclusions (10m)',
      'Final clarity review (5m)',
    ];
    autoSplitTask(activeTask.id, generatedSteps);
    setShowAutoSplitModal(false);
  };

  const handleAddCustomStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStepText.trim()) return;
    autoSplitTask(activeTask.id, [customStepText.trim()]);
    setCustomStepText('');
  };

  const completedStepsCount = activeTask.substeps.filter(s => s.isDone).length;

  return (
    <div
      style={{
        padding: '20px 20px 32px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Navigation Top */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => setActiveScreen('home')} className="btn-ghost" style={{ padding: '6px' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {activeTask.domain} • {activeTask.durationMins}m
          </span>
          <h1 style={{ fontSize: 'var(--text-lg)', lineHeight: 1.3 }}>{activeTask.title}</h1>
        </div>
      </div>

      {/* Target Outcome Card */}
      <div className="card card-elevated" style={{ padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
          Target Outcome
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>
          "Complete micro-preparation without getting bogged down in endless reading or details."
        </p>
      </div>

      {/* Micro-Steps Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Action Steps ({completedStepsCount}/{activeTask.substeps.length})
          </div>
          <button
            onClick={() => setShowAutoSplitModal(true)}
            className="btn-ghost"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600 }}
          >
            <Sparkles size={14} /> Auto-Split Task
          </button>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeTask.substeps.map(step => (
            <div
              key={step.id}
              onClick={() => toggleSubstep(activeTask.id, step.id)}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                cursor: 'pointer',
                backgroundColor: step.isDone ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                opacity: step.isDone ? 0.7 : 1,
                transition: 'all var(--transition-fast)',
              }}
            >
              {step.isDone ? (
                <CheckCircle2Icon />
              ) : (
                <Square size={18} style={{ color: 'var(--color-text-faint)' }} />
              )}
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  textDecoration: step.isDone ? 'line-through' : 'none',
                  color: step.isDone ? 'var(--color-text-muted)' : 'var(--color-text)',
                  fontWeight: 500,
                }}
              >
                {step.title}
              </span>
            </div>
          ))}

          {/* Add Step Input */}
          <form onSubmit={handleAddCustomStep} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input
              type="text"
              placeholder="Add a 5-minute micro step..."
              value={customStepText}
              onChange={e => setCustomStepText(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '10px 14px' }}>
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Linked Resources Area */}
      <div>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Linked References
        </div>
        {activeTask.resources && activeTask.resources.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeTask.resources.map(res => (
              <div
                key={res.id}
                className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookMarked size={16} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{res.title}</span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Verified
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>
            No references attached yet. Go to Resources Hub to attach material.
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button
          onClick={() => startFocusOnTask(activeTask.id)}
          className="btn-primary"
          style={{ flex: 1, padding: '14px' }}
        >
          <Play size={16} fill="currentColor" /> Start Focus Now
        </button>
      </div>

      {/* Auto Split Sheet Modal */}
      {showAutoSplitModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 100,
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>
                  Break Down Into Micro Steps
                </h3>
              </div>
              <button onClick={() => setShowAutoSplitModal(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Decompose "{activeTask.title}" into 4 clear 5–10 minute actions to overcome starting friction.
            </p>

            <button onClick={handleAutoSplit} className="btn-primary" style={{ width: '100%', padding: '14px' }}>
              Confirm & Append 4 Steps
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle2Icon = () => (
  <div
    style={{
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      backgroundColor: 'var(--color-primary)',
      color: '#FFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
    }}
  >
    ✓
  </div>
);
