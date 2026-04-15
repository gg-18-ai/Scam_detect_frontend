/**
 * mockApi.js — Realistic scam analysis engine
 *
 * HOW TO CONNECT REAL BACKEND:
 * Replace analyzeText() body with:
 *   const res = await fetch('/api/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) });
 *   return res.json();
 *
 * The shape returned must match the structure below.
 */

// ─── Keyword Dictionaries (weighted by danger level) ────────────────────────

const THREAT_CATEGORIES = [
  // ── Authority Impersonation ─────────────────────────────────
  {
    name: 'Authority Impersonation',
    weight: 20,
    risk: 'danger',
    keywords: [
      'police', 'officer', 'detective', 'fbi', 'cbi', 'cia', 'interpol',
      'irs', 'income tax', 'cyber crime', 'cybercrime', 'enforcement',
      'government', 'ministry', 'department of', 'official notice',
      'court', 'judge', 'legal notice', 'warrant', 'summons',
      'anti-terrorism', 'narcotics', 'ed officer', 'enforcement directorate',
    ],
  },

  // ── Extortion & Payment Demands ─────────────────────────────
  {
    name: 'Extortion / Payment Demand',
    weight: 22,
    risk: 'danger',
    keywords: [
      'pay now', 'pay immediately', 'send money', 'transfer money',
      'wire transfer', 'pay or', 'pay $', 'pay rs', 'pay ₹',
      'fine of', 'penalty of', 'payment of', 'bail amount',
      'settlement fee', 'processing fee', 'release fee',
      'send bitcoin', 'send crypto', 'send gift card',
      'google play card', 'itunes card', 'amazon gift',
    ],
  },

  // ── Threats & Fear Tactics ───────────────────────────────────
  {
    name: 'Threat / Fear Tactic',
    weight: 20,
    risk: 'danger',
    keywords: [
      'get arrested', 'will be arrested', 'face arrest', 'arrest warrant',
      'or get arrested', 'or you will be arrested',
      'go to jail', 'sent to jail', 'prison', 'behind bars',
      'criminal charges', 'criminal case', 'fir will be filed',
      'case registered', 'non-bailable', 'non bailable',
      'seized', 'frozen', 'account blocked', 'account suspended',
      'action will be taken', 'legal action', 'face consequences',
      'or else', 'otherwise you', 'failing which',
    ],
  },

  // ── Illegal Activity Accusations ────────────────────────────
  {
    name: 'Illegal Activity Accusation',
    weight: 18,
    risk: 'danger',
    keywords: [
      'illegal activity', 'illegal activities', 'illegal transaction',
      'money laundering', 'drug trafficking', 'terror funding',
      'fraud detected', 'fraudulent activity',
      'involved in crime', 'linked to crime', 'linked to illegal',
      'under investigation', 'criminal investigation',
      'suspicious transaction', 'suspicious activity',
      'your account is involved', 'your number is involved',
    ],
  },

  // ── Identity Document Scams ──────────────────────────────────
  {
    name: 'Identity Document Scam',
    weight: 16,
    risk: 'danger',
    keywords: [
      'aadhaar', 'aadhar', 'aadhar card', 'aadhaar card',
      'aadhaar linked', 'aadhar linked', 'aadhar number',
      'pan card', 'pan number', 'passport number',
      'social security', 'ssn', 'national id',
      'kyc verification', 'kyc update', 'kyc expired',
      'kyc pending', 're-kyc', 'ekyc',
      'voter id', 'driving license linked',
    ],
  },

  // ── Urgency & Pressure ───────────────────────────────────────
  {
    name: 'Urgency / Pressure',
    weight: 10,
    risk: 'warn',
    keywords: [
      'immediately', 'within 24 hours', 'within 2 hours', 'within 1 hour',
      'right now', 'do not ignore', 'do not delay', 'last warning',
      'final notice', 'urgent notice', 'immediate action',
      'time is running out', 'expires today', 'deadline',
      'respond immediately', 'call back immediately', 'contact now',
      'last chance', 'act immediately',
    ],
  },

  // ── Classic Lottery / Prize Scams ────────────────────────────
  {
    name: 'Lottery / Prize Scam',
    weight: 14,
    risk: 'danger',
    keywords: [
      'you have won', "you've won", 'you are selected', 'been selected',
      'lucky winner', 'lucky draw', 'lottery winner',
      'prize money', 'claim your prize', 'claim now',
      'scratch card', 'reward of', 'jackpot',
      'free iphone', 'free gift', 'free money',
      'won a car', 'won a phone', 'won $', 'won rs',
    ],
  },

  // ── Phishing / Credential Theft ──────────────────────────────
  {
    name: 'Phishing / Credential Theft',
    weight: 15,
    risk: 'danger',
    keywords: [
      'verify your account', 'confirm your details', 'update your details',
      'enter your password', 'confirm password', 'reset your pin',
      'enter otp', 'share otp', 'otp is', 'do not share otp',
      'bank details', 'card number', 'cvv', 'expiry date',
      'net banking', 'login credentials', 'account credentials',
    ],
  },

  // ── Suspicious (low severity) ─────────────────────────────────
  {
    name: 'Suspicious Language',
    weight: 5,
    risk: 'warn',
    keywords: [
      'click here', 'click the link', 'visit our website',
      'call us at', 'whatsapp us', 'contact us on',
      'offer expires', 'limited time', 'exclusive deal',
      'free', 'discount', 'bonus', 'no cost', 'zero cost',
      'earn from home', 'work from home', 'make money',
    ],
  },
];

