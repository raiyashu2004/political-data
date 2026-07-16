import React, { useState } from 'react';
import { useAuth, PRESET_ROLES } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, requiredClearance = 1, customMessage = null }) => {
  const { loginWithPreset, loginWithCredentials } = useAuth();
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' or 'credentials'
  const [email, setEmail] = useState('director@sansad.intel.in');
  const [password, setPassword] = useState('lokasent2026');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('executive');

  if (!isOpen) return null;

  const handlePresetSubmit = (roleId) => {
    const role = PRESET_ROLES.find(r => r.id === roleId);
    if (requiredClearance > 1 && role && role.clearance < requiredClearance) {
      setError(`Level ${requiredClearance} clearance required for this operation. Selected role has Level ${role.clearance}.`);
      return;
    }
    setError('');
    loginWithPreset(roleId, remember);
    onClose();
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide valid credentials.');
      return;
    }
    setError('');
    loginWithCredentials(email, password, remember);
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div 
        className="auth-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="flex items-center gap-3">
            <div className="auth-shield-icon">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>admin_panel_settings</span>
            </div>
            <div>
              <h2 className="text-title-lg font-bold" style={{ color: 'var(--on-surface)' }}>
                LokaSent Intelligence Gateway
              </h2>
              <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Parliamentary Polarization & Debate Analysis Protocol
              </p>
            </div>
          </div>
          <button 
            className="auth-close-btn"
            onClick={onClose}
            title="Close Portal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Optional Warning Banner if triggered by restricted access */}
        {customMessage ? (
          <div className="auth-alert-box">
            <span className="material-symbols-outlined" style={{ color: 'var(--warning)' }}>lock</span>
            <span className="text-body-sm font-medium">{customMessage}</span>
          </div>
        ) : requiredClearance > 1 && (
          <div className="auth-alert-box">
            <span className="material-symbols-outlined" style={{ color: 'var(--warning)' }}>security</span>
            <span className="text-body-sm font-medium">
              Level {requiredClearance}+ clearance required to access classified strategic systems.
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => { setActiveTab('presets'); setError(''); }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified_user</span>
            Clearance Presets (1-Click Demo)
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
            onClick={() => { setActiveTab('credentials'); setError(''); }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>key</span>
            Custom Credentials
          </button>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span className="material-symbols-outlined text-error" style={{ fontSize: 18 }}>error</span>
            <span className="text-label-sm" style={{ color: 'var(--on-error-container)' }}>{error}</span>
          </div>
        )}

        {/* Tab 1: Presets */}
        {activeTab === 'presets' && (
          <div className="auth-presets-container">
            <p className="text-label-sm mb-3" style={{ color: 'var(--on-surface-variant)' }}>
              Select an intelligence tier to simulate role-based authorization & security permissions:
            </p>
            <div className="auth-preset-list">
              {PRESET_ROLES.map((role) => {
                const isSelected = selectedPreset === role.id;
                const meetsRequirement = role.clearance >= requiredClearance;
                return (
                  <div 
                    key={role.id}
                    onClick={() => setSelectedPreset(role.id)}
                    className={`auth-preset-card ${isSelected ? 'selected' : ''} ${!meetsRequirement ? 'disabled-preset' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="auth-clearance-badge" 
                          style={{ backgroundColor: role.badgeColor, color: '#fff' }}
                        >
                          Level {role.clearance}
                        </span>
                        <span className="font-bold text-label-md" style={{ color: 'var(--on-surface)' }}>
                          {role.role}
                        </span>
                      </div>
                      {!meetsRequirement && (
                        <span className="text-label-sm font-semibold" style={{ color: 'var(--error)' }}>
                          Insufficient Clearance
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm font-semibold" style={{ color: 'var(--on-surface)' }}>
                      {role.name} <span style={{ fontWeight: 400, color: 'var(--on-surface-variant)' }}>• {role.department}</span>
                    </p>
                    <p className="text-label-sm mt-1" style={{ color: 'var(--outline)', lineHeight: 1.4 }}>
                      {role.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="auth-modal-footer mt-4">
              <label className="flex items-center gap-2 cursor-pointer text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                <input 
                  type="checkbox" 
                  checked={remember} 
                  onChange={(e) => setRemember(e.target.checked)} 
                  style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                />
                Remember security session across browser refreshes
              </label>
              <button 
                className="btn-primary auth-submit-btn"
                onClick={() => handlePresetSubmit(selectedPreset)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                Authorize & Launch Session
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Credentials */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="auth-credentials-form">
            <div className="form-group mb-4">
              <label className="text-label-sm font-semibold mb-1 block" style={{ color: 'var(--on-surface)' }}>
                Intelligence Email / Official ID
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 20 }}>
                  mail
                </span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@sansad.intel.in"
                  className="input-field"
                  style={{ paddingLeft: 40, width: '100%' }}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="text-label-sm font-semibold mb-1 block" style={{ color: 'var(--on-surface)' }}>
                Security Access Passphrase
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 20 }}>
                  lock
                </span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="input-field"
                  style={{ paddingLeft: 40, width: '100%' }}
                  required
                />
              </div>
              <p className="text-label-sm mt-1" style={{ color: 'var(--outline)' }}>
                Hint: Any email containing `director` or `admin` triggers Level 4 Executive clearance.
              </p>
            </div>

            <div className="auth-modal-footer">
              <label className="flex items-center gap-2 cursor-pointer text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                <input 
                  type="checkbox" 
                  checked={remember} 
                  onChange={(e) => setRemember(e.target.checked)} 
                  style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                />
                Remember security session
              </label>
              <button type="submit" className="btn-primary auth-submit-btn">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock_open</span>
                Authenticate Credentials
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="auth-system-badge mt-4">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>shield_lock</span>
          <span>TLS 1.3 End-to-End Encrypted Protocol • PRS Parliamentary Data Vault • Session Audited</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
