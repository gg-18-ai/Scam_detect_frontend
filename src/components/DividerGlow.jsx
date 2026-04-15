/**
 * Vertical glowing divider — changes glow color based on the current risk.
 */
const GLOW_COLORS = {
  danger: '#ef4444',
  warn:   '#f59e0b',
  safe:   '#22c55e',
  idle:   '#334155',
};

export default function DividerGlow({ risk = 'idle' }) {
  const color = GLOW_COLORS[risk] || GLOW_COLORS.idle;

  return (
    <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 1 }}>
      <div
        className="w-px flex-1 transition-all duration-700"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${color} 20%, ${color} 80%, transparent 100%)`,
          boxShadow: risk !== 'idle' ? `0 0 8px 1px ${color}50` : 'none',
        }}
      />
    </div>
  );
}
