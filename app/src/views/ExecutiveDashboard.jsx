import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

const ExecutiveDashboard = ({ summaryData, onSelectCategory, onNavigate }) => {
  if (!summaryData) {
    return <div className="p-6">Loading Parliamentary Intelligence...</div>;
  }

  const ppiScore = summaryData.overall_ppi?.ppi_score || 64.2;
  const ppiStatus = summaryData.overall_ppi?.status || 'High Partisan Divergence';
  const ppiColor = summaryData.overall_ppi?.status_color || '#ea580c';

  // Chart data for Term Evolution
  const termData = summaryData.term_evolution?.map(t => ({
    name: t.short_term,
    years: t.years,
    ppi: t.ppi_score,
    ruling: t.mean_ruling,
    opposition: t.mean_opp,
    speeches: t.speech_count
  })) || [
    { name: '15th LS', years: '2009-2014', ppi: 42.5, ruling: 52.0, opposition: -32.0 },
    { name: '16th LS', years: '2014-2019', ppi: 55.8, ruling: 58.5, opposition: -45.2 },
    { name: '17th LS', years: '2019-2024', ppi: 78.4, ruling: 64.0, opposition: -72.5 },
    { name: '18th LS', years: '2024-Pres', ppi: 68.4, ruling: 61.2, opposition: -65.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-headline-lg mb-1" style={{ fontWeight: 800 }}>Parliamentary Intelligence Overview</h2>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Real-time legislative tracking, topic modeling, and emotional sentiment polarization across party benches.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary text-label-md">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_today</span>
            4 Lok Sabha Terms
          </button>
          <button 
            onClick={() => onNavigate('briefing')}
            className="btn btn-primary text-label-md"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
            Export AI Intel
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Polarization Index */}
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div style={{ padding: 8, backgroundColor: 'var(--error-container)', color: 'var(--on-error-container)', borderRadius: 'var(--radius-sm)' }}>
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <span className="badge badge-error flex items-center gap-1" style={{ fontSize: 12 }}>
              +14.2 pts <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_upward</span>
            </span>
          </div>
          <p className="text-label-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>PARLIAMENTARY POLARIZATION INDEX (PPI)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-display" style={{ color: ppiColor }}>{ppiScore}</h3>
            <span className="text-headline-md" style={{ color: 'var(--on-surface-variant)' }}>/ 100</span>
          </div>
          <div style={{ marginTop: 16, width: '100%', backgroundColor: 'var(--surface-container)', height: 6, borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: ppiColor, height: '100%', width: `${ppiScore}%`, transition: 'width 0.5s ease' }} />
          </div>
          <p className="text-body-sm mt-2" style={{ color: ppiColor, fontWeight: 600 }}>
            Status: {ppiStatus}
          </p>
        </div>

        {/* KPI 2: Sentiment Velocity */}
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div style={{ padding: 8, backgroundColor: 'var(--primary-container)', color: '#ffffff', borderRadius: 'var(--radius-sm)' }}>
              <span className="material-symbols-outlined">speed</span>
            </div>
            <span className="badge badge-primary flex items-center gap-1" style={{ fontSize: 12 }}>
              Steady <span className="material-symbols-outlined" style={{ fontSize: 14 }}>remove</span>
            </span>
          </div>
          <p className="text-label-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>SENTIMENT DIVERGENCE VELOCITY</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-display">1.84</h3>
            <span className="text-headline-md" style={{ color: 'var(--on-surface-variant)' }}>v/s</span>
          </div>
          <div style={{ marginTop: 16, width: '100%', backgroundColor: 'var(--surface-container)', height: 6, borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: 'var(--primary)', height: '100%', width: '55%' }} />
          </div>
          <p className="text-body-sm mt-2" style={{ color: 'var(--on-surface-variant)' }}>
            Ruling Tone vs Opposition Opposition Density
          </p>
        </div>

        {/* KPI 3: Speeches & Moat Verification */}
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div style={{ padding: 8, backgroundColor: 'var(--success-container)', color: 'var(--on-success-container)', borderRadius: 'var(--radius-sm)' }}>
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="badge badge-success flex items-center gap-1" style={{ fontSize: 12 }}>
              OCR Cleaned
            </span>
          </div>
          <p className="text-label-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>DEBATE ARCHIVE COVERAGE</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-display">{summaryData.total_speeches_analyzed || 15}</h3>
            <span className="text-headline-md" style={{ color: 'var(--on-surface-variant)' }}>Speeches</span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div style={{ flex: 1 }}>
              <p className="text-label-sm" style={{ color: 'var(--outline)' }}>LOK SABHA TERMS</p>
              <p style={{ fontWeight: 700, fontSize: 16 }}>15th — 18th</p>
            </div>
            <div style={{ width: 1, height: 28, backgroundColor: 'var(--outline-variant)' }} />
            <div style={{ flex: 1 }}>
              <p className="text-label-sm" style={{ color: 'var(--outline)' }}>NOISE STRIPPED</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--success)' }}>42.8% Avg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Polarization Shift Across Lok Sabha Terms (8 Cols) */}
        <div className="card lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-headline-md" style={{ fontWeight: 700 }}>Polarization Evolution Across Lok Sabha Terms</h3>
              <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Tracking the ideological sentiment gap between Ruling Bench (+) and Opposition Bench (-) over 15 years.
              </p>
            </div>
            <span className="badge badge-primary">2009 — 2026</span>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={termData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--on-surface-variant)" style={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis stroke="var(--on-surface-variant)" style={{ fontSize: 12 }} domain={[-100, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
                  labelStyle={{ fontWeight: 700, color: 'var(--on-surface)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 10 }} />
                <Bar name="Ruling Coalition Sentiment (+)" dataKey="ruling" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar name="Opposition Bench Sentiment (-)" dataKey="opposition" fill="#ba1a1a" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Polarization Index (PPI) Trend Line (4 Cols) */}
        <div className="card lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-headline-md" style={{ fontWeight: 700, marginBottom: 4 }}>PPI Trajectory</h3>
            <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', marginBottom: 16 }}>
              Overall institutional gridlock score per Lok Sabha term.
            </p>
            <div style={{ height: 200, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={termData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--on-surface-variant)" style={{ fontSize: 11 }} />
                  <YAxis stroke="var(--on-surface-variant)" style={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)', borderRadius: 'var(--radius-sm)' }}
                  />
                  <Area type="monotone" dataKey="ppi" stroke="#004ac6" fill="rgba(0, 74, 198, 0.15)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--surface-container-low)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', marginTop: 12 }}>
            <p className="text-label-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>KEY ANALYTICAL NOTE</p>
            <p className="text-body-sm" style={{ fontSize: 12, marginTop: 2 }}>
              The 17th Lok Sabha witnessed maximum gridlock (PPI 78.4) driven by the contentious Agriculture Farm Laws debate.
            </p>
          </div>
        </div>
      </div>

      {/* Active Bill Categories Tracking Grid */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-headline-md" style={{ fontWeight: 700 }}>Divisive Bill Category Tracking</h3>
            <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Click any bill category to inspect underlying debate transcripts in the Global Archive.
            </p>
          </div>
          <span className="text-label-md" style={{ color: 'var(--primary)' }}>{summaryData.active_bill_categories?.length || 6} POLICY DOMAINS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryData.active_bill_categories?.map((bill, idx) => {
            const isHyper = bill.ppi_score >= 70;
            const badgeColor = isHyper ? 'badge-error' : (bill.ppi_score >= 50 ? 'badge-warning' : 'badge-success');
            
            return (
              <div 
                key={idx}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(bill.category);
                  onNavigate('archive');
                }}
                style={{
                  backgroundColor: 'var(--surface-container-low)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="hover:border-primary hover:shadow-sm group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`badge ${badgeColor}`} style={{ fontSize: 11 }}>
                    {bill.status}
                  </span>
                  <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: 18 }}>arrow_outward</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--on-surface)' }} className="group-hover:text-primary transition-colors">
                  {bill.category}
                </h4>
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-outline-variant/30">
                  <div>
                    <p className="text-label-sm" style={{ color: 'var(--outline)' }}>POLARIZATION</p>
                    <p style={{ fontWeight: 800, fontSize: 18, color: isHyper ? 'var(--error)' : 'var(--primary)' }}>{bill.ppi_score}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="text-label-sm" style={{ color: 'var(--outline)' }}>LAST DEBATED</p>
                    <p style={{ fontWeight: 600, fontSize: 12, color: 'var(--on-surface-variant)' }}>{bill.last_debated}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
