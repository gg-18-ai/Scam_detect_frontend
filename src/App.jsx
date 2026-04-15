import { useEffect, useState, useCallback } from 'react';
import StatsBar from './components/StatsBar';
import InputPanel from './components/InputPanel';
import AnalysisPanel from './components/AnalysisPanel';
import DividerGlow from './components/DividerGlow';
import { analyzeText, getStats } from './services/mockApi';

// Stage IDs: 0=Input, 1=Parsing, 2=Scanning, 3=Scoring, 4=Report
const STAGE_TIMINGS = [0, 300, 700, 1100]; // ms into the request each stage activates

export default function App() {
  const [stats,   setStats]   = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage,   setStage]   = useState(0);
  const [error,   setError]   = useState(null);

  // Fetch global stats on mount
  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  const handleAnalyze = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStage(1);

    // Advance stages on a timer to simulate pipeline
    const timers = STAGE_TIMINGS.slice(1).map((delay, i) =>
      setTimeout(() => setStage(i + 2), delay)
    );

    try {
      const data = await analyzeText(text);
      setResult(data);
      setStage(4); // Report

      // Update live stats
      setStats((prev) =>
        prev
          ? {
              ...prev,
              totalScanned:  prev.totalScanned + 1,
              scamsDetected: data.verdict.risk === 'danger' ? prev.scamsDetected + 1 : prev.scamsDetected,
              safeMessages:  data.verdict.risk === 'safe'   ? prev.safeMessages  + 1 : prev.safeMessages,
            }
          : prev
      );
    } catch (err) {
      setError('Analysis failed. Please try again.');
      setStage(0);
    } finally {
      timers.forEach(clearTimeout);
      setLoading(false);
    }
  }, []);

  const risk = result?.verdict?.risk || 'idle';

  return (
    <div className="flex flex-col h-screen bg-cyber-bg overflow-hidden">
      {/* Top stats bar */}
      <StatsBar stats={stats} />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL (35%) ── */}
        <div
          className="flex-shrink-0 flex flex-col p-6 overflow-y-auto border-r border-[#1e293b]"
          style={{ width: '35%', minWidth: 300 }}
        >
          <InputPanel
            onAnalyze={handleAnalyze}
            loading={loading}
            stage={stage}
          />
        </div>

        {/* ── GLOWING DIVIDER ── */}
        <DividerGlow risk={risk} />

        {/* ── RIGHT PANEL (fluid) ── */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <div>
              <h2 className="text-sm font-bold text-cyber-text tracking-tight">
                Analysis Report
              </h2>
              <p className="text-[11px] text-cyber-dim mt-0.5 font-mono">
                {result
                  ? `Last scan: ${new Date(result.analyzedAt).toLocaleTimeString()}`
                  : 'No scan in session'}
              </p>
            </div>

            {/* Risk badge */}
            {(result || loading) && (
              <div
                className="px-3 py-1 rounded border text-[11px] font-mono font-semibold tracking-widest uppercase transition-all duration-500"
                style={{
                  color: risk === 'danger' ? '#ef4444' : risk === 'warn' ? '#f59e0b' : risk === 'safe' ? '#22c55e' : '#64748b',
                  borderColor: `${risk === 'danger' ? '#7f1d1d' : risk === 'warn' ? '#78350f' : risk === 'safe' ? '#14532d' : '#1e293b'}`,
                  background: `${risk === 'danger' ? 'rgba(127,29,29,0.15)' : risk === 'warn' ? 'rgba(120,53,15,0.15)' : risk === 'safe' ? 'rgba(20,83,45,0.15)' : 'rgba(30,41,59,0.3)'}`,
                }}
              >
                {loading ? '● SCANNING' : result?.verdict?.label}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded border border-cyber-danger/40 bg-cyber-danger/10 text-xs font-mono text-[#fca5a5]">
              ⚠ {error}
            </div>
          )}

          {/* Analysis panel */}
          <div className="flex-1 overflow-y-auto">
            <AnalysisPanel result={result} loading={loading} />
          </div>
        </div>
      </div>

      {/* Thin bottom bar */}
      <div className="flex-shrink-0 border-t border-[#1e293b] bg-[#0c1424] px-6 h-8 flex items-center gap-4">
        <span className="label-tag">
          Status: <span className="text-cyber-safe ml-1">{loading ? 'SCANNING' : 'READY'}</span>
        </span>
        <span className="w-px h-3 bg-[#1e293b]" />
        <span className="label-tag">
          Engine: <span className="text-cyber-text ml-1">CyberScan v2.4</span>
        </span>
        <span className="w-px h-3 bg-[#1e293b]" />
        <span className="label-tag">
          Model: <span className="text-cyber-text ml-1">NLP-Threat-Classifier</span>
        </span>
      </div>
    </div>
  );
}
