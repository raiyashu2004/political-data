import React from 'react';

const Header = ({ searchQuery, setSearchQuery, selectedHouse, selectedTerm, darkMode, setDarkMode }) => {
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
          <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>notifications</span>
          <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>settings</span>
          <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>help_outline</span>
        </div>

        <div style={{ height: 32, width: 1, backgroundColor: 'var(--outline-variant)' }} />

        {/* User Headshot (Stitch Style) */}
        <div className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <p className="text-label-md" style={{ color: 'var(--on-surface)' }}>Admin Analyst</p>
            <p style={{ fontSize: 10, color: 'var(--outline)', textTransform: 'uppercase' }}>PRS / Sansad Intel</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--secondary-container)' }}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1dSt4_UV7B1za0Tig15DcKLqwz-PmWWGQogZWKg23ODw10SvEl_0vI7_zisoOQ99EfkFt_Fp4MXhWTR9iM9KcCuWkpdJjDIYkPxWX7M_woqm1rVL5DYppT8AJbBvyQmsXNDmxRHTJjSvlFX0TEt3fgAAnld5czy4bB7FgjP8L_fwuWl4FZ2RVHKwkhglqQ-WaJnOpIKSqcUUdKnEJ_PvejrRS0X6XKJaw7kcE1MuY86nKOEkgLdfuqA" 
              alt="Executive Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
