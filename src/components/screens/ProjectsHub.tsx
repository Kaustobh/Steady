import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import type { DomainType } from '../../types';
import { Plus, CheckCircle2, X, FolderKanban, Trash2 } from 'lucide-react';
import { AddTaskModal } from '../common/AddTaskModal';

export const ProjectsHub: React.FC = () => {
  const { projects, user, addProject, deleteProject } = useSteady();
  const [selectedDomain, setSelectedDomain] = useState<DomainType | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTaskDomain, setAddTaskDomain] = useState<string | null>(null);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDomain, setNewProjectDomain] = useState<DomainType>('Work');
  const [newMilestone, setNewMilestone] = useState('');

  const userDomains = user.domains && user.domains.length > 0 ? user.domains : ['Work', 'Study', 'Life'];
  const domainOptions: string[] = ['All', ...userDomains];

  const filteredProjects = selectedDomain === 'All'
    ? projects
    : projects.filter(p => p.domain === selectedDomain);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    addProject(newProjectName.trim(), newProjectDomain || userDomains[0], newMilestone.trim() || 'Next step planning');
    setNewProjectName('');
    setNewMilestone('');
    setShowAddModal(false);
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
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>Responsibility Projects</h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            High-level buckets kept simple & clutter-free.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: '8px 12px', fontSize: 'var(--text-xs)', gap: '4px' }}
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {domainOptions.map(domain => (
          <div
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`chip ${selectedDomain === domain ? 'selected' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {domain}
          </div>
        ))}
      </div>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="grid-responsive-2" style={{ gap: '16px' }}>
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-primary-subtle)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {project.domain}
                  </span>
                  <h3
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginTop: '6px',
                    }}
                  >
                    {project.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {project.progress}%
                  </span>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="btn-ghost"
                    style={{ padding: '4px', color: 'var(--color-text-faint)' }}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
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
                    width: `${project.progress}%`,
                    backgroundColor: 'var(--color-primary)',
                    transition: 'width var(--transition-normal)',
                  }}
                />
              </div>

              {/* Next Milestone & Add Task */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={14} style={{ color: 'var(--color-primary)' }} /> Next: {project.nextMilestone}
                </div>

                <button
                  onClick={() => setAddTaskDomain(project.domain)}
                  className="btn-ghost"
                  style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600, gap: '2px' }}
                >
                  <Plus size={12} /> Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
          <FolderKanban size={32} style={{ color: 'var(--color-primary)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: '6px' }}>No projects created yet</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Group your tasks into clear responsibility buckets to keep your mind unhurried and organized.
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={16} /> Create Project
          </button>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
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
            onSubmit={handleCreateProject}
            className="card"
            style={{
              maxWidth: '380px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>Create New Project</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Q3 Operations Strategy"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
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

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Area / Domain
                </label>
                <select
                  value={newProjectDomain}
                  onChange={e => setNewProjectDomain(e.target.value as DomainType)}
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
                  Next Milestone
                </label>
                <input
                  type="text"
                  placeholder="e.g., Complete initial review"
                  value={newMilestone}
                  onChange={e => setNewMilestone(e.target.value)}
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
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* Add Task Modal for linked project */}
      <AddTaskModal
        isOpen={Boolean(addTaskDomain)}
        onClose={() => setAddTaskDomain(null)}
        defaultDomain={addTaskDomain || undefined}
      />
    </div>
  );
};
