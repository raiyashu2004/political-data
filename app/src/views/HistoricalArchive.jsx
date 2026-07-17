import React, { useState } from 'react';

const HistoricalArchive = ({ archiveData, selectedCategory, setSelectedCategory, selectedTerm, setSelectedTerm }) => {
  const [selectedSpeech, setSelectedSpeech] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParty, setFilterParty] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' (Table), 'grid' (Cards), or 'split_moat' (Moat Viewer)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  if (!archiveData) {
    return <div className="p-6">Loading Historical Intelligence Archive...</div>;
  }

  const speeches = archiveData.speeches || [];

  // Filter speeches based on user selections
  const filteredSpeeches = speeches.filter(sp => {
    const matchCategory = !selectedCategory || selectedCategory === 'ALL' || sp.bill_category === selectedCategory;
    const matchTerm = !selectedTerm || selectedTerm.includes('All Historical') || sp.term === selectedTerm;
    const matchParty = filterParty === 'ALL' || sp.party === filterParty;
    const matchSearch = !searchTerm || 
      sp.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.cleaned_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.bill_category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchTerm && matchParty && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSpeeches.length / pageSize));
  const paginatedSpeeches = filteredSpeeches.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const parties = ['ALL', 'BJP', 'INC', 'TMC', 'DMK', 'SP', 'JD(U)', 'SAD', 'AIMIM', 'AAP', 'CPI(M)', 'YSRCP', 'BJD'];
  const categories = [
    'ALL', 
    'Agriculture & Farm Reform', 
    'Data Privacy & Digital India', 
    'Union Budget & Fiscal Policy', 
    'National Security & Defence', 
    'Judicial Reforms & Constitution', 
    'Health, Education & Welfare',
    'Citizenship Amendment & Internal Security',
    'No-Confidence Motions & Governance',
    'Women\'s Reservation & Representation',
    'Uniform Civil Code & Civil Law',
    'Telecommunications & Broadcasting Reforms',
    'Environmental Protection & Clean Energy'
  ];

  const activeSpeech = selectedSpeech || filteredSpeeches[0] || speeches[0];

  const handleOpenMoat = (speech) => {
    if (speech) setSelectedSpeech(speech);
    setViewMode('split_moat');
  };

  const handleBackToStandard = () => {
    setViewMode('list');
    setSelectedSpeech(null);
  };

  const handleResetFilters = () => {
    if (setSelectedCategory) setSelectedCategory('ALL');
    if (setSelectedTerm) setSelectedTerm('All Historical Terms');
    setFilterParty('ALL');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="card" style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--primary-fixed)' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-primary">STAGE 2 CORE TARGET ARCHIVE</span>
              <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>PRS Legislative & Sansad TV Transcripts ({speeches.length.toLocaleString()} Records)</span>
            </div>
            <h2 className="text-headline-lg" style={{ fontWeight: 800 }}>Global Parliamentary Debate Archive</h2>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
              Explore how our NLP text-cleaning engine transforms noisy, multilingual, PDF-locked transcripts into structured polarization data across 12 major bills.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {viewMode === 'split_moat' ? (
              <button 
                onClick={handleBackToStandard}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                Back to Standard Archive
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenMoat(filteredSpeeches[0] || speeches[0])}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span>
                  Launch Side-by-Side Moat Viewer
                </button>
                <div className="flex items-center bg-surface-container border border-outline-variant rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('list')}
                    title="Table View"
                    className="p-1.5 rounded transition-all"
                    style={{ backgroundColor: viewMode === 'list' ? 'var(--surface-container-lowest)' : 'transparent', color: viewMode === 'list' ? 'var(--primary)' : 'var(--on-surface-variant)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>table_chart</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    title="Card View"
                    className="p-1.5 rounded transition-all"
                    style={{ backgroundColor: viewMode === 'grid' ? 'var(--surface-container-lowest)' : 'transparent', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--on-surface-variant)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>view_agenda</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search Input */}
            <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-2.5 py-1.5 flex-1 min-w-[220px]">
              <span className="material-symbols-outlined mr-1.5" style={{ fontSize: 18, color: 'var(--outline)' }}>search</span>
              <input 
                type="text" 
                placeholder="Search speaker, keyword, or stance..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none outline-none text-body-sm w-full"
                style={{ color: 'var(--on-surface)' }}
              />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="text-outline hover:text-on-surface">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory || 'ALL'}
              onChange={(e) => {
                if (setSelectedCategory) setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-2.5 py-1.5 text-body-sm outline-none"
              style={{ color: 'var(--on-surface)', fontWeight: 600, maxWidth: 240 }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Bill Categories' : c}</option>
              ))}
            </select>

            {/* Party Select */}
            <select
              value={filterParty}
              onChange={(e) => { setFilterParty(e.target.value); setCurrentPage(1); }}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-2.5 py-1.5 text-body-sm outline-none"
              style={{ color: 'var(--on-surface)', fontWeight: 600 }}
            >
              {parties.map((p) => (
                <option key={p} value={p}>{p === 'ALL' ? 'All Parties' : p}</option>
              ))}
            </select>
          </div>

          {/* Result Count & Reset */}
          <div className="flex items-center gap-3">
            <span className="text-body-sm font-bold" style={{ color: 'var(--on-surface)' }}>
              Showing {filteredSpeeches.length.toLocaleString()} of {speeches.length.toLocaleString()} speeches
            </span>
            <button 
              onClick={handleResetFilters}
              title="Reset Filters"
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: 12, height: 38 }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Moat Verification Showcase Box */}
      {viewMode === 'split_moat' && activeSpeech && (
        <div className="card" style={{ border: '2px solid var(--primary)', backgroundColor: 'var(--surface-container-lowest)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 24 }}>auto_awesome</span>
              <div>
                <h3 className="text-headline-md" style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  The Moat Engine: Real-Time Transcript Cleaning & Stance Verification
                </h3>
                <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  Comparing raw scanned PDF OCR (with procedural interruptions and multilingual idioms) vs. Cleaned NLP Intelligence.
                </p>
              </div>
            </div>
            <button 
              onClick={handleBackToStandard}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              Close Comparison
            </button>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-surface-container-low rounded-lg mb-6 border border-outline-variant">
              <div className="flex items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                  {activeSpeech.party}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: 'var(--on-surface)' }}>{activeSpeech.speaker}</h4>
                  <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{activeSpeech.house} • {activeSpeech.term} • {activeSpeech.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge badge-neutral" style={{ fontSize: 12 }}>{activeSpeech.bill_category}</span>
                <span className="badge" style={{ backgroundColor: activeSpeech.tone_analysis?.stance_color || '#2563eb', color: '#fff', fontSize: 12 }}>
                  {activeSpeech.tone_analysis?.stance || 'Analyzed'} ({activeSpeech.tone_analysis?.polarity_score || 0} Tone)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid #334155', position: 'relative' }}>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
                  <span className="flex items-center gap-1.5 font-bold text-red-400 text-xs tracking-wider uppercase">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>warning</span>
                    Raw Scanned PDF OCR Transcript (Uncleaned)
                  </span>
                  <span className="badge" style={{ backgroundColor: '#334155', color: '#cbd5e1', fontSize: 10 }}>PDF Lock Noise</span>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.6, color: '#cbd5e1', minHeight: 180 }}>
                  {activeSpeech.raw_text}
                </pre>
              </div>

              <div style={{ backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)', padding: 20, borderRadius: 'var(--radius-md)', border: '2px solid var(--success)', position: 'relative' }}>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant">
                  <span className="flex items-center gap-1.5 font-bold text-success text-xs tracking-wider uppercase" style={{ color: 'var(--success)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                    Cleaned & Normalized Intelligence Text
                  </span>
                  <span className="badge badge-success" style={{ fontSize: 10 }}>
                    -{activeSpeech.cleaning_metrics?.noise_reduction_pct || '44.2%'} Noise Reduction
                  </span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--on-surface)', minHeight: 180, fontWeight: 500 }}>
                  {activeSpeech.cleaned_text}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 text-center bg-surface-container-low p-3 rounded-lg border border-outline-variant">
              <div>
                <p className="text-label-sm" style={{ color: 'var(--outline)' }}>ORIGINAL CHARACTERS</p>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{activeSpeech.cleaning_metrics?.original_characters || 450}</p>
              </div>
              <div>
                <p className="text-label-sm" style={{ color: 'var(--outline)' }}>OCR ARTIFACTS FIXED</p>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)' }}>{activeSpeech.cleaning_metrics?.ocr_artifacts_fixed || 3}</p>
              </div>
              <div>
                <p className="text-label-sm" style={{ color: 'var(--outline)' }}>CLEANED CHARACTERS</p>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--success)' }}>{activeSpeech.cleaning_metrics?.cleaned_characters || 250}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Archive Results Area (Table or Grid View) */}
      {viewMode === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-headline-md" style={{ fontWeight: 700, fontSize: 16 }}>Debate Transcripts & Stance Scores (Page {currentPage} of {totalPages})</h3>
            <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Click any row or "Verify Moat" to launch side-by-side verification</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>SPEAKER / MEMBER</th>
                  <th>PARTY</th>
                  <th>LOK SABHA TERM</th>
                  <th>BILL CATEGORY</th>
                  <th>SPEECH SNIPPET (CLEANED)</th>
                  <th>STANCE TONE</th>
                  <th>MOAT ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSpeeches.map((sp) => (
                  <tr 
                    key={sp.id}
                    onClick={() => handleOpenMoat(sp)}
                    style={{ cursor: 'pointer' }}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td style={{ fontWeight: 700 }}>{sp.speaker}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 800 }}>{sp.party}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{sp.term.split(' ')[0]} Term</td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--primary)' }}>{sp.bill_category}</span>
                    </td>
                    <td style={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--on-surface-variant)' }}>
                      {sp.cleaned_text}
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: sp.tone_analysis?.stance_color || '#2563eb', color: '#fff', fontSize: 11 }}>
                        {sp.tone_analysis?.stance}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMoat(sp);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: 11 }}
                      >
                        Verify Moat
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSpeeches.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>
                      <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--on-surface)' }}>No matching parliamentary speeches found.</p>
                      <button onClick={handleResetFilters} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                        Reset Filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bento Grid View (Stitch Style Cards) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedSpeeches.map((sp) => (
            <div 
              key={sp.id}
              onClick={() => handleOpenMoat(sp)}
              className="card hover:shadow-md transition-all group"
              style={{ cursor: 'pointer', border: '1px solid var(--outline-variant)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary" style={{ fontSize: 10 }}>{sp.term.split(' ')[0]} Term</span>
                  <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>{sp.date}</span>
                </div>
                <span className="badge" style={{ backgroundColor: sp.tone_analysis?.stance_color || '#2563eb', color: '#fff', fontSize: 11 }}>
                  {sp.tone_analysis?.stance}
                </span>
              </div>

              <h4 className="text-headline-md mb-2 group-hover:text-primary transition-colors" style={{ fontWeight: 700, fontSize: 16 }}>
                {sp.bill_category}: Speech by {sp.speaker} ({sp.party})
              </h4>

              <p className="text-body-md mb-4" style={{ color: 'var(--on-surface-variant)', fontSize: 13, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{sp.cleaned_text}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <span className="text-label-sm flex items-center gap-1" style={{ color: 'var(--on-surface)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>account_balance</span>
                    {sp.house}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenMoat(sp);
                  }}
                  className="text-label-md text-primary flex items-center gap-1 hover:underline"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  Verify Moat
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
          {filteredSpeeches.length === 0 && (
            <div className="card md:col-span-2 text-center p-10" style={{ color: 'var(--on-surface-variant)' }}>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--on-surface)' }}>No matching parliamentary speeches found.</p>
              <button onClick={handleResetFilters} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls Footer */}
      {filteredSpeeches.length > 0 && (
        <div className="card flex flex-col sm:flex-row justify-between items-center gap-4 py-3 px-4 bg-surface-container-low border border-outline-variant">
          <div className="text-body-sm text-on-surface-variant">
            Showing records <strong>{(currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredSpeeches.length)}</strong> of <strong>{filteredSpeeches.length.toLocaleString()}</strong>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-outline-variant bg-surface disabled:opacity-40 disabled:cursor-not-allowed text-body-sm font-semibold hover:bg-surface-container"
            >
              Previous
            </button>
            <span className="text-body-sm font-bold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border border-outline-variant bg-surface disabled:opacity-40 disabled:cursor-not-allowed text-body-sm font-semibold hover:bg-surface-container"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalArchive;
