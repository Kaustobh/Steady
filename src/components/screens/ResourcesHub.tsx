import React, { useState } from 'react';
import { useSteady } from '../../context/SteadyContext';
import { Search, ShieldCheck, Bookmark, Link2, X, Plus, Trash2, Clock, User, FileText, PlayCircle, BookOpen } from 'lucide-react';
import type { Resource } from '../../types';

export const ResourcesHub: React.FC = () => {
  const { resources, tasks, toggleVerifyResource, attachResourceToTask, addResource, deleteResource } = useSteady();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBadge, setFilterBadge] = useState<string>('All');
  const [attachingResourceId, setAttachingResourceId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Type-Specific State Fields
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Resource['type']>('Notes');
  const [newUrl, setNewUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  // Specialized Fields for high quality data
  const [contentNote, setContentNote] = useState('');
  const [authorSource, setAuthorSource] = useState('');
  const [readingTimeMins, setReadingTimeMins] = useState<number>(5);
  const [timecode, setTimecode] = useState('');

  const filterOptions = ['All', 'Verified by me', 'Notes', 'Clinical Guide', 'Summary', 'Article', 'Book', 'Video'];

  const filteredResources = resources.filter(res => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.authorSource && res.authorSource.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.tagBadges.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterBadge === 'All') return true;
    if (filterBadge === 'Verified by me') return res.isVerified;
    return res.type === filterBadge || res.tagBadges.includes(filterBadge);
  });

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addResource({
      title: newTitle.trim(),
      type: newType,
      url: newUrl.trim() || undefined,
      isVerified,
      tagBadges: newTag.trim() ? [newTag.trim()] : [newType],
      contentNote: contentNote.trim() || undefined,
      authorSource: authorSource.trim() || undefined,
      readingTimeMins: newType === 'Article' ? readingTimeMins : undefined,
      timecode: newType === 'Video' ? timecode.trim() || undefined : undefined,
    });

    // Reset Form
    setNewTitle('');
    setNewUrl('');
    setNewTag('');
    setContentNote('');
    setAuthorSource('');
    setTimecode('');
    setIsAddModalOpen(false);
    setToastMessage(`Saved ${newType} to Resources Hub!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAttach = (taskId: string) => {
    if (attachingResourceId) {
      attachResourceToTask(attachingResourceId, taskId);
      setAttachingResourceId(null);
      setToastMessage('Resource attached to task!');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'Article':
        return <FileText size={14} />;
      case 'Video':
        return <PlayCircle size={14} />;
      case 'Book':
        return <BookOpen size={14} />;
      case 'Clinical Guide':
        return <ShieldCheck size={14} />;
      default:
        return <FileText size={14} />;
    }
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>Resources Hub</h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            High-quality guides, notes, summaries & references.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ padding: '8px 12px', fontSize: 'var(--text-xs)', gap: '4px' }}
        >
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }}
        />
        <input
          type="text"
          placeholder="Search guides, authors, notes, articles..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px 12px 42px',
            fontSize: 'var(--text-xs)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text)',
            outline: 'none',
          }}
        />
      </div>

      {/* Filter Badges */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {filterOptions.map(opt => (
          <div
            key={opt}
            onClick={() => setFilterBadge(opt)}
            className={`chip ${filterBadge === opt ? 'selected' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {opt}
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary-subtle)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Resource Cards List */}
      {filteredResources.length > 0 ? (
        <div className="grid-responsive-2" style={{ gap: '16px' }}>
          {filteredResources.map(res => (
            <div
              key={res.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--color-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getTypeIcon(res.type)} {res.type}
                    </span>
                    {res.isVerified && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: 'var(--color-success)',
                          backgroundColor: 'var(--color-success-bg)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                    {res.title}
                  </h3>

                  {/* Author / Source Meta */}
                  {res.authorSource && (
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} /> {res.authorSource}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => toggleVerifyResource(res.id)}
                    className="btn-ghost"
                    style={{ padding: '6px', color: res.isVerified ? 'var(--color-primary)' : 'var(--color-text-faint)' }}
                    title={res.isVerified ? 'Mark unverified' : 'Mark trusted'}
                  >
                    <Bookmark size={18} fill={res.isVerified ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => deleteResource(res.id)}
                    className="btn-ghost"
                    style={{ padding: '6px', color: 'var(--color-text-faint)' }}
                    title="Delete resource"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Type-Specific Rich Content Notes */}
              {res.contentNote && (
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-surface-2)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    lineHeight: 1.4,
                    boxShadow: 'var(--neu-shadow-inset)',
                  }}
                >
                  "{res.contentNote}"
                </div>
              )}

              {/* Reading Time or Timecode Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {res.readingTimeMins && (
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Clock size={10} /> {res.readingTimeMins} min read
                  </span>
                )}
                {res.timecode && (
                  <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <PlayCircle size={10} /> Timecode @ {res.timecode}
                  </span>
                )}
              </div>

              {/* Tag Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {res.tagBadges.map(badge => (
                  <span
                    key={badge}
                    style={{
                      fontSize: '10px',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-surface)',
                      boxShadow: 'var(--neu-shadow-flat)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    #{badge}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '4px', borderTop: '1px solid var(--color-divider)' }}>
                <button
                  onClick={() => setAttachingResourceId(res.id)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: 'var(--text-xs)', gap: '4px' }}
                >
                  <Link2 size={14} /> Attach to Task
                </button>
                {res.url && res.url !== '#' && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                    style={{ padding: '8px 12px', fontSize: 'var(--text-xs)', textDecoration: 'none' }}
                  >
                    Open Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
          <Bookmark size={32} style={{ color: 'var(--color-primary)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: '6px' }}>No saved resources yet</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Save trusted guides, notes, summaries, or articles with customized fields.
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Add First Resource
          </button>
        </div>
      )}

      {/* Tailored Type-Specific Add Resource Modal */}
      {isAddModalOpen && (
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
          <form
            onSubmit={handleCreateResource}
            className="card"
            style={{
              maxWidth: '400px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              padding: '24px',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>
                New {newType} Resource
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {/* Type Switcher Segmented Pills */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Resource Type
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(['Notes', 'Clinical Guide', 'Summary', 'Article', 'Book', 'Video'] as const).map(t => (
                    <div
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`chip ${newType === t ? 'selected' : ''}`}
                      style={{ fontSize: '11px', padding: '6px 12px' }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Title Field (Dynamic Label) */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  {newType === 'Article' ? 'Article Headline *' : newType === 'Book' ? 'Book Title *' : newType === 'Video' ? 'Video Title *' : newType === 'Clinical Guide' ? 'Guide / Protocol Title *' : 'Resource Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newType === 'Article'
                      ? 'e.g. Modern Sepsis Guidelines 2026'
                      : newType === 'Book'
                      ? 'e.g. Deep Work by Cal Newport'
                      : newType === 'Video'
                      ? 'e.g. ECG Interpretation 10-Min Primer'
                      : 'e.g. Pediatric Dosing Reference'
                  }
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Author / Source / Channel Field */}
              {(newType === 'Article' || newType === 'Book' || newType === 'Video' || newType === 'Summary' || newType === 'Clinical Guide') && (
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    {newType === 'Video' ? 'Channel / Creator' : newType === 'Book' ? 'Author / Speaker' : 'Author / Source'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      newType === 'Video' ? 'e.g. Ninja Nerd Medical' : newType === 'Book' ? 'e.g. Cal Newport' : 'e.g. New England Journal'
                    }
                    value={authorSource}
                    onChange={e => setAuthorSource(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-xs)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Type-Specific Content Note / Takeaway Textarea */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  {newType === 'Notes'
                    ? 'Key Takeaways & Bullet Notes'
                    : newType === 'Clinical Guide'
                    ? 'Key Protocol Steps & Dosages'
                    : newType === 'Summary'
                    ? 'Executive Summary & Core Points'
                    : newType === 'Article'
                    ? 'Key Excerpt / Core Insight'
                    : newType === 'Book'
                    ? 'Core Framework / Chapter Takeaway'
                    : 'Key Concept Summary'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    newType === 'Clinical Guide'
                      ? 'e.g. Maintenance rule: 4-2-1 ml/kg/hr...'
                      : newType === 'Notes'
                      ? 'e.g. 3 main things to verify before shift...'
                      : 'Summarize the single most actionable point...'
                  }
                  value={contentNote}
                  onChange={e => setContentNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Article Specific: Reading Time */}
              {newType === 'Article' && (
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Est. Reading Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readingTimeMins}
                    onChange={e => setReadingTimeMins(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-xs)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Video Specific: Timecode */}
              {newType === 'Video' && (
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Timestamp / Timecode (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 04:15"
                    value={timecode}
                    onChange={e => setTimecode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-xs)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Reference URL */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Reference Link URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Tag Badge */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Tag Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Emergency, Exam, Strategy"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="verified-check"
                  checked={isVerified}
                  onChange={e => setIsVerified(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="verified-check" style={{ fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                  Mark as verified trusted reference
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
              Save {newType} Resource
            </button>
          </form>
        </div>
      )}

      {/* Attach to Task Modal */}
      {attachingResourceId && (
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
          <div
            className="card"
            style={{
              maxWidth: '380px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>Attach to Action Task</h3>
              <button onClick={() => setAttachingResourceId(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {tasks.filter(t => t.status === 'pending').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasks.filter(t => t.status === 'pending').map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleAttach(task.id)}
                    className="card"
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-surface-2)',
                    }}
                  >
                    {task.title} ({task.domain})
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                No active pending tasks available. Create a task first to attach resources.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
