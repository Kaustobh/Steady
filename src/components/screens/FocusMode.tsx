import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { Play, Pause, AlertCircle, CheckCircle2, X, PlusCircle, Coffee, Sparkles } from 'lucide-react';
import type { InterruptionLog } from '../../types';

export const FocusMode: React.FC = () => {
  const {
    activeTask,
    focusSecondsRemaining,
    isFocusRunning,
    startFocusTimer,
    pauseFocusTimer,
    addExtraFocusMinutes,
    completeTask,
    logInterruption,
    setActiveScreen,
  } = useSteady();

  const [showInterruptionSheet, setShowInterruptionSheet] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Break Mode State
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [breakSecondsRemaining, setBreakSecondsRemaining] = useState<number>(300); // default 5m
  const [breakTotalSecs, setBreakTotalSecs] = useState<number>(300);
  const [isBreakRunning, setIsBreakRunning] = useState(false);

  if (!activeTask) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>No active task selected for focus.</p>
        <button onClick={() => setActiveScreen('home')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Format Time (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const totalSecs = activeTask.durationMins * 60;
  const progressPercent = isBreakMode
    ? Math.max(0, Math.min(100, ((breakTotalSecs - breakSecondsRemaining) / breakTotalSecs) * 100))
    : Math.max(0, Math.min(100, ((totalSecs - focusSecondsRemaining) / totalSecs) * 100));

  const handleAdd15Mins = () => {
    addExtraFocusMinutes(15);
    setToastMessage('+15 Minutes added to focus timer!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleStartBreak = (mins: number) => {
    pauseFocusTimer();
    setBreakTotalSecs(mins * 60);
    setBreakSecondsRemaining(mins * 60);
    setIsBreakMode(true);
    setIsBreakRunning(true);
    setShowBreakModal(false);
    setToastMessage(`Started ${mins}-minute recharge break!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleEndBreak = () => {
    setIsBreakMode(false);
    setIsBreakRunning(false);
    setToastMessage('Break finished! Ready to resume focus.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLogReason = (reason: InterruptionLog['reason']) => {
    logInterruption(activeTask.id, reason);
    setShowInterruptionSheet(false);
    setToastMessage('Interruption logged for reflection — no stress.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleFinishTask = () => {
    completeTask(activeTask.id);
    setActiveScreen('home');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-bg)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '32px 24px',
        userSelect: 'none',
      }}
    >
      {/* Top Utility Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isBreakMode ? 'var(--color-success)' : 'var(--color-primary)',
              backgroundColor: isBreakMode ? 'var(--color-success-bg)' : 'var(--color-primary-subtle)',
              boxShadow: 'var(--neu-shadow-flat)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {isBreakMode ? 'RECHARGE BREAK' : 'FOCUS MODE'}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {activeTask.domain}
          </span>
        </div>

        <button
          onClick={() => setActiveScreen('home')}
          className="btn-ghost"
          style={{ padding: '8px', borderRadius: '50%' }}
          title="Exit Focus Mode"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Focus Centerpiece */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto 0',
        }}
      >
        {/* Timer Circular Progress Graphic */}
        <div
          style={{
            position: 'relative',
            width: '240px',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="var(--color-divider)"
              strokeWidth="8"
            />
            <circle
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke={isBreakMode ? 'var(--color-success)' : 'var(--color-primary)'}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>

          {/* Large Countdown Display */}
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '44px',
                fontWeight: 700,
                fontFamily: 'var(--font-body)',
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
                lineHeight: 1,
              }}
            >
              {formatTime(isBreakMode ? breakSecondsRemaining : focusSecondsRemaining)}
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                marginTop: '8px',
                fontWeight: 500,
              }}
            >
              {isBreakMode
                ? isBreakRunning
                  ? 'Recharging...'
                  : 'Break Paused'
                : isFocusRunning
                ? 'In Session'
                : 'Paused'}
            </div>
          </div>
        </div>

        {/* Task Title & Substep Indicator */}
        <h1
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            maxWidth: '320px',
            marginBottom: '8px',
            color: 'var(--color-text)',
          }}
        >
          {isBreakMode ? 'Rest & Recover' : activeTask.title}
        </h1>

        {isBreakMode ? (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', maxWidth: '300px' }}>
            Step away, stretch, drink water, or take slow deep breaths.
          </p>
        ) : (
          activeTask.substeps.length > 0 && (
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-surface)',
                boxShadow: 'var(--neu-shadow-flat)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Substep: {activeTask.substeps.find(s => !s.isDone)?.title || 'All substeps completed'}
            </div>
          )
        )}

        {/* Dynamic Toast Notification */}
        {toastMessage && (
          <div
            style={{
              marginTop: '16px',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-surface)',
              boxShadow: 'var(--neu-shadow-flat)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>

      {/* Control Actions Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Quick Utility Chips (+15 Mins & Take Break) */}
        {!isBreakMode && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={handleAdd15Mins}
              className="chip"
              style={{ fontSize: 'var(--text-xs)', padding: '8px 14px', gap: '6px' }}
              title="Add 15 minutes to session"
            >
              <PlusCircle size={14} style={{ color: 'var(--color-primary)' }} /> +15 Mins
            </button>

            <button
              onClick={() => setShowBreakModal(true)}
              className="chip"
              style={{ fontSize: 'var(--text-xs)', padding: '8px 14px', gap: '6px' }}
              title="Pause and take a break"
            >
              <Coffee size={14} style={{ color: 'var(--color-warning)' }} /> Take a Break
            </button>
          </div>
        )}

        {/* Break Mode Return Control */}
        {isBreakMode && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleEndBreak}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: 'var(--text-xs)', gap: '6px' }}
            >
              <Sparkles size={16} /> End Break & Resume Focus
            </button>
          </div>
        )}

        {/* Primary Controls Row */}
        {!isBreakMode && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            {/* Pause / Resume */}
            <button
              onClick={isFocusRunning ? pauseFocusTimer : startFocusTimer}
              className="btn-primary"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                padding: 0,
                boxShadow: 'var(--neu-shadow-flat)',
              }}
              title={isFocusRunning ? 'Pause Session' : 'Resume Session'}
            >
              {isFocusRunning ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
            </button>

            {/* Log Interruption */}
            <button
              onClick={() => setShowInterruptionSheet(true)}
              className="btn-secondary"
              style={{
                height: '48px',
                padding: '0 16px',
                fontSize: 'var(--text-xs)',
                gap: '6px',
              }}
            >
              <AlertCircle size={16} /> Log Interruption
            </button>

            {/* Complete Task */}
            <button
              onClick={handleFinishTask}
              className="btn-secondary"
              style={{
                height: '48px',
                padding: '0 16px',
                fontSize: 'var(--text-xs)',
                gap: '6px',
                color: 'var(--color-success)',
              }}
            >
              <CheckCircle2 size={16} /> Complete
            </button>
          </div>
        )}
      </div>

      {/* Take a Break Selection Modal */}
      {showBreakModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
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
              maxWidth: '360px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coffee size={18} style={{ color: 'var(--color-warning)' }} /> Select Break Duration
              </h3>
              <button onClick={() => setShowBreakModal(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Pause focus to protect your mental energy and prevent burnout.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => handleStartBreak(5)}
                className="btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px', fontSize: 'var(--text-xs)' }}
              >
                <span>🍵 5-Min Quick Recharge</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>5:00</span>
              </button>

              <button
                onClick={() => handleStartBreak(15)}
                className="btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px', fontSize: 'var(--text-xs)' }}
              >
                <span>☕ 15-Min Deep Restoration</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>15:00</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interruption Logger Quick Sheet Modal */}
      {showInterruptionSheet && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(6px)',
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
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>
                What caused the pause?
              </h3>
              <button onClick={() => setShowInterruptionSheet(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Logging interruptions provides data for your weekly insights to optimize future focus windows.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleLogReason('Urgent work')}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '14px' }}
              >
                🏥 Urgent work / Emergency call
              </button>
              <button
                onClick={() => handleLogReason('Not enough clarity')}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '14px' }}
              >
                ❓ Not enough clarity or missing info
              </button>
              <button
                onClick={() => handleLogReason('Lost focus')}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '14px' }}
              >
                🧠 Fatigue or lost focus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
