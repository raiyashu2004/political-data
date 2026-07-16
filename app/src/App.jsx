import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExecutiveDashboard from './views/ExecutiveDashboard';
import HistoricalArchive from './views/HistoricalArchive';
import MemberAnalysis from './views/MemberAnalysis';
import BriefingGenerator from './views/BriefingGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedHouse, setSelectedHouse] = useState('Lok Sabha');
  const [selectedTerm, setSelectedTerm] = useState('All Historical Terms');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [summaryData, setSummaryData] = useState(null);
  const [archiveData, setArchiveData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [briefingData, setBriefingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, arcRes, memRes, brfRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/executive_summary.json`).then(r => r.json()).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}data/historical_debates.json`).then(r => r.json()).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}data/member_profiles.json`).then(r => r.json()).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}data/strategic_briefings.json`).then(r => r.json()).catch(() => null)
        ]);

        setSummaryData(sumRes);
        setArchiveData(arcRes);
        setMemberData(memRes);
        setBriefingData(brfRes);
      } catch (err) {
        console.error("Error loading LokaSent datasets:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="app-container">
      {/* Permanent Left Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        selectedHouse={selectedHouse}
        setSelectedHouse={setSelectedHouse}
        selectedTerm={selectedTerm}
        setSelectedTerm={setSelectedTerm}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedHouse={selectedHouse}
          selectedTerm={selectedTerm}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="content-canvas">
          {loading ? (
            <div className="flex items-center justify-center" style={{ height: '60vh' }}>
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 48, animation: 'spin 1s linear infinite' }}>sync</span>
                <p className="text-headline-md">Loading LokaSent Intelligence Engine...</p>
                <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Parsing multilingual OCR debate transcripts...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <ExecutiveDashboard 
                  summaryData={summaryData} 
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setSelectedTerm('All Historical Terms');
                  }}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'archive' && (
                <HistoricalArchive 
                  archiveData={archiveData}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedTerm={selectedTerm}
                  setSelectedTerm={setSelectedTerm}
                />
              )}
              {activeTab === 'member' && (
                <MemberAnalysis 
                  memberData={memberData}
                />
              )}
              {activeTab === 'briefing' && (
                <BriefingGenerator 
                  briefingData={briefingData}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
