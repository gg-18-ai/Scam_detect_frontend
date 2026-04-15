const RISK_SIGNAL_COLORS = {
  danger: { text: 'text-[#fca5a5]', dot: 'bg-cyber-danger', border: 'border-[#7f1d1d]', bg: 'bg-[#7f1d1d]/20' },
  warn:   { text: 'text-[#fcd34d]', dot: 'bg-cyber-warn',   border: 'border-[#78350f]', bg: 'bg-[#78350f]/20' },
  safe:   { text: 'text-[#86efac]', dot: 'bg-cyber-safe',   border: 'border-[#14532d]', bg: 'bg-[#14532d]/20' },
};

export default function SignalList({ signals = [], loading = false }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 rounded bg-[#1e293b] animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  if (!signals.length) {
    return <p className="text-cyber-dim text-xs font-mono">No signals to display.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {signals.map((sig, idx) => {
        const c = RISK_SIGNAL_COLORS[sig.risk] || RISK_SIGNAL_COLORS.safe;
        return (
          <div
            key={idx}
            className={`flex items-center justify-between px-3 py-2 rounded border ${c.border} ${c.bg} animate-fade_in`}
            style={{ animationDelay: `${idx * 60}ms`, opacity: 0 }}
          >
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
              <span className={`text-xs font-mono ${c.text}`}>{sig.label}</span>
            </div>
            <span className={`text-[11px] font-semibold font-mono ${c.text} opacity-80`}>{sig.value}</span>
          </div>
        );
      })}
    </div>
  );
}
