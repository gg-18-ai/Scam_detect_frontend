import RiskMeter from './RiskMeter';
import TerminalText from './TerminalText';
import SignalList from './SignalList';

const META_EMPTY = [
  { label: 'Words',       value: '—' },
  { label: 'Characters',  value: '—' },
  { label: 'Threats',     value: '—' },
  { label: 'Analyzed At', value: '—' },
];

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AnalysisPanel({ result, loading }) {
  const risk      = result?.verdict?.risk || 'idle';
  const score     = result?.score         || 0;
  const segments  = result?.segments      || [];
  const signals   = result?.signals       || [];

  const meta = result
    ? [
        { label: 'Words',       value: result.wordCount },
        { label: 'Characters',  value: result.charCount },
        { label: 'Threats',     value: result.flaggedScam.length + result.flaggedSuspicious.length },
        { label: 'Analyzed At', value: formatTime(result.analyzedAt) },
      ]
    : META_EMPTY;

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">

      {/* Top row: Risk meter + meta stats */}
      <div className="cyber-card p-5 flex items-center gap-6">
        {/* Meter */}
        <RiskMeter score={score} risk={risk} loading={loading} />

        {/* Vertical divider */}
        <div className="w-px self-stretch bg-[#1e293b]" />

        {/* Meta grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4">
          {meta.map((m) => (
            <div key={m.label}>
              <p className="label-tag">{m.label}</p>
              <p className="font-mono text-lg font-bold text-cyber-text mt-0.5 leading-none">
                {loading ? (
                  <span className="text-cyber-dim animate-pulse">…</span>
                ) : (
                  m.value
                )}
              </p>
            </div>
          ))}

          {/* Verdict text */}
          {result && !loading && (
            <div className="col-span-2">
              <p className="label-tag">Verdict</p>
              <p
                className="font-mono text-sm font-semibold mt-0.5"
                style={{ color: result.verdict.color }}
              >
                {result.verdict.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Text Analysis */}
      <div className="cyber-card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="label-tag">Text Analysis</p>
          {result && (
            <p className="label-tag text-cyber-safe">
              {result.flaggedScam.length + result.flaggedSuspicious.length} flagged
            </p>
          )}
        </div>
        <TerminalText segments={segments} loading={loading} />
      </div>

      {/* Threat Signals */}
      <div className="cyber-card p-5 flex flex-col gap-3">
        <p className="label-tag">Threat Signals</p>
        <SignalList signals={signals} loading={loading} />
      </div>

      {/* Keyword breakdown */}
      {result && !loading && (
        <div className="cyber-card p-5 flex flex-col gap-3 animate-fade_in">
          <p className="label-tag">Keyword Breakdown</p>

          {result.flaggedScam.length > 0 && (
            <div>
              <p className="label-tag text-cyber-danger mb-1.5">High Risk</p>
              <div className="flex flex-wrap gap-1.5">
                {result.flaggedScam.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold border"
                    style={{
                      color: '#fca5a5',
                      borderColor: '#7f1d1d',
                      backgroundColor: 'rgba(127,29,29,0.2)',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.flaggedSuspicious.length > 0 && (
            <div>
              <p className="label-tag text-cyber-warn mb-1.5">Suspicious</p>
              <div className="flex flex-wrap gap-1.5">
                {result.flaggedSuspicious.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold border"
                    style={{
                      color: '#fcd34d',
                      borderColor: '#78350f',
                      backgroundColor: 'rgba(120,53,15,0.2)',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.flaggedScam.length === 0 && result.flaggedSuspicious.length === 0 && (
            <p className="text-xs font-mono text-cyber-safe">No suspicious keywords detected.</p>
          )}
        </div>
      )}

      {/* Idle placeholder */}
      {!result && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center animate-fade_in">
          <div className="w-12 h-12 rounded-full border border-[#1e293b] flex items-center justify-center">
            <svg className="w-5 h-5 text-cyber-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944 
                   11.955 11.955 0 01.382 7.984l-.083 1.06A11.978 11.978 0 
                   0012 22c5.963 0 10.92-4.354 11.701-10.017l-.083-1.06z" />
            </svg>
          </div>
          <p className="text-cyber-dim text-xs font-mono">
            Submit a message to begin threat analysis
          </p>
        </div>
      )}
    </div>
  );
}
