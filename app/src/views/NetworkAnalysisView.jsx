import React, { useState, useEffect } from 'react';

const NetworkAnalysisView = ({ networkData, onNavigate }) => {
  const [data, setData] = useState(networkData);
  const [loading, setLoading] = useState(!networkData);
  const [activeGraphMode, setActiveGraphMode] = useState('party'); // 'party' or 'mp'
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBench, setFilterBench] = useState('ALL'); // 'ALL', 'Ruling Coalition', 'Opposition Benches'

  useEffect(() => {
    if (!data) {
      // Fetch directly if not passed or loaded yet
      fetch(`${import.meta.env.BASE_URL}data/network_graph.json`)
        .then(res => res.json())
        .then(json => {
          setData(json);
          setLoading(false);
          if (json?.party_network?.nodes?.length > 0) {
            setSelectedNode(json.party_network.nodes[0]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch network_graph.json:", err);
          setLoading(false);
        });
    } else if (!selectedNode && data?.party_network?.nodes?.length > 0) {
      setSelectedNode(data.party_network.nodes[0]);
    }
  }, [data, selectedNode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">hub</span>
          <p className="text-headline-md font-bold">Computing Graph Centrality & Communities...</p>
          <p className="text-body-sm text-on-surface-variant">NetworkX Louvain modularity and betweenness algorithm in progress.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card text-center py-12">
        <span className="material-symbols-outlined text-error text-5xl mb-2">error_outline</span>
        <h3 className="text-headline-md font-bold">Network Graph Data Unavailable</h3>
        <p className="text-body-md text-on-surface-variant mt-1">Please ensure the data pipeline (`generate_data.py`) has been run.</p>
      </div>
    );
  }

  const currentNetwork = activeGraphMode === 'party' ? data.party_network : data.mp_network;
  const nodes = currentNetwork?.nodes || [];
  const links = currentNetwork?.links || [];
  const bridgeList = activeGraphMode === 'party' ? currentNetwork?.bridge_parties : currentNetwork?.ideological_bridges;

  // Filter nodes for the visual list & graph canvas
  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (n.party && n.party.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBench = filterBench === 'ALL' || n.bench_alignment === filterBench;
    return matchesSearch && matchesBench;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-primary flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>device_hub</span>
              NETWORKX GRAPH ENGINE
            </span>
            <span className="text-label-sm text-on-surface-variant">Threshold: similarity ≥ {data.metadata?.edge_similarity_threshold || 0.65}</span>
          </div>
          <h2 className="text-headline-lg font-extrabold text-on-surface">
            Legislative Alignment & Ideological Bridge Network
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-3xl">
            Explore multi-relational graphs linking parties and MPs who share cross-topic stance trajectories. 
            High <strong>Betweenness Centrality</strong> identifies critical consensus-builders and cross-bench ideological bridges.
          </p>
        </div>

        <div className="flex gap-2 bg-surface-container p-1 rounded-lg border border-outline-variant">
          <button
            onClick={() => {
              setActiveGraphMode('party');
              if (data.party_network?.nodes?.length > 0) setSelectedNode(data.party_network.nodes[0]);
            }}
            className={`px-4 py-2 rounded-md font-bold text-label-md transition-all flex items-center gap-1.5 ${
              activeGraphMode === 'party' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>groups</span>
            Party Alliance Graph
          </button>
          <button
            onClick={() => {
              setActiveGraphMode('mp');
              if (data.mp_network?.nodes?.length > 0) setSelectedNode(data.mp_network.nodes[0]);
            }}
            className={`px-4 py-2 rounded-md font-bold text-label-md transition-all flex items-center gap-1.5 ${
              activeGraphMode === 'mp' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
            MP Voting Blocs & Bridges
          </button>
        </div>
      </div>

      {/* Network Overview Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card py-3 px-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary-container text-primary">
            <span className="material-symbols-outlined">scatter_plot</span>
          </div>
          <div>
            <p className="text-label-sm text-outline">TOTAL GRAPH NODES</p>
            <p className="text-title-lg font-extrabold text-on-surface">{nodes.length}</p>
          </div>
        </div>

        <div className="card py-3 px-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-secondary-container text-secondary">
            <span className="material-symbols-outlined">link</span>
          </div>
          <div>
            <p className="text-label-sm text-outline">HIGH-SIMILARITY EDGES</p>
            <p className="text-title-lg font-extrabold text-on-surface">{links.length}</p>
          </div>
        </div>

        <div className="card py-3 px-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-tertiary-container text-tertiary">
            <span className="material-symbols-outlined">bubble_chart</span>
          </div>
          <div>
            <p className="text-label-sm text-outline">DETECTED BLOCS / COMMUNITIES</p>
            <p className="text-title-lg font-extrabold text-on-surface">
              {activeGraphMode === 'party' ? (data.party_network?.total_clusters || 2) : (data.mp_network?.total_blocs || 3)}
            </p>
          </div>
        </div>

        <div className="card py-3 px-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-warning-container text-warning">
            <span className="material-symbols-outlined">bridge</span>
          </div>
          <div>
            <p className="text-label-sm text-outline">TOP IDEOLOGICAL BRIDGE</p>
            <p className="text-title-sm font-bold text-on-surface truncate max-w-[160px]">
              {bridgeList && bridgeList[0] ? bridgeList[0].label : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph & Node Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visual Node Explorer & Simulated Graph Canvas (8 Cols) */}
        <div className="card lg:col-span-8 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-outline-variant/40">
            <div>
              <h3 className="text-headline-md font-bold text-on-surface">
                {activeGraphMode === 'party' ? 'Party Alliance Cluster Map' : 'MP Cross-Bench Alignment Canvas'}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Nodes sized by speech volume, colored by party palette, and connected by stance cosine similarity ≥ 0.65.
              </p>
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-1.5 bg-surface-container-low p-1 rounded-md border border-outline-variant text-label-sm">
              {['ALL', 'Ruling Coalition', 'Opposition Benches'].map(bench => (
                <button
                  key={bench}
                  onClick={() => setFilterBench(bench)}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                    filterBench === bench 
                      ? 'bg-primary text-on-primary' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {bench === 'ALL' ? 'All Benches' : bench.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Node Grid Layout (Simulated Force-Directed / Cluster View) */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
            {/* Background subtle grid pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Nodes Grid organized by Bench Alignment or Community */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 z-10">
              {filteredNodes.map((n, idx) => {
                const isSelected = selectedNode?.id === n.id;
                const isBridge = bridgeList?.some(b => b.id === n.id);
                
                return (
                  <div
                    key={n.id || idx}
                    onClick={() => setSelectedNode(n)}
                    style={{ borderColor: isSelected ? n.color || '#3b82f6' : 'var(--outline-variant)' }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-surface shadow-md ring-2 ring-primary/20 scale-[1.02]' 
                        : 'bg-surface-container-low hover:bg-surface hover:border-outline'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: n.color || '#3b82f6' }} 
                      />
                      {isBridge && (
                        <span className="badge badge-warning text-[10px] px-1.5 py-0.5 flex items-center gap-0.5" title="High Betweenness Centrality (Bridge Node)">
                          <span className="material-symbols-outlined text-[12px]">bridge</span>
                          Bridge
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-title-sm text-on-surface truncate" title={n.label}>
                      {n.label}
                    </h4>
                    
                    <div className="flex justify-between items-center mt-3 text-label-sm text-on-surface-variant pt-2 border-t border-outline-variant/30">
                      <span>{n.bench_alignment === 'Ruling Coalition' ? 'Coalition' : 'Opposition'}</span>
                      <span className={`font-extrabold ${n.avg_polarity >= 0 ? 'text-success' : 'text-error'}`}>
                        {n.avg_polarity >= 0 ? `+${n.avg_polarity}` : n.avg_polarity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredNodes.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant z-10">
                <p className="text-title-md font-bold">No nodes match your current bench filter or search.</p>
                <button onClick={() => { setSearchTerm(''); setFilterBench('ALL'); }} className="btn btn-secondary mt-3">
                  Reset Filters
                </button>
              </div>
            )}

            {/* Bottom Graph Legend & Metrics Info */}
            <div className="mt-6 pt-4 border-t border-outline-variant/40 flex flex-wrap justify-between items-center gap-3 text-label-sm text-on-surface-variant z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-success" />
                  Ruling Coalition (+)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-error" />
                  Opposition Bench (-)
                </span>
              </div>
              <span className="italic">Click any node to inspect full centrality metrics & connected edges</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Profile & Ideological Bridges Panel (4 Cols) */}
        <div className="card lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-headline-md font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_search</span>
              Node Intelligence Card
            </h3>

            {selectedNode ? (
              <div className="space-y-4">
                {/* Node Title Badge */}
                <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="badge px-2.5 py-1 text-xs font-bold text-white rounded"
                      style={{ backgroundColor: selectedNode.color || '#3b82f6' }}
                    >
                      {selectedNode.party || selectedNode.id}
                    </span>
                    <span className="text-label-sm font-semibold text-on-surface-variant">
                      {selectedNode.community || 'Alliance Cluster'}
                    </span>
                  </div>
                  <h4 className="text-headline-md font-extrabold text-on-surface">
                    {selectedNode.label}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {selectedNode.house || 'Parliamentary Bench Node'} • {selectedNode.speech_count} Speeches Analyzed
                  </p>
                </div>

                {/* Centrality Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60">
                    <p className="text-label-sm text-outline">DEGREE CENTRALITY</p>
                    <p className="text-title-lg font-extrabold text-primary mt-0.5">
                      {selectedNode.degree_centrality}
                    </p>
                    <p className="text-body-sm text-on-surface-variant text-[11px]">
                      Connected to {Math.round((selectedNode.degree_centrality || 0.1) * nodes.length)} peers
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60">
                    <p className="text-label-sm text-outline">BETWEENNESS (BRIDGE)</p>
                    <p className="text-title-lg font-extrabold text-warning mt-0.5">
                      {selectedNode.betweenness_centrality}
                    </p>
                    <p className="text-body-sm text-on-surface-variant text-[11px]">
                      Cross-bench moderation potential
                    </p>
                  </div>
                </div>

                {/* Sentiment & Stance Profile */}
                <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-label-md font-bold text-on-surface">Mean Sentiment Polarity</span>
                    <span className={`text-title-md font-extrabold ${selectedNode.avg_polarity >= 0 ? 'text-success' : 'text-error'}`}>
                      {selectedNode.avg_polarity >= 0 ? `+${selectedNode.avg_polarity}` : selectedNode.avg_polarity}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full rounded-full ${selectedNode.avg_polarity >= 0 ? 'bg-success' : 'bg-error'}`} 
                      style={{ width: `${Math.min(100, Math.abs(selectedNode.avg_polarity))}%` }} 
                    />
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-2 text-xs">
                    Aligns with <strong>{selectedNode.bench_alignment}</strong> across national debates.
                  </p>
                </div>

                {/* Connected Edges List */}
                <div>
                  <h5 className="text-label-md font-bold text-on-surface mb-2 uppercase text-xs">
                    Top Stance Connections (Cosine ≥ 0.65)
                  </h5>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {links
                      .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                      .slice(0, 5)
                      .map((l, idx) => {
                        const targetId = l.source === selectedNode.id ? l.target : l.source;
                        return (
                          <div key={idx} className="flex justify-between items-center p-2 rounded bg-surface-container-low text-body-sm">
                            <span className="font-semibold text-on-surface truncate max-w-[170px]">{targetId}</span>
                            <span className="badge badge-primary text-xs font-bold">
                              {l.weight} Sim
                            </span>
                          </div>
                        );
                      })}
                    {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).length === 0 && (
                      <p className="text-body-sm text-on-surface-variant italic py-2">No direct edges exceed threshold.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">touch_app</span>
                <p className="font-semibold">Select a node from the left map to view its full legislative network profile.</p>
              </div>
            )}
          </div>

          {/* Top Ideological Bridges Spotlight */}
          <div className="mt-6 pt-4 border-t border-outline-variant/40">
            <h4 className="text-label-md font-bold text-warning uppercase flex items-center gap-1.5 mb-2.5">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Top Cross-Bench Ideological Bridges
            </h4>
            <div className="space-y-2">
              {bridgeList && bridgeList.slice(0, 3).map((b, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedNode(b)}
                  className="flex justify-between items-center p-2 rounded bg-surface-container-low hover:bg-surface cursor-pointer transition-colors border border-outline-variant/40"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-label-sm font-bold w-4 h-4 rounded-full bg-warning/20 text-warning flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-body-sm text-on-surface truncate">{b.label}</span>
                  </div>
                  <span className="badge badge-warning text-[11px]">
                    {b.betweenness_centrality} B-Cent
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Party vs. Topic Stance Divergence Heatmap */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>grid_on</span>
              <span className="text-label-md font-bold text-primary uppercase">Multi-Domain Alignment Matrix</span>
            </div>
            <h3 className="text-headline-md font-bold text-on-surface">
              Party vs. Policy Topic Stance Divergence Heatmap
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Average emotional polarity score (`-100` Strong Opposition to `+100` Strong Support) for major parties across all 6 core legislative domains.
            </p>
          </div>

          <div className="flex items-center gap-3 text-label-sm font-semibold bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant">
            <span className="flex items-center gap-1.5 text-success">
              <span className="w-3 h-3 rounded bg-success" /> Support (≥ +40)
            </span>
            <span className="flex items-center gap-1.5 text-warning">
              <span className="w-3 h-3 rounded bg-warning" /> Neutral / Mixed
            </span>
            <span className="flex items-center gap-1.5 text-error">
              <span className="w-3 h-3 rounded bg-error" /> Oppose (≤ -40)
            </span>
          </div>
        </div>

        {/* Heatmap Table Matrix */}
        <div className="overflow-x-auto border border-outline-variant rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-3.5 px-4 font-bold text-label-md text-on-surface min-w-[220px]">
                  POLICY DOMAIN / CATEGORY
                </th>
                {['BJP', 'INC', 'TMC', 'DMK', 'JD(U)', 'SP', 'AIMIM'].map(party => (
                  <th key={party} className="py-3.5 px-4 text-center font-extrabold text-title-sm text-on-surface min-w-[100px]">
                    {party}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 bg-surface-container-lowest">
              {(data.party_topic_divergence_heatmap || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-body-md text-on-surface">
                    {row.category}
                  </td>
                  {['BJP', 'INC', 'TMC', 'DMK', 'JD(U)', 'SP', 'AIMIM'].map(party => {
                    const score = row[party];
                    let bgClass = "bg-surface-container text-on-surface-variant";
                    if (score !== undefined) {
                      if (score >= 40) bgClass = "bg-success/20 text-success font-extrabold border-b-2 border-success";
                      else if (score >= 0) bgClass = "bg-success/10 text-success font-bold";
                      else if (score >= -39) bgClass = "bg-warning/15 text-warning font-bold";
                      else bgClass = "bg-error/20 text-error font-extrabold border-b-2 border-error";
                    }

                    return (
                      <td key={party} className="py-4 px-3 text-center">
                        <span className={`inline-block w-full py-1.5 rounded-md text-body-sm ${bgClass}`}>
                          {score !== undefined ? (score > 0 ? `+${score}` : score) : 'N/A'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkAnalysisView;
