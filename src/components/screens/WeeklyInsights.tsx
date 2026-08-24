import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { ArrowLeft, Check } from 'lucide-react';
import { ThinkingOrb } from 'thinking-orbs';

export const WeeklyInsights: React.FC = () => {
  const { weeklyInsights, tasks, user, setActiveScreen, theme } = useSteady();
  const [appliedAction, setAppliedAction] = useState<string | null>(null);

  const handleApplyRecommendation = (id: string) => {
    setAppliedAction(id);
    setTimeout(() => setAppliedAction(null), 3000);
  };

  const orbTheme = theme === 'dark' ? 'dark' : 'light';

  // Compute dynamic domain time distribution based on user's tasks
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const userDomains = user.domains && user.domains.length > 0 ? user.domains : ['Work', 'Life'];

  const domainDistribution = userDomains.map(domain => {
    const domainTasks = tasks.filter(t => t.domain === domain);
    const domainCompleted = domainTasks.filter(t => t.status === 'completed');
    const totalMins = domainTasks.reduce((sum, t) => sum + t.durationMins, 0);
    const totalAllMins = tasks.reduce((sum, t) => sum + t.durationMins, 0) || 1;
    const pct = Math.round((totalMins / totalAllMins) * 100);

    return {
      domain,
      pct: pct || 0,
      hoursLabel: (totalMins / 60).toFixed(1) + ' hrs',
      count: domainCompleted.length,
    };
  });

  const totalCompletedCount = completedTasks.length;
  const steadyRateScore = Math.min(95, 60 + totalCompletedCount * 5);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setActiveScreen('review')} className="btn-ghost" style={{ padding: '6px' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: 'var(--text-xl)' }}>Weekly Insights</h1>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Data-backed focus patterns & adaptive recommendations.
            </p>
          </div>
        </div>

        <ThinkingOrb state="composing" size={20} theme={orbTheme} />
      </div>

      {/* Applied Feedback Banner */}
      {appliedAction && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-success)',
            backgroundColor: 'var(--color-success-bg)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} /> Recommendation applied to your priority recommendation engine!
        </div>
      )}

      {/* Top Weekly Summary Banner */}
      <div
        className="card card-hero"
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <ThinkingOrb state="working" size={64} theme={orbTheme} />
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
            Weekly Focus Score
          </div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
            {steadyRateScore}% Steady Rate
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {totalCompletedCount > 0
              ? `${totalCompletedCount} priority tasks completed this week with reduced context switching.`
              : 'Complete your first focus task to generate live weekly momentum analytics.'}
          </div>
        </div>
      </div>

      {/* Insights Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {weeklyInsights.map((insight, idx) => {
          const states = ['searching', 'solving', 'weaving'] as const;
          const currentOrbState = states[idx % states.length];

          return (
            <div
              key={insight.id}
              className="card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ThinkingOrb state={currentOrbState} size={20} theme={orbTheme} />
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                    {insight.title}
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {insight.metric}
                </span>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {insight.description}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text)',
                  borderLeft: '3px solid var(--color-primary)',
                }}
              >
                <strong>Recommendation:</strong> {insight.recommendation}
              </div>

              {insight.actionableCTA && (
                <button
                  onClick={() => handleApplyRecommendation(insight.id)}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: 'var(--text-xs)',
                    marginTop: '4px',
                    gap: '6px',
                  }}
                >
                  <ThinkingOrb state="connecting" size={20} theme={orbTheme} />
                  {insight.actionableCTA}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Domain Time Distribution Bar Chart */}
      <div className="card" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px' }}>
          Weekly Time & Domain Distribution
        </h3>
        {tasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {domainDistribution.map(item => (
              <div key={item.domain}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{item.domain}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.hoursLabel} ({item.pct}%)</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'var(--color-divider)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.pct}%`,
                      backgroundColor: 'var(--color-primary)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>
            No task data logged yet. Create tasks across your domains to view time distribution.
          </div>
        )}
      </div>
    </div>
  );
};
