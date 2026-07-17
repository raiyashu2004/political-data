import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExecutiveDashboard from './views/ExecutiveDashboard';
import HistoricalArchive from './views/HistoricalArchive';
import MemberAnalysis from './views/MemberAnalysis';
import NetworkAnalysisView from './views/NetworkAnalysisView';
import BriefingGenerator from './views/BriefingGenerator';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';

function MainApp() {
  const { user, hasClearance } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedHouse, setSelectedHouse] = useState('Lok Sabha');
  const [selectedTerm, setSelectedTerm] = useState('All Historical Terms');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Authentication & Authorization Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [requiredClearance, setRequiredClearance] = useState(1);
  const [customAuthMessage, setCustomAuthMessage] = useState(null);

  const [summaryData, setSummaryData] = useState(null);
  const [archiveData, setArchiveData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [briefingData, setBriefingData] = useState(null);
  const [networkData, setNetworkData] = useState(null);
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
        const [sumRes, arcRes, memRes, brfRes, netRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/executive_summary.json`).then(r => r.json()).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}data/historical_debates.json`).then(r => r.json()).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}data/member_profiles.json`).then(r => r.json()).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}data/strategic_briefings.json`).then(r => r.json()).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}data/network_graph.json`).then(r => r.json()).catch(() => null)
        ]);

        setSummaryData(sumRes);
        setArchiveData(arcRes);
        setMemberData(memRes);
        setBriefingData(brfRes);
        setNetworkData(netRes);
      } catch (err) {
        console.error("Error loading LokaSent datasets:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper to open login modal with clearance requirement
  const triggerLogin = (minLevel = 1, message = null) => {
    setRequiredClearance(minLevel);
    setCustomAuthMessage(message);
    setShowLoginModal(true);
  };

  return (
    <div className="app-container">
      {/* Permanent Left Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
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
          onOpenLoginModal={() => triggerLogin(1, null)}
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
                  onNavigate={(tab) => {
                    if (tab === 'briefing' && (!user || user.clearance < 3)) {
                      triggerLogin(3, "The Strategic AI Briefing Generator requires Level 3+ Parliamentary Clearance.");
                    }
                    setActiveTab(tab);
                  }}
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

              {activeTab === 'network' && (
                <NetworkAnalysisView 
                  networkData={networkData}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'briefing' && (
                hasClearance(3) ? (
                  <BriefingGenerator 
                    briefingData={briefingData}
                  />
                ) : (
                  /* Restricted Access View when clearance < 3 */
                  <div className="auth-restricted-container">
                    <div className="auth-restricted-card">
                      <div className="auth-restricted-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--warning)' }}>gpp_maybe</span>
                      </div>
                      <h2 className="text-headline-md font-bold mt-4" style={{ color: 'var(--on-surface)' }}>
                        Classified Intelligence System
                      </h2>
                      <p className="text-body-md mt-2" style={{ color: 'var(--on-surface-variant)', maxWidth: 460, margin: '8px auto 0' }}>
                        The <strong>Strategic AI Briefing Generator</strong> synthesizes high-signal legislative stance forecasts and sensitive parliamentary talking points.
                      </p>
                      <div className="auth-restricted-badge mt-4">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>security</span>
                        <span>Required Authorization: Level 3+ (Senior Analyst / Executive Director)</span>
                      </div>
                      <div className="mt-6 flex justify-center gap-4">
                        <button 
                          className="btn-primary"
                          onClick={() => triggerLogin(3, "Please select an Executive or Senior Analyst clearance role to access this module.")}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>admin_panel_settings</span>
                          Authenticate Authorization Level
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={() => setActiveTab('dashboard')}
                        >
                          Return to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>

      {/* Login & Authorization Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        requiredClearance={requiredClearance}
        customMessage={customAuthMessage}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
