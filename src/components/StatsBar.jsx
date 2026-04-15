import { useEffect, useState } from 'react';
import { getStats } from '../services/mockApi';

const STAT_ITEMS = [
  { key: 'totalScanned',  label: 'Total Scanned' },
  { key: 'scamsDetected', label: 'Scams Found'   },
  { key: 'safeMessages',  label: 'Safe'           },
  { key: 'accuracy',      label: 'Accuracy',  suffix: '%' },
];

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const steps = 40;
    const duration = 900;
    const step = value / steps;
    let current = 0;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      current = Math.min(current + step, value);
      setDisplay(typeof value === 'number' && !Number.isInteger(value)
        ? parseFloat(current.toFixed(1))
        : Math.round(current));
      if (count >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {typeof value === 'number' && !Number.isInteger(value)
        ? display.toFixed(1)
        : display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsBar({ stats }) {
  return (
    <header className="border-b border-[#1e293b] bg-[#0c1424]">
      <div className="flex items-center justify-between px-6 h-12">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-cyber-safe animate-pulse" />
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-cyber-text uppercase">
            Cyber Intel Console
          </span>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-[#1e293b] text-cyber-dim">
            v2.4.1
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {STAT_ITEMS.map(({ key, label, suffix }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="label-tag hidden sm:block">{label}</span>
              <span className="font-mono text-xs font-semibold text-cyber-text">
                {stats ? (
                  <AnimatedNumber value={stats[key]} suffix={suffix || ''} />
                ) : (
                  <span className="text-cyber-dim animate-pulse">—</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-safe animate-pulse" />
          <span className="label-tag">LIVE</span>
        </div>
      </div>
    </header>
  );
}
