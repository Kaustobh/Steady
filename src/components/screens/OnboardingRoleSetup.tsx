import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import type { UserRole, DomainType } from '../../types';
import { ArrowRight, ArrowLeft, Check, Plus } from 'lucide-react';

export const OnboardingRoleSetup: React.FC = () => {
  const { user, setActiveScreen, updateUserProfile } = useSteady();

  const [name, setName] = useState(user.name || '');
  const roleOptions: UserRole[] = ['Medical intern', 'Student', 'Engineer', 'Executive', 'Homemaker', 'Freelancer'];
  const domainOptions: DomainType[] = [
    'Work',
    'Studying',
    'Presentations',
    'Household',
    'Health & Fitness',
    'Personal growth',
  ];

  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(user.roles && user.roles.length > 0 ? user.roles : ['Student']);
  const [selectedDomains, setSelectedDomains] = useState<DomainType[]>(
    user.domains && user.domains.length > 0 ? user.domains : ['Work', 'Household']
  );

  const [customDomainInput, setCustomDomainInput] = useState('');

  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const toggleDomain = (domain: DomainType) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter(d => d !== domain));
      }
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleAddCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput.trim()) return;
    const clean = customDomainInput.trim();
    if (!selectedDomains.includes(clean)) {
      setSelectedDomains([...selectedDomains, clean]);
    }
    setCustomDomainInput('');
  };

  const handleNext = () => {
    updateUserProfile({ name: name.trim() || 'Friend', roles: selectedRoles, domains: selectedDomains });
    setActiveScreen('onboarding-prefs');
  };

  const isValid = selectedRoles.length >= 1 && selectedDomains.length >= 1;

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
          <button onClick={() => setActiveScreen('onboarding-welcome')} className="btn-ghost" style={{ padding: '6px' }}>
            <ArrowLeft size={20} />
          </button>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Step 1 of 2
          </span>
        </div>

        {/* Section Header */}
        <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: '8px' }}>Introduce Yourself</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
          Steady customizes priority suggestion weights based on your responsibilities.
        </p>

        {/* Name Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Your First Name
          </label>
          <input
            type="text"
            placeholder="e.g. Alex"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 'var(--text-sm)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              outline: 'none',
            }}
          />
        </div>

        {/* Role Chips Multi-select */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            Which roles describe you?
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {roleOptions.map(role => {
              const isSelected = selectedRoles.includes(role);
              return (
                <div
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`chip ${isSelected ? 'selected' : ''}`}
                >
                  {isSelected && <Check size={14} />}
                  <span>{role}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Domains Manager */}
        <div>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            Areas you manage weekly
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {selectedDomains.map(domain => (
              <div
                key={domain}
                onClick={() => toggleDomain(domain)}
                className="chip selected"
              >
                <Check size={14} />
                <span>{domain}</span>
              </div>
            ))}
            {domainOptions.filter(d => !selectedDomains.includes(d)).map(domain => (
              <div
                key={domain}
                onClick={() => toggleDomain(domain)}
                className="chip"
              >
                <span>{domain}</span>
              </div>
            ))}
          </div>

          {/* Add Custom Area Form */}
          <form onSubmit={handleAddCustomDomain} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Add custom area (e.g. Side Business)..."
              value={customDomainInput}
              onChange={e => setCustomDomainInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '8px 12px' }}>
              <Plus size={14} /> Add
            </button>
          </form>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid var(--color-divider)', marginTop: '20px' }}>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            opacity: isValid ? 1 : 0.5,
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}
        >
          Continue to Preferences <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
