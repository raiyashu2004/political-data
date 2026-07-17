import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, selectedHouse, setSelectedHouse, selectedTerm, setSelectedTerm }) => {
  const navItems = [
    { id: 'dashboard', label: 'System Overview & Polarization Index', icon: 'dashboard' },
    { id: 'archive', label: 'Scraped Corpus & OCR Transcripts', icon: 'inventory_2', badge: 'Stage 1/2' },
    { id: 'member', label: 'MP Stance & Attendance Tracker', icon: 'groups' },
    { id: 'network', label: 'NetworkX Alignment & Heatmaps', icon: 'hub', badge: 'Graph ML' },
    { id: 'briefing', label: 'Methodology & Report Export', icon: 'description' },
  ];

  const terms = [
    'All Historical Terms',
    '18th Lok Sabha (2024-Present)',
    '17th Lok Sabha (2019-2024)',
    '16th Lok Sabha (2014-2019)',
    '15th Lok Sabha (2009-2014)'
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 mb-6">
        <div style={{ width: 42, height: 42, backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined filled" style={{ color: '#ffffff', fontSize: 26 }}>school</span>
        </div>
        <div>
          <h1 className="text-headline-md" style={{ color: 'var(--primary)', fontWeight: 800, lineHeight: 1.1 }}>LokaSent: PDPT</h1>
          <p className="text-label-sm" style={{ color: 'var(--outline)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', marginTop: 2 }}>FINAL YEAR CS MAJOR PROJECT</p>
        </div>
      </div>

      {/* House & Term Selectors (Institutional Filter) */}
      <div style={{ padding: '0 16px', marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--surface-container-low)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
          <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 6, textTransform: 'uppercase', fontSize: 10, fontWeight: 700 }}>
            Legislative House
          </label>
          <div className="flex gap-1 mb-3">
            <button 
              onClick={() => setSelectedHouse('Lok Sabha')}
              style={{
                flex: 1, padding: '6px 8px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                backgroundColor: selectedHouse === 'Lok Sabha' ? 'var(--primary)' : 'transparent',
                color: selectedHouse === 'Lok Sabha' ? '#ffffff' : 'var(--on-surface)'
              }}
            >
              Lok Sabha
            </button>
            <button 
              onClick={() => setSelectedHouse('Rajya Sabha')}
              style={{
                flex: 1, padding: '6px 8px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                backgroundColor: selectedHouse === 'Rajya Sabha' ? 'var(--primary)' : 'transparent',
                color: selectedHouse === 'Rajya Sabha' ? '#ffffff' : 'var(--on-surface)'
              }}
            >
              Rajya Sabha
            </button>
          </div>

          <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4, textTransform: 'uppercase', fontSize: 10, fontWeight: 700 }}>
            Parliamentary Term Filter
          </label>
          <select 
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            style={{
              width: '100%', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--outline-variant)',
              backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)', fontSize: 12, outline: 'none'
            }}
          >
            {terms.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-col" style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div 
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`} style={{ marginRight: 14 }}>
                {item.icon}
              </span>
              <span className="text-body-md" style={{ flex: 1, fontWeight: isActive ? 700 : 500, fontSize: 13 }}>
                {item.label}
              </span>
              {item.badge && (
                <span className="badge badge-primary" style={{ fontSize: 9, padding: '2px 6px', fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Academic Notice & Action Button */}
      <div style={{ padding: '16px 24px', marginTop: 'auto', borderTop: '1px solid var(--outline-variant)' }}>
        <button 
          onClick={() => setActiveTab('briefing')}
          className="btn btn-primary w-full"
          style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>summarize</span>
          View Project Report
        </button>
        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--on-surface-variant)', marginTop: 12, lineHeight: 1.4 }}>
          <p style={{ fontWeight: 700, margin: 0, color: 'var(--primary)' }}>B.Tech Final Year Thesis</p>
          <p style={{ margin: 0, opacity: 0.8 }}>Dept. of Computer Science & Engg.</p>
          <p style={{ margin: 0, opacity: 0.7 }}>NLP • Graph Theory • Full Stack</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
