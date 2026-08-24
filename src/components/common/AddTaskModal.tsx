import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { X, Plus } from 'lucide-react';
import { ThinkingOrb } from 'thinking-orbs';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: string;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, defaultDomain }) => {
  const { user, addTask, theme } = useSteady();

  const userDomains = user.domains && user.domains.length > 0 ? user.domains : ['Work', 'Study', 'Life'];

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<string>(defaultDomain || userDomains[0]);
  const [durationMins, setDurationMins] = useState<number>(20);
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [whyNow, setWhyNow] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      domain: domain || userDomains[0],
      durationMins,
      energyLevel,
      whyNow: whyNow.trim() || `Focus block tailored for your ${energyLevel.toLowerCase()} energy window.`,
    });

    setTitle('');
    setWhyNow('');
    onClose();
  };

  const orbTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 100,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'var(--color-surface)',
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThinkingOrb state="working" size={20} theme={orbTheme} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>New Priority Action</h3>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Action Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Draft presentation outline..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-text)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Area / Domain
              </label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 'var(--text-xs)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-text)',
                }}
              >
                {userDomains.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Est. Duration
              </label>
              <select
                value={durationMins}
                onChange={e => setDurationMins(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 'var(--text-xs)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-2)',
                  color: 'var(--color-text)',
                }}
              >
                <option value={10}>10 mins</option>
                <option value={15}>15 mins</option>
                <option value={20}>20 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Required Energy Level
            </label>
            <div className="segmented-control">
              {(['Low', 'Medium', 'High'] as const).map(lvl => (
                <div
                  key={lvl}
                  onClick={() => setEnergyLevel(lvl)}
                  className={`segmented-option ${energyLevel === lvl ? 'active' : ''}`}
                >
                  {lvl}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Why This Now? (Rationale)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Quick win before next meeting..."
              value={whyNow}
              onChange={e => setWhyNow(e.target.value)}
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
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
          <Plus size={16} /> Save Action to Priority Queue
        </button>
      </form>
    </div>
  );
};
