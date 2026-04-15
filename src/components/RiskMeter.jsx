import { useEffect, useRef } from 'react';

const RISK_CONFIG = {
  danger: { color: '#ef4444', track: '#7f1d1d', label: 'CRITICAL RISK' },
  warn:   { color: '#f59e0b', track: '#78350f', label: 'MODERATE RISK' },
  safe:   { color: '#22c55e', track: '#14532d', label: 'LOW RISK'      },
  idle:   { color: '#334155', track: '#1e293b', label: 'AWAITING INPUT' },
};

// SVG arc helper
function describeArc(cx, cy, r, startDeg, endDeg) {
  const toRad = (d) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

const START_DEG = 135;
const END_DEG   = 405; // 360 + 45 = 270° arc

export default function RiskMeter({ score = 0, risk = 'idle', loading = false }) {
  const arcRef   = useRef(null);
  const scoreRef = useRef(null);

  const cfg = RISK_CONFIG[risk] || RISK_CONFIG.idle;
  const cx = 80, cy = 80, r = 60;
  const totalArc = END_DEG - START_DEG; // 270°
  const filled = (score / 100) * totalArc;

  // Animate arc
  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;

    const totalLength = (2 * Math.PI * r * totalArc) / 360;
    el.style.strokeDasharray = `${totalLength}`;

    const target = loading ? 0 : (score / 100) * totalLength;
    el.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease';
    el.style.strokeDashoffset = `${totalLength - target}`;
    el.style.stroke = cfg.color;
  }, [score, risk, loading]);

  // Animate score number
  const prevScore = useRef(0);
  useEffect(() => {
    const el = scoreRef.current;
    if (!el) return;
    const target = score;
    const start  = prevScore.current;
    const steps  = 40;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      const val = Math.round(start + ((target - start) * i) / steps);
      el.textContent = val;
      if (i >= steps) { el.textContent = target; prevScore.current = target; clearInterval(timer); }
    }, 900 / steps);
    return () => clearInterval(timer);
  }, [score]);

  const arcPath   = describeArc(cx, cy, r, START_DEG, END_DEG);
  const totalLen  = (2 * Math.PI * r * totalArc) / 360;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <span className="label-tag">Threat Score</span>

      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Track arc */}
          <path
            d={arcPath}
            fill="none"
            stroke={cfg.track}
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            ref={arcRef}
            d={arcPath}
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeLinecap="round"
            style={{
              strokeDasharray: totalLen,
              strokeDashoffset: totalLen,
              filter: loading ? 'none' : `drop-shadow(0 0 6px ${cfg.color}80)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {loading ? (
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin_slow"
              style={{ borderColor: `${cfg.color}60`, borderTopColor: 'transparent' }}
            />
          ) : (
            <>
              <span
                ref={scoreRef}
                className="font-mono font-black leading-none"
                style={{ fontSize: 38, color: cfg.color }}
              >
                {score}
              </span>
              <span className="label-tag mt-0.5">/100</span>
            </>
          )}
        </div>
      </div>

      {/* Verdict badge */}
      <div
        className="px-3 py-1 rounded border text-[11px] font-mono font-semibold tracking-widest uppercase transition-all duration-500"
        style={{
          color: cfg.color,
          borderColor: `${cfg.color}40`,
          backgroundColor: `${cfg.color}10`,
          boxShadow: risk !== 'idle' ? `0 0 12px ${cfg.color}20` : 'none',
        }}
      >
        {loading ? 'ANALYZING…' : cfg.label}
      </div>
    </div>
  );
}
