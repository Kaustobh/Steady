import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { ArrowRight, Sparkles, X, CheckCircle2 } from 'lucide-react';

export const OnboardingWelcome: React.FC = () => {
  const { setActiveScreen } = useSteady();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100%',
        padding: '32px 24px',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Top Branding */}
      <div style={{ textAlign: 'center', paddingTop: '16px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontFamily: 'var(--font-display)',
            fontWeight: 'bold',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          S
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          Steady
        </div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginTop: '4px',
          }}
        >
          Calm control for chaotic days
        </div>
      </div>

      {/* Hero Visual & Headline */}
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        {/* Wireframe Hero Card Graphic */}
        <div
          className="card card-hero"
          style={{
            padding: '24px',
            marginBottom: '28px',
            textAlign: 'left',
            borderColor: 'var(--color-primary-highlight)',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} /> Top priority now
          </div>
          <div
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '6px',
            }}
          >
            Focus block: High-impact action item
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.4,
            }}
          >
            "Matches your current energy window and available schedule."
          </div>
        </div>

        <h1
          style={{
            fontSize: 'var(--text-xl)',
            marginBottom: '12px',
            color: 'var(--color-text)',
          }}
        >
          Plan around reality, not perfect schedules.
        </h1>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            maxWidth: '320px',
            margin: '0 auto',
          }}
        >
          For work, study, home, and life when your day keeps changing. Make one clear decision at a time.
        </p>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => setActiveScreen('onboarding-roles')}
          className="btn-primary"
          style={{ width: '100%', padding: '16px' }}
        >
          Set up my workflow <ArrowRight size={18} />
        </button>

        <button
          onClick={() => setShowPreviewModal(true)}
          className="btn-ghost"
          style={{ width: '100%', padding: '12px', textAlign: 'center' }}
        >
          Preview app features
        </button>
      </div>

      {/* Read-Only Product Tour Modal */}
      {showPreviewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '380px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              padding: '24px',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Product Tour Preview</h3>
              <button onClick={() => setShowPreviewModal(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--color-text)' }}>Dynamic Priority Engine:</strong> Re-evaluates your top task instantly when plans shift.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--color-text)' }}>Focus Mode & Interruption Logger:</strong> Unhurried countdown with friction-free distraction tracking.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--color-text)' }}>Verified Resources Hub:</strong> Attach trusted guides directly to active tasks.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowPreviewModal(false);
                setActiveScreen('onboarding-roles');
              }}
              className="btn-primary"
              style={{ width: '100%', marginTop: '24px' }}
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
