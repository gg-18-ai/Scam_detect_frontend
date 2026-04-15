/**
 * Terminal-style text box with highlighted spans.
 * segments: Array<{ text: string, type: 'normal' | 'danger' | 'warn' }>
 */
export default function TerminalText({ segments = [], loading = false }) {
  if (loading) {
    return (
      <div className="font-mono text-sm text-cyber-dim bg-[#0a0f1a] border border-[#1e293b] rounded p-4 min-h-[120px] flex flex-col gap-2">
        {/* Scanning animation lines */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-[#1e293b] animate-pulse"
            style={{ width: `${60 + Math.random() * 35}%`, animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    );
  }

  if (!segments.length) {
    return (
      <div className="font-mono text-sm text-cyber-dim bg-[#0a0f1a] border border-[#1e293b] rounded p-4 min-h-[120px] flex items-center justify-center">
        <span className="opacity-40">// Awaiting input…</span>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm bg-[#0a0f1a] border border-[#1e293b] rounded p-4 leading-relaxed break-words min-h-[120px]">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#1e293b]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
        <span className="ml-2 label-tag">analysis.txt</span>
      </div>

      {/* Highlighted content */}
      <p className="whitespace-pre-wrap text-cyber-text/80">
        {segments.map((seg, idx) => {
          if (seg.type === 'danger') {
            return (
              <mark
                key={idx}
                className="rounded px-0.5 font-semibold text-white animate-pulse_danger"
                style={{
                  backgroundColor: 'rgba(239,68,68,0.22)',
                  color: '#fca5a5',
                  textDecoration: 'none',
                }}
              >
                {seg.text}
              </mark>
            );
          }
          if (seg.type === 'warn') {
            return (
              <mark
                key={idx}
                className="rounded px-0.5 font-semibold"
                style={{
                  backgroundColor: 'rgba(245,158,11,0.18)',
                  color: '#fcd34d',
                  textDecoration: 'none',
                }}
              >
                {seg.text}
              </mark>
            );
          }
          return <span key={idx}>{seg.text}</span>;
        })}
      </p>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#1e293b]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(239,68,68,0.4)' }} />
          <span className="label-tag">HIGH RISK</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(245,158,11,0.35)' }} />
          <span className="label-tag">SUSPICIOUS</span>
        </div>
      </div>
    </div>
  );
}
