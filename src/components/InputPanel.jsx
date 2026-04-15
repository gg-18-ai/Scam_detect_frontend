import { useState } from 'react';
import StageTracker from './StageTracker';

const EXAMPLES = [
  {
    label: 'Lottery Scam',
    text: "CONGRATULATIONS! You've been selected as our LUCKY WINNER! Claim your FREE gift of $5000 now. Click here immediately to verify your account and receive your prize. Act now — limited time offer!",
  },
  {
    label: 'Phishing',
    text: "Your bank account has been suspended. Confirm your details immediately to avoid permanent closure. Click the link to verify your account: http://bit.ly/securebank-verify",
  },
  {
    label: 'Safe Message',
    text: "Hi Sarah, just checking in to see if you're coming to the team meeting tomorrow at 10am. Let me know if you have any questions about the agenda. Thanks!",
  },
];

export default function InputPanel({ onAnalyze, loading, stage }) {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState('message'); // 'message' | 'url' | 'email'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length < 5 || loading) return;
    onAnalyze(text.trim());
  };

  const handleExample = (t) => {
    setText(t);
  };

  const charCount    = text.length;
  const canSubmit    = charCount >= 5 && !loading;
  const charWarning  = charCount > 1800;

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-cyber-text tracking-tight">
          Threat Analysis
        </h1>
        <p className="text-xs text-cyber-dim mt-0.5">
          Submit text, message, or URL to scan for scam indicators.
        </p>
      </div>

      {/* Input Type Toggle */}
      <div className="flex gap-1 p-0.5 bg-[#0a0f1a] rounded border border-[#1e293b]">
        {[
          { id: 'message', label: 'Message' },
          { id: 'email',   label: 'Email'   },
          { id: 'url',     label: 'URL'     },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setInputType(tab.id)}
            className={[
              'flex-1 py-1.5 rounded text-[11px] font-semibold tracking-wide uppercase transition-all duration-150',
              inputType === tab.id
                ? 'bg-[#1e293b] text-cyber-text'
                : 'text-cyber-dim hover:text-cyber-text',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Text Area */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        <div className="relative flex-1">
          <textarea
            id="analysis-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              inputType === 'url'
                ? 'Paste a URL to analyze…'
                : inputType === 'email'
                ? 'Paste email content here…'
                : 'Paste message or text to scan…'
            }
            disabled={loading}
            maxLength={2000}
            className={[
              'cyber-input w-full resize-none h-full min-h-[180px] text-xs leading-relaxed',
              charWarning ? 'border-cyber-warn' : '',
            ].join(' ')}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          <span
            className={[
              'absolute bottom-2 right-2 text-[10px] font-mono',
              charWarning ? 'text-cyber-warn' : 'text-cyber-dim',
            ].join(' ')}
          >
            {charCount}/2000
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            id="btn-analyze"
            type="submit"
            disabled={!canSubmit}
            className="flex-1 cyber-btn bg-[#0f172a] text-cyber-text border border-[#1e293b] relative overflow-hidden
                       hover:border-cyber-safe hover:text-cyber-safe hover:shadow-glow-safe
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <>
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin_slow"
                  style={{ borderColor: '#64748b', borderTopColor: 'transparent' }}
                />
                Scanning…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                Run Analysis
              </>
            )}
          </button>
          <button
            id="btn-clear"
            type="button"
            disabled={loading || !text}
            onClick={() => setText('')}
            className="cyber-btn border border-[#1e293b] text-cyber-dim hover:border-[#334155] hover:text-cyber-text
                       disabled:opacity-30 disabled:cursor-not-allowed px-3"
            title="Clear input"
            aria-label="Clear input"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </form>

      {/* Stage Tracker */}
      <div className="cyber-card p-4">
        <p className="label-tag mb-3">Pipeline</p>
        <StageTracker stage={stage} />
      </div>

      {/* Example Presets */}
      <div>
        <p className="label-tag mb-2">Quick Examples</p>
        <div className="flex flex-col gap-1.5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              id={`example-${ex.label.toLowerCase().replace(/\s/g, '-')}`}
              onClick={() => handleExample(ex.text)}
              disabled={loading}
              className="text-left text-xs text-cyber-dim hover:text-cyber-text px-3 py-2
                         border border-transparent hover:border-[#1e293b] rounded
                         transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
            >
              <span className="text-cyber-safe mr-1">›</span> {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
