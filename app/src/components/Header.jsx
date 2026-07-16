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

        {/* Authentication Section */}
        <div style={{ position: 'relative' }}>
          {user ? (
            /* Logged In User Headshot & Menu Trigger */
            <div>
              <div 
                className="flex items-center gap-3 auth-user-trigger" 
                onClick={() => setShowMenu(!showMenu)}
                style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--radius-md)' }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div className="flex items-center justify-end gap-1.5 mb-0.5">
                    <span 
                      className="auth-clearance-pill"
                      style={{ backgroundColor: user.badgeColor || 'var(--primary)', color: '#fff' }}
                    >
                      L{user.clearance} {user.clearance === 4 ? 'EXEC' : user.clearance === 3 ? 'ANALYST' : 'STAFF'}
                    </span>
                    <p className="text-label-md font-bold" style={{ color: 'var(--on-surface)', margin: 0 }}>{user.name.split(' ')[0]}</p>
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--outline)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
                    {user.role}
                  </p>
                </div>
                <div style={{ position: 'relative', width: 40, height: 40 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '2px solid var(--primary)', backgroundColor: 'var(--secondary-container)' }}>
                    <img 
                      src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span className="auth-online-dot" />
                </div>
              </div>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div className="auth-menu-backdrop" onClick={() => setShowMenu(false)} />
                  <div className="auth-user-dropdown">
                    <div className="auth-dropdown-header">
                      <p className="text-label-md font-bold" style={{ color: 'var(--on-surface)' }}>{user.name}</p>
                      <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="auth-clearance-pill" style={{ backgroundColor: user.badgeColor || 'var(--primary)', color: '#fff' }}>
                          Level {user.clearance} Clearance
                        </span>
                        <span className="text-label-sm" style={{ color: 'var(--outline)' }}>{user.sessionId}</span>
                      </div>
                    </div>

                    <div className="auth-dropdown-body">
                      <div className="auth-info-row">
                        <span className="material-symbols-outlined text-label-sm">domain</span>
                        <span className="text-body-sm">{user.department}</span>
                      </div>
                      {lastLoginTime && (
                        <div className="auth-info-row">
                          <span className="material-symbols-outlined text-label-sm">schedule</span>
                          <span className="text-body-sm">Logged: {lastLoginTime}</span>
                        </div>
                      )}
                      <div className="auth-info-row">
                        <span className="material-symbols-outlined text-label-sm" style={{ color: 'var(--success)' }}>verified</span>
                        <span className="text-body-sm" style={{ color: 'var(--success)' }}>TLS 1.3 Active • Audited</span>
                      </div>
                    </div>

                    <div className="auth-dropdown-actions">
                      <button 
                        className="auth-switch-role-btn"
                        onClick={() => { setShowMenu(false); onOpenLoginModal(); }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>switch_account</span>
                        Switch Clearance Tier
                      </button>
                      <button 
                        className="auth-logout-btn"
                        onClick={() => { setShowMenu(false); logout(); }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                        Sign Out / Terminate
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged Out Login Button */
            <button 
              className="auth-login-trigger-btn"
              onClick={onOpenLoginModal}
            >
              <div className="auth-lock-circle">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p className="text-label-md font-bold" style={{ margin: 0, lineHeight: 1.2 }}>Security Login</p>
                <p style={{ fontSize: 10, color: 'var(--outline)', margin: 0, textTransform: 'uppercase' }}>Level 1 Public</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
