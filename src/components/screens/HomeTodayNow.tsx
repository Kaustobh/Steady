import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { Play, ChevronDown, ChevronUp, SplitSquareVertical, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { AddTaskModal } from '../common/AddTaskModal';
import { ThinkingOrb } from 'thinking-orbs';

export const HomeTodayNow: React.FC = () => {
  const { user, tasks, startFocusOnTask, deferTask, deleteTask, setActiveScreen, setActiveTaskId, theme } = useSteady();
  const [expandedWhyNow, setExpandedWhyNow] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Filter tasks
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const topPriorityTask = pendingTasks[0] || tasks[0];
  const secondaryTasks = pendingTasks.slice(1, 4);
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;

  const orbTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    <div
      style={{
        padding: '20px 20px 32px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Context Strip & Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Welcome back, {user.name || 'Friend'}
          </div>
          <h1 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>
            What should I do now?
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ padding: '8px 12px', fontSize: 'var(--text-xs)', gap: '4px' }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Hero Primary Card */}
      {topPriorityTask && topPriorityTask.status !== 'completed' ? (
        <div className="card card-hero" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ThinkingOrb state="working" size={20} theme={orbTheme} /> Top Priority Now
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-surface)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
              }}
            >
              {topPriorityTask.domain} • {topPriorityTask.durationMins} mins
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '12px',
              lineHeight: 1.4,
            }}
          >
            {topPriorityTask.title}
          </h2>

          {/* Rationale Drawer ("Why this now") */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={() => setExpandedWhyNow(!expandedWhyNow)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              <span>Why this now?</span>
              {expandedWhyNow ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expandedWhyNow && (
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  marginTop: '8px',
                  lineHeight: 1.5,
                }}
              >
                {topPriorityTask.whyNow}
              </p>
            )}
          </div>

          {/* Linked Resource Badge if exists */}
          {topPriorityTask.resources && topPriorityTask.resources.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: 'var(--color-primary)',
                marginBottom: '16px',
                backgroundColor: 'var(--color-primary-subtle)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <ShieldCheck size={14} /> Linked reference: {topPriorityTask.resources[0].title}
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => startFocusOnTask(topPriorityTask.id)}
              className="btn-primary"
              style={{ flex: 1, padding: '14px' }}
            >
              <Play size={16} fill="currentColor" /> Start Focus ({topPriorityTask.durationMins}m)
            </button>
            <button
              onClick={() => {
                setActiveTaskId(topPriorityTask.id);
                setActiveScreen('breakdown');
              }}
              className="btn-secondary"
              style={{ padding: '12px 14px' }}
              title="Break down task into micro-steps"
            >
              <SplitSquareVertical size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <ThinkingOrb state="breathing" size={64} theme={orbTheme} style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: '6px' }}>No priority tasks pending</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
            Create your top priority action item for right now to start your focus session.
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ margin: '0 auto' }}>
            <Plus size={16} /> Add Your First Task
          </button>
        </div>
      )}

      {/* Secondary Next Best Options */}
      {secondaryTasks.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '12px',
            }}
          >
            Next Best Options
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {secondaryTasks.map(task => (
              <div
                key={task.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                }}
              >
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      marginBottom: '2px',
                    }}
                  >
                    {task.domain} • {task.durationMins}m
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      lineHeight: 1.3,
                    }}
                  >
                    {task.title}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => startFocusOnTask(task.id)}
                    className="btn-ghost"
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-surface-hover)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                    }}
                  >
                    Start
                  </button>
                  <button
                    onClick={() => deferTask(task.id)}
                    className="btn-ghost"
                    style={{ padding: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}
                    title="Defer task"
                  >
                    Defer
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn-ghost"
                    style={{ padding: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Snapshot Meter */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          backgroundColor: 'var(--color-surface-2)',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
          }}
        >
          {completedCount}/{Math.max(totalTasks, 1)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
            Daily Momentum Snapshot
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            {completedCount > 0
              ? `${completedCount} tasks completed today.`
              : 'Add your first action item to start tracking daily progress.'}
          </div>
          {/* Progress Line */}
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
                width: `${totalTasks > 0 ? Math.min(100, (completedCount / totalTasks) * 100) : 0}%`,
                backgroundColor: 'var(--color-primary)',
                transition: 'width var(--transition-normal)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