// ─── Pattern Detectors (regex-based, very high weight) ───────────────────────

const PATTERN_DETECTORS = [
  {
    name: 'Money + Threat Combo',
    risk: 'danger',
    score: 35,
    test: (t) =>
      /pay.{0,40}(dollar|rupee|rs|₹|\$|usd|inr)/i.test(t) &&
      /(arrest|jail|prison|legal|police)/i.test(t),
  },
  {
    name: 'Authority + Illegal Activity',
    risk: 'danger',
    score: 30,
    test: (t) =>
      /(police|cbi|fbi|court|government|officer)/i.test(t) &&
      /(illegal|crime|criminal|fraud|money laundering)/i.test(t),
  },
  {
    name: 'Phone Scam — Pay or Arrest',
    risk: 'danger',
    score: 40,
    test: (t) =>
      /(pay|send).{0,60}(or|else|otherwise).{0,30}(arrest|jail|court|action|prison)/i.test(t),
  },
  {
    name: 'Document Linked to Crime',
    risk: 'danger',
    score: 28,
    test: (t) =>
      /(aadhaar|aadhar|pan|ssn|passport|id card).{0,60}(illegal|crime|linked|involved|fraud)/i.test(t),
  },
  {
    name: 'Shortened / Suspicious URL',
    risk: 'danger',
    score: 20,
    test: (t) => /bit\.ly|tinyurl|t\.co|rb\.gy|cutt\.ly|ow\.ly/i.test(t),
  },
  {
    name: 'OTP / Credential Share Request',
    risk: 'danger',
    score: 25,
    test: (t) => /(share|send|give|enter|provide).{0,20}(otp|pin|password|cvv|card number)/i.test(t),
  },
  {
    name: 'Currency Amount Demand',
    risk: 'warn',
    score: 15,
    test: (t) => /(\$|₹|rs\.?|usd|inr)\s?\d+|pay\s+\d+|send\s+\d+/i.test(t),
  },
  {
    name: 'All-Caps Aggression',
    risk: 'warn',
    score: 8,
    test: (t) => {
      const caps = (t.match(/\b[A-Z]{3,}\b/g) || []).length;
      return caps >= 3;
    },
  },
  {
    name: 'Excessive Exclamation',
    risk: 'warn',
    score: 5,
    test: (t) => (t.match(/!/g) || []).length >= 3,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function runKeywordDetection(text) {
  const lower = text.toLowerCase();
  const hits = []; // { category, keyword, weight, risk }

  for (const cat of THREAT_CATEGORIES) {
    for (const kw of cat.keywords) {
      if (lower.includes(kw)) {
        hits.push({ category: cat.name, keyword: kw, weight: cat.weight, risk: cat.risk });
      }
    }
  }

  return hits;
}

function runPatternDetection(text) {
  const triggered = [];
  for (const p of PATTERN_DETECTORS) {
    if (p.test(text)) {
      triggered.push({ name: p.name, score: p.score, risk: p.risk });
    }
  }
  return triggered;
}

function computeScore(keywordHits, patternHits, text) {
  let score = 0;

  // Keyword contributions — deduplicate by category, take max weight per category
  const byCategory = {};
  for (const h of keywordHits) {
    if (!byCategory[h.category] || byCategory[h.category] < h.weight) {
      byCategory[h.category] = h.weight;
    }
  }
  // Sum up category weights (capped contribution per category)
  for (const weight of Object.values(byCategory)) {
    score += weight;
  }
  // Bonus for many keyword hits within a bad category
  score += Math.min(keywordHits.filter((h) => h.risk === 'danger').length * 3, 20);

  // Pattern contributions
  for (const p of patternHits) {
    score += p.score;
  }

  // External/suspicious URL
  if (/https?:\/\//i.test(text)) score += 8;

  return Math.min(Math.round(score), 100);
}

function scoreToVerdict(score) {
  if (score >= 55) return { label: 'SCAM DETECTED',  risk: 'danger', color: '#ef4444' };
  if (score >= 28) return { label: 'SUSPICIOUS',      risk: 'warn',   color: '#f59e0b' };
  return              { label: 'LIKELY SAFE',          risk: 'safe',   color: '#22c55e' };
}

function buildHighlightedSegments(text, keywordHits) {
  // Flatten all keywords into danger / warn buckets
  const dangerKws    = [...new Set(keywordHits.filter((h) => h.risk === 'danger').map((h) => h.keyword))];
  const warnKws      = [...new Set(keywordHits.filter((h) => h.risk === 'warn').map((h) => h.keyword))];

  const ranges = [];
  const addRanges = (keywords, type) => {
    for (const kw of keywords) {
      let idx = 0;
      const lower = text.toLowerCase();
      while (true) {
        const pos = lower.indexOf(kw, idx);
        if (pos === -1) break;
        ranges.push({ start: pos, end: pos + kw.length, type });
        idx = pos + 1;
      }
    }
  };

  addRanges(dangerKws, 'danger');
  addRanges(warnKws,   'warn');

  // Sort and merge overlapping ranges (danger wins)
  ranges.sort((a, b) => a.start - b.start || (a.type === 'danger' ? -1 : 1));
  const merged = [];
  for (const r of ranges) {
    if (merged.length && r.start < merged[merged.length - 1].end) {
      const last = merged[merged.length - 1];
      if (r.type === 'danger') last.type = 'danger';
      last.end = Math.max(last.end, r.end);
    } else {
      merged.push({ ...r });
    }
  }

  // Build text segments
  const segments = [];
  let cursor = 0;
  for (const { start, end, type } of merged) {
    if (cursor < start) segments.push({ text: text.slice(cursor, start), type: 'normal' });
    segments.push({ text: text.slice(start, end), type });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), type: 'normal' });

  return segments;
}

function buildSignals(keywordHits, patternHits, score) {
  const signals = [];

  // Group keyword hits by category
  const categoryMap = {};
  for (const h of keywordHits) {
    if (!categoryMap[h.category]) categoryMap[h.category] = { count: 0, risk: h.risk };
    categoryMap[h.category].count++;
  }
  for (const [cat, { count, risk }] of Object.entries(categoryMap)) {
    signals.push({ label: cat, value: `${count} match${count > 1 ? 'es' : ''}`, risk });
  }

  // Add pattern signals
  for (const p of patternHits) {
    signals.push({ label: p.name, value: 'Pattern detected', risk: p.risk });
  }

  if (signals.length === 0) {
    signals.push({ label: 'No threats found', value: 'Clean', risk: 'safe' });
  }

  // Sort: danger first, then warn, then safe
  const order = { danger: 0, warn: 1, safe: 2 };
  signals.sort((a, b) => order[a.risk] - order[b.risk]);

  return signals;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function analyzeText(text) {
  // Simulate realistic network + processing delay
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

  const keywordHits  = runKeywordDetection(text);
  const patternHits  = runPatternDetection(text);
  const score        = computeScore(keywordHits, patternHits, text);
  const verdict      = scoreToVerdict(score);
  const segments     = buildHighlightedSegments(text, keywordHits);
  const signals      = buildSignals(keywordHits, patternHits, score);

  const dangerKws     = [...new Set(keywordHits.filter((h) => h.risk === 'danger').map((h) => h.keyword))];
  const suspiciousKws = [...new Set(keywordHits.filter((h) => h.risk === 'warn').map((h) => h.keyword))];

  return {
    score,
    verdict,
    segments,
    signals,
    flaggedScam:       dangerKws,
    flaggedSuspicious: suspiciousKws,
    wordCount:  text.trim().split(/\s+/).filter(Boolean).length,
    charCount:  text.length,
    analyzedAt: new Date().toISOString(),
  };
}

export async function getStats() {
  await new Promise((r) => setTimeout(r, 300));
  return {
    totalScanned:  48291,
    scamsDetected: 12047,
    safeMessages:  31804,
    accuracy:      97.3,
  };
}
