import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const PRESET_ROLES = [
  {
    id: 'executive',
    name: 'Shri Achintya Rai',
    email: 'director@sansad.intel.in',
    role: 'Executive Director',
    department: 'National Legislative Intelligence & Policy',
    clearance: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    badgeColor: 'var(--primary)',
    description: 'Full Level 4 Clearance. Unrestricted access to classified policy briefs, deep polarization telemetry, raw transcript archives, and AI strategy generators.'
  },
  {
    id: 'analyst',
    name: 'Dr. Ananya Sharma',
    email: 'sharma.a@prs.org.in',
    role: 'Senior Parliamentary Analyst',
    department: 'PRS Legislative & Policy Research',
    clearance: 3,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    badgeColor: 'var(--success)',
    description: 'Level 3 Clearance. Authorized to generate AI strategic briefings, view executive dashboards, and export legislative stance matrices.'
  },
  {
    id: 'member',
    name: 'Shri Vikramaditya Rao',
    email: 'v.rao.mp@loksabha.nic.in',
    role: 'Legislative Member Staff',
    department: '18th Lok Sabha Secretariat',
    clearance: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    badgeColor: 'var(--warning)',
    description: 'Level 2 Clearance. Authorized to inspect member voting records, historical debate transcripts, and parliamentary sentiment indexes.'
  },
  {
    id: 'public',
    name: 'Academic Researcher',
    email: 'guest@universities.edu.in',
    role: 'Public Guest Researcher',
    department: 'Open Parliamentary Data Portal',
    clearance: 1,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    badgeColor: 'var(--outline)',
    description: 'Level 1 Clearance. Standard access to public debate archives, sentiment metrics, and unclassified executive summary charts.'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('lokasent_auth_user') || sessionStorage.getItem('lokasent_auth_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Error reading auth state:', e);
    }
    return null;
  });

  const [lastLoginTime, setLastLoginTime] = useState(() => {
    return localStorage.getItem('lokasent_login_timestamp') || null;
  });

  const loginWithPreset = (roleId, remember = true) => {
    const selected = PRESET_ROLES.find(r => r.id === roleId) || PRESET_ROLES[0];
    const userPayload = {
      ...selected,
      loggedInAt: new Date().toISOString(),
      sessionId: 'SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    setUser(userPayload);
    const timestamp = new Date().toLocaleString();
    setLastLoginTime(timestamp);

    if (remember) {
      localStorage.setItem('lokasent_auth_user', JSON.stringify(userPayload));
      localStorage.setItem('lokasent_login_timestamp', timestamp);
    } else {
      sessionStorage.setItem('lokasent_auth_user', JSON.stringify(userPayload));
    }
    return userPayload;
  };

  const loginWithCredentials = (email, password, remember = true) => {
    // Check if email matches a preset role, or default to Executive/Analyst
    const matched = PRESET_ROLES.find(r => r.email.toLowerCase() === email.toLowerCase());
    let userPayload;
    if (matched) {
      userPayload = {
        ...matched,
        loggedInAt: new Date().toISOString(),
        sessionId: 'SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      };
    } else {
      userPayload = {
        id: 'custom',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: email.includes('admin') || email.includes('director') ? 'Executive Director' : 'Senior Analyst',
        department: 'Sansad Intelligence Command',
        clearance: email.includes('admin') || email.includes('director') ? 4 : 3,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        badgeColor: 'var(--primary)',
        loggedInAt: new Date().toISOString(),
        sessionId: 'SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      };
    }

    setUser(userPayload);
    const timestamp = new Date().toLocaleString();
    setLastLoginTime(timestamp);

    if (remember) {
      localStorage.setItem('lokasent_auth_user', JSON.stringify(userPayload));
      localStorage.setItem('lokasent_login_timestamp', timestamp);
    } else {
      sessionStorage.setItem('lokasent_auth_user', JSON.stringify(userPayload));
    }
    return userPayload;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lokasent_auth_user');
    sessionStorage.removeItem('lokasent_auth_user');
  };

  const hasClearance = (minLevel = 1) => {
    if (!user) return false;
    return user.clearance >= minLevel;
  };

  return (
    <AuthContext.Provider value={{
      user,
      lastLoginTime,
      loginWithPreset,
      loginWithCredentials,
      logout,
      hasClearance
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
