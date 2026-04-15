const STAGES = [
  { id: 0, label: 'Input',     short: '01' },
  { id: 1, label: 'Parsing',   short: '02' },
  { id: 2, label: 'Scanning',  short: '03' },
  { id: 3, label: 'Scoring',   short: '04' },
  { id: 4, label: 'Report',    short: '05' },
];

export default function StageTracker({ stage }) {
  return (
    <div className="flex items-center gap-0 w-full select-none" role="progressbar" aria-valuenow={stage} aria-valuemax={4}>
      {STAGES.map((s, idx) => {
        const isActive   = s.id === stage;
        const isComplete = s.id < stage;
        const isFuture   = s.id > stage;

        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  'relative flex items-center justify-center w-7 h-7 rounded-full border font-mono text-[10px] font-bold transition-all duration-500',
                  isComplete ? 'bg-[#14532d] border-cyber-safe text-cyber-safe'            : '',
                  isActive   ? 'bg-[#0f172a] border-cyber-text text-cyber-text scale-110 animate-node_pop' : '',
                  isFuture   ? 'bg-[#0f172a] border-[#1e293b] text-[#334155]'              : '',
                ].join(' ')}
              >
                {isComplete ? (
                  <svg className="w-3 h-3 text-cyber-safe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.short
                )}
                {/* Glow ring for active */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full border border-cyber-text/30 animate-ping" />
                )}
              </div>
              <span
                className={[
                  'text-[9px] font-semibold tracking-widest uppercase transition-all duration-300',
                  isComplete ? 'text-cyber-safe'  : '',
                  isActive   ? 'text-cyber-text'  : '',
                  isFuture   ? 'text-[#334155]'   : '',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {idx < STAGES.length - 1 && (
              <div className="flex-1 mx-1 h-px relative overflow-hidden">
                <div className="absolute inset-0 bg-[#1e293b]" />
                <div
                  className="absolute inset-0 bg-cyber-safe transition-all duration-700 origin-left"
                  style={{ transform: `scaleX(${isComplete ? 1 : 0})` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
