import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ searchQuery, setSearchQuery, selectedHouse, selectedTerm, darkMode, setDarkMode, onOpenLoginModal }) => {
  const { user, lastLoginTime, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="top-header">
      {/* Search Input */}
      <div className="flex items-center" style={{ flex: 1, maxWidth: 480 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 20 }}>
            search
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search debates, speakers, bill categories, or keywords..."
            className="input-field"
            style={{ paddingLeft: 40, width: '100%' }}
          />
        </div>
      </div>

      {/* Status Badges & Controls */}
      <div className="flex items-center gap-6">
        {/* Current Active Filter Indicator */}
        <div className="flex items-center gap-2" style={{ backgroundColor: 'var(--surface-container-low)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--outline-variant)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>policy</span>
          <span className="text-label-sm" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{selectedHouse}</span>
          <span style={{ color: 'var(--outline)' }}>•</span>
          <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>{selectedTerm.split(' ')[0]} Term</span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4" style={{ color: 'var(--outline)' }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} title="System Notifications">notifications</span>
          <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} title="Intelligence Vault Settings">settings</span>
        </div>

        <div style={{ height: 32, width: 1, backgroundColor: 'var(--outline-variant)' }} />

        {/* Academic Project Status & Student Profile Section */}
        <div style={{ position: 'relative' }}>
          {user ? (
            /* Logged In Student / Researcher Profile */
            <div>
              <div 
                className="flex items-center gap-3 auth-user-trigger" 
                onClick={() => setShowMenu(!showMenu)}
                style={{ cursor: 'pointer', padding: '4px 10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-container)' }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div className="flex items-center justify-end gap-1.5 mb-0.5">
                    <span 
                      className="badge"
                      style={{ backgroundColor: 'var(--primary)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}
                    >
                      STUDENT LEAD
                    </span>
                    <p className="text-label-md font-bold" style={{ color: 'var(--on-surface)', margin: 0 }}>Achintya Rai</p>
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--outline)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px', fontWeight: 600 }}>
                    B.Tech Final Year CS • Roll: 2026-CS
                  </p>
                </div>
                <div style={{ position: 'relative', width: 38, height: 38 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '2px solid var(--primary)', backgroundColor: 'var(--secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>person</span>
                  </div>
                  <span className="auth-online-dot" style={{ backgroundColor: '#16a34a' }} />
                </div>
              </div>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div className="auth-menu-backdrop" onClick={() => setShowMenu(false)} />
                  <div className="auth-user-dropdown" style={{ width: 280 }}>
                    <div className="auth-dropdown-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--outline-variant)' }}>
                      <p className="text-label-md font-bold" style={{ color: 'var(--on-surface)', fontSize: 14 }}>Achintya Rai & Project Team</p>
                      <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>Department of Computer Science & Engineering</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="badge" style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                          Major Project Thesis
                        </span>
                        <span className="text-label-sm" style={{ color: 'var(--outline)' }}>Session 2025-26</span>
                      </div>
                    </div>

                    <div className="auth-dropdown-body" style={{ padding: '12px 16px' }}>
                      <div className="auth-info-row flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-label-sm" style={{ fontSize: 16, color: 'var(--primary)' }}>school</span>
                        <span className="text-body-sm" style={{ fontSize: 12 }}>Faculty Guide: Dr. Assessment Panel</span>
                      </div>
                      <div className="auth-info-row flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-label-sm" style={{ fontSize: 16, color: 'var(--primary)' }}>terminal</span>
                        <span className="text-body-sm" style={{ fontSize: 12 }}>Stack: Python 3.14 + React + NetworkX</span>
                      </div>
                      <div className="auth-info-row flex items-center gap-2">
                        <span className="material-symbols-outlined text-label-sm" style={{ fontSize: 16, color: '#16a34a' }}>verified</span>
                        <span className="text-body-sm" style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Stage 1/2 Live Scraper Active</span>
                      </div>
                    </div>

                    <div className="auth-dropdown-actions" style={{ padding: '10px 16px', borderTop: '1px solid var(--outline-variant)' }}>
                      <button 
                        className="btn btn-secondary w-full text-left flex items-center gap-2"
                        style={{ padding: '8px 12px', fontSize: 12, borderRadius: 6, marginBottom: 6, width: '100%' }}
                        onClick={() => { setShowMenu(false); onOpenLoginModal(); }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>manage_accounts</span>
                        Faculty / Examiner Mode Demo
                      </button>
                      <button 
                        className="btn w-full text-left flex items-center gap-2"
                        style={{ padding: '8px 12px', fontSize: 12, borderRadius: 6, color: 'var(--error)', width: '100%', border: '1px solid var(--outline-variant)' }}
                        onClick={() => { setShowMenu(false); logout(); }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                        Reset Session
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged Out / Examiner Mode Button */
            <button 
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border"
              style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--surface-container)', cursor: 'pointer' }}
              onClick={onOpenLoginModal}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fff' }}>school</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p className="text-label-md font-bold" style={{ margin: 0, lineHeight: 1.2, fontSize: 12, color: 'var(--on-surface)' }}>Project Demo Mode</p>
                <p style={{ fontSize: 9, color: 'var(--primary)', margin: 0, fontWeight: 700 }}>Faculty / Examiner Access</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
