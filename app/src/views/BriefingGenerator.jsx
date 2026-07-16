import React, { useState } from 'react';

const BriefingGenerator = ({ briefingData }) => {
  const [selectedHouse, setSelectedHouse] = useState('Lok Sabha (Lower House)');
  const [selectedCategory, setSelectedCategory] = useState('Data Privacy & Digital India');
  const [includeRuling, setIncludeRuling] = useState(true);
  const [includeOpp, setIncludeOpp] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBriefing, setGeneratedBriefing] = useState(null);

  if (!briefingData) {
    return <div className="p-6">Loading Strategic Briefing Room...</div>;
  }

  const briefings = briefingData.briefings || [];
  const currentBriefing = generatedBriefing || briefings.find(b => b.category === selectedCategory) || briefings[0] || {};

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const found = briefings.find(b => b.category === selectedCategory) || briefings[0];
      setGeneratedBriefing(found);
      setIsGenerating(false);
      setActiveStep(3);
    }, 600);
  };

  const categories = ['Data Privacy & Digital India', 'Agriculture & Farm Reform', 'Union Budget & Fiscal Policy', 'National Security & Defence', 'Judicial Reforms & Constitution'];

  return (
    <div className="space-y-6">
      {/* Top Stepper Banner (Stitch Style) */}
      <div className="card flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6" style={{ padding: '28px 32px', backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div>
          <h2 className="text-headline-lg mb-2" style={{ fontWeight: 800, fontSize: 24, color: 'var(--on-surface)' }}>Strategic Briefing Generator</h2>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', fontSize: 14.5, lineHeight: 1.6 }}>
            Synthesize OCR-cleaned debate corpora into high-density executive intelligence briefings and alignment matrices.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <div onClick={() => setActiveStep(1)} className="flex items-center gap-2.5 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 border" style={{ backgroundColor: activeStep === 1 ? 'var(--primary)' : 'var(--surface-container-highest)', borderColor: activeStep === 1 ? 'var(--primary)' : 'var(--outline-variant)', color: activeStep === 1 ? '#fff' : 'var(--on-surface)' }}>
            <span style={{ fontWeight: 900, fontSize: 13, backgroundColor: activeStep === 1 ? 'rgba(255,255,255,0.2)' : 'var(--surface)', color: activeStep === 1 ? '#fff' : 'var(--on-surface)', width: 24, height: 24, borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            <span style={{ fontWeight: 800, fontSize: 13.5 }}>Scope</span>
          </div>
          <div onClick={() => setActiveStep(2)} className="flex items-center gap-2.5 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 border" style={{ backgroundColor: activeStep === 2 ? 'var(--primary)' : 'var(--surface-container-highest)', borderColor: activeStep === 2 ? 'var(--primary)' : 'var(--outline-variant)', color: activeStep === 2 ? '#fff' : 'var(--on-surface)' }}>
            <span style={{ fontWeight: 900, fontSize: 13, backgroundColor: activeStep === 2 ? 'rgba(255,255,255,0.2)' : 'var(--surface)', color: activeStep === 2 ? '#fff' : 'var(--on-surface)', width: 24, height: 24, borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            <span style={{ fontWeight: 800, fontSize: 13.5 }}>Entities</span>
          </div>
          <div onClick={() => setActiveStep(3)} className="flex items-center gap-2.5 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 border" style={{ backgroundColor: activeStep === 3 ? 'var(--primary)' : 'var(--surface-container-highest)', borderColor: activeStep === 3 ? 'var(--primary)' : 'var(--outline-variant)', color: activeStep === 3 ? '#fff' : 'var(--on-surface)' }}>
            <span style={{ fontWeight: 900, fontSize: 13, backgroundColor: activeStep === 3 ? 'rgba(255,255,255,0.2)' : 'var(--surface)', color: activeStep === 3 ? '#fff' : 'var(--on-surface)', width: 24, height: 24, borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            <span style={{ fontWeight: 800, fontSize: 13.5 }}>Report</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Form: Briefing Configurator (5 Cols) */}
        <div className="card md:col-span-5" style={{ padding: '32px', backgroundColor: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)', boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="flex items-center gap-3 pb-5 border-b border-outline-variant/60">
              <div style={{ padding: '10px', backgroundColor: 'var(--primary-container)', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>tune</span>
              </div>
              <div>
                <h3 className="text-headline-md" style={{ fontWeight: 800, fontSize: 18, color: 'var(--on-surface)' }}>Briefing Parameters</h3>
                <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 12 }}>Configure synthesis scope & target entities</p>
              </div>
            </div>

            {/* Step 1: Scope */}
            <div className="space-y-6">
              <div>
                <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '12px', fontWeight: 800, letterSpacing: '0.8px', fontSize: 11.5 }}>
                  1. LEGISLATIVE HOUSE SCOPE
                </label>
                <select 
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  className="input-field"
                  style={{ padding: '14px 16px', fontSize: 14.5, borderRadius: 'var(--radius-md)', border: '2px solid var(--outline-variant)', backgroundColor: 'var(--surface)', fontWeight: 600, width: '100%', color: 'var(--on-surface)', cursor: 'pointer', transition: 'border-color 0.2s ease', outline: 'none' }}
                >
                  <option>Lok Sabha (Lower House)</option>
                  <option>Rajya Sabha (Upper House)</option>
                  <option>Joint Parliamentary Session</option>
                </select>
              </div>

              <div style={{ marginTop: '24px' }}>
                <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '12px', fontWeight: 800, letterSpacing: '0.8px', fontSize: 11.5 }}>
                  2. POLICY DOMAIN FOCUS
                </label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    const found = briefings.find(b => b.category === e.target.value);
                    if (found) setGeneratedBriefing(found);
                  }}
                  className="input-field"
                  style={{ padding: '14px 16px', fontSize: 14.5, borderRadius: 'var(--radius-md)', border: '2px solid var(--primary)', backgroundColor: 'var(--surface)', fontWeight: 700, width: '100%', color: 'var(--primary)', cursor: 'pointer', transition: 'border-color 0.2s ease', outline: 'none' }}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Step 2: Target Bench Entities */}
            <div style={{ marginTop: '32px', paddingTop: '28px', borderTop: '1px solid var(--outline-variant)' }}>
              <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '14px', fontWeight: 800, letterSpacing: '0.8px', fontSize: 11.5 }}>
                3. TARGET BENCHES TO INCLUDE
              </label>
              <div className="grid grid-cols-1 gap-4">
                <label 
                  onClick={() => setIncludeRuling(!includeRuling)}
                  className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                  style={{ 
                    backgroundColor: includeRuling ? 'var(--primary-container)/10' : 'var(--surface-container-low)', 
                    borderColor: includeRuling ? 'var(--primary)' : 'var(--outline-variant)',
                    borderWidth: '2px',
                    boxShadow: includeRuling ? '0 4px 12px rgba(37, 99, 235, 0.08)' : 'none'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={includeRuling} 
                    onChange={(e) => setIncludeRuling(e.target.checked)} 
                    style={{ accentColor: 'var(--primary)', width: 18, height: 18, marginTop: 2, cursor: 'pointer' }} 
                  />
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 14.5, color: includeRuling ? 'var(--primary)' : 'var(--on-surface)' }}>Ruling Bench</p>
                    <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 3, lineHeight: 1.4 }}>NDA / BJP Coalition</p>
                  </div>
                </label>

                <label 
                  onClick={() => setIncludeOpp(!includeOpp)}
                  className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                  style={{ 
                    backgroundColor: includeOpp ? 'var(--primary-container)/10' : 'var(--surface-container-low)', 
                    borderColor: includeOpp ? 'var(--primary)' : 'var(--outline-variant)',
                    borderWidth: '2px',
                    boxShadow: includeOpp ? '0 4px 12px rgba(37, 99, 235, 0.08)' : 'none'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={includeOpp} 
                    onChange={(e) => setIncludeOpp(e.target.checked)} 
                    style={{ accentColor: 'var(--primary)', width: 18, height: 18, marginTop: 2, cursor: 'pointer' }} 
                  />
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 14.5, color: includeOpp ? 'var(--primary)' : 'var(--on-surface)' }}>Opposition Bench</p>
                    <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 3, lineHeight: 1.4 }}>INDIA / UPA / LoP</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Depth */}
            <div style={{ marginTop: '32px', paddingTop: '28px', borderTop: '1px solid var(--outline-variant)' }}>
              <label className="text-label-sm" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '14px', fontWeight: 800, letterSpacing: '0.8px', fontSize: 11.5 }}>
                4. REPORT DEPTH & ANALYTICS MODULES
              </label>
              <div className="flex flex-wrap gap-3">
                <span className="badge" style={{ backgroundColor: 'var(--primary-container)', color: '#fff', padding: '10px 14px', fontSize: 13, fontWeight: 700, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>✓ Executive Summary</span>
                <span className="badge" style={{ backgroundColor: 'var(--primary-container)', color: '#fff', padding: '10px 14px', fontSize: 13, fontWeight: 700, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>✓ Empirical Sentiment Shift</span>
                <span className="badge" style={{ backgroundColor: 'var(--primary-container)', color: '#fff', padding: '10px 14px', fontSize: 13, fontWeight: 700, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>✓ OCR Noise Verification</span>
                <span className="badge" style={{ backgroundColor: 'var(--primary-container)', color: '#fff', padding: '10px 14px', fontSize: 13, fontWeight: 700, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>✓ Strategic Recommendations</span>
              </div>
            </div>

            <div style={{ marginTop: '36px' }}>
              <button 
                type="submit" 
                disabled={isGenerating}
                className="btn btn-primary w-full flex items-center justify-center gap-3"
                style={{ padding: '16px 20px', fontSize: 15.5, fontWeight: 800, letterSpacing: '0.5px', borderRadius: 'var(--radius-lg)', boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)', transition: 'all 0.2s ease', cursor: isGenerating ? 'not-allowed' : 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                  {isGenerating ? 'sync' : 'auto_awesome'}
                </span>
                {isGenerating ? 'Synthesizing Debate Transcripts...' : 'Generate Strategic Briefing'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview: Generated Intelligence Report (7 Cols) */}
        <div className="card md:col-span-7" style={{ backgroundColor: 'var(--surface-container-lowest)', border: '2px solid var(--primary)', position: 'relative', padding: '32px' }}>
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-outline-variant">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-error" style={{ padding: '6px 10px', fontSize: 11, fontWeight: 800 }}>RESTRICTED INTEL BRIEFING</span>
                <span className="text-label-sm" style={{ color: 'var(--outline)', fontWeight: 700 }}>{currentBriefing.id || 'BRF-2024-01'}</span>
              </div>
              <h3 className="text-headline-md mb-2" style={{ fontWeight: 900, fontSize: 22, color: 'var(--primary)', lineHeight: 1.3 }}>
                {currentBriefing.title || 'Polarization Analysis: Digital India Data Protection Bill'}
              </h3>
              <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>Generated on: {currentBriefing.date || 'August 10, 2024'}</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
              Export PDF
            </button>
          </div>

          <div className="space-y-8">
            {/* Executive Summary */}
            <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '24px 28px', borderRadius: 'var(--radius-lg)', borderLeft: '5px solid var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>summarize</span>
                <h4 className="text-label-md" style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.5px' }}>EXECUTIVE SUMMARY</h4>
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--on-surface)', fontWeight: 500 }}>
                {currentBriefing.executive_summary}
              </p>
            </div>

            {/* Key Empirical Findings */}
            <div style={{ padding: '8px 4px' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: 20 }}>manage_search</span>
                <h4 className="text-label-md" style={{ color: 'var(--on-surface)', fontWeight: 800, letterSpacing: '0.5px' }}>EMPIRICAL FINDINGS & NLP METRICS</h4>
              </div>
              <ul className="space-y-4" style={{ paddingLeft: 22, listStyleType: 'disc' }}>
                {currentBriefing.key_findings?.map((finding, idx) => (
                  <li key={idx} style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--on-surface-variant)', paddingLeft: 4 }}>
                    <strong style={{ color: 'var(--on-surface)' }}>Finding #{idx + 1}:</strong> {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Party Alignment Matrix */}
            <div className="pt-4 border-t border-outline-variant/40">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: 20 }}>grid_view</span>
                <h4 className="text-label-md" style={{ color: 'var(--on-surface)', fontWeight: 800, letterSpacing: '0.5px' }}>BENCH ALIGNMENT MATRIX</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid #bbf7d0', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined" style={{ color: '#166534', fontSize: 18 }}>thumb_up</span>
                    <p className="text-label-sm" style={{ color: '#166534', fontWeight: 800, letterSpacing: '0.5px' }}>COMMEND / SUPPORT BENCH (+)</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentBriefing.party_alignment_matrix?.Support?.map((p, i) => (
                      <span key={i} className="badge" style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: 12, padding: '6px 12px', fontWeight: 700, borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#fef2f2', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid #fecaca', boxShadow: '0 2px 8px rgba(186, 26, 26, 0.05)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined" style={{ color: '#991b1b', fontSize: 18 }}>gavel</span>
                    <p className="text-label-sm" style={{ color: '#991b1b', fontWeight: 800, letterSpacing: '0.5px' }}>OPPOSE / DEMAND AMENDMENTS (-)</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentBriefing.party_alignment_matrix?.['Oppose / Demand Amendments']?.map((p, i) => (
                      <span key={i} className="badge" style={{ backgroundColor: '#ba1a1a', color: '#fff', fontSize: 12, padding: '6px 12px', fontWeight: 700, borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        {p}
                      </span>
                    )) || currentBriefing.party_alignment_matrix?.Oppose?.map((p, i) => (
                      <span key={i} className="badge" style={{ backgroundColor: '#ba1a1a', color: '#fff', fontSize: 12, padding: '6px 12px', fontWeight: 700, borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Legislative Strategy */}
            <div style={{ backgroundColor: '#fffbeb', padding: '24px 28px', borderRadius: 'var(--radius-lg)', border: '1px solid #fde68a', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.05)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined" style={{ color: '#d97706', fontSize: 22 }}>lightbulb</span>
                <h4 className="text-label-md" style={{ color: '#b45309', fontWeight: 800, letterSpacing: '0.5px' }}>RECOMMENDED LEGISLATIVE STRATEGY</h4>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#78350f', fontWeight: 600 }}>
                {currentBriefing.recommended_strategy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingGenerator;
