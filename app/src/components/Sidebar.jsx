import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, selectedHouse, setSelectedHouse, selectedTerm, setSelectedTerm }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'archive', label: 'Global Archive', icon: 'inventory_2', badge: 'Moat Demo' },
    { id: 'member', label: 'Member Analysis', icon: 'groups' },
    { id: 'network', label: 'Network & Heatmap', icon: 'hub', badge: 'NEW' },
    { id: 'briefing', label: 'Briefing Room', icon: 'description' },
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
        <div style={{ width: 40, height: 40, backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined filled" style={{ color: '#ffffff', fontSize: 24 }}>account_balance</span>
        </div>
        <div>
          <h1 className="text-headline-md" style={{ color: 'var(--primary)', fontWeight: 800 }}>LokaSent</h1>
          <p className="text-label-sm" style={{ color: 'var(--outline)', fontSize: 10, letterSpacing: '0.1em' }}>PARLIAMENTARY INTEL</p>
        </div>
      </div>

      {/* House & Term Selectors (Institutional Filter) */}
      <div style={{ padding: '0 16px', marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--surface-container-low)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
          <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 6, textTransform: 'uppercase', fontSize: 10 }}>
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

          <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4, textTransform: 'uppercase', fontSize: 10 }}>
            Parliamentary Term
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
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`} style={{ marginRight: 16 }}>
                {item.icon}
              </span>
              <span className="text-body-md" style={{ flex: 1, fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
              {item.badge && (
                <span className="badge badge-primary" style={{ fontSize: 10, padding: '2px 6px' }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Action Button */}
      <div style={{ padding: '16px 24px', marginTop: 'auto' }}>
        <button 
          onClick={() => setActiveTab('briefing')}
          className="btn btn-primary w-full"
          style={{ padding: '12px', fontSize: 14, boxShadow: 'var(--shadow-sm)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          New Analysis
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--outline)', marginTop: 12 }}>
          LokaSent Engine v2.4 • Moat Verified
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
