# Cyber Intel Console

Cyber Intel Console is a React + Vite frontend for scanning messages, emails, and URLs for common scam and phishing indicators. It presents a cyber-style analysis dashboard with a risk score, verdict, highlighted suspicious text, threat signals, and scan statistics.

The project currently uses a local mock analysis engine, so it works without a backend server. The mock engine checks the submitted text against weighted keyword categories and regex patterns such as authority impersonation, payment demands, urgency, OTP requests, suspicious links, and credential theft language.

## Features

- Paste a message, email, or URL for analysis
- View a scam risk score from 0 to 100
- See verdicts such as Likely Safe, Suspicious, or Scam Detected
- Highlight suspicious or high-risk phrases in the submitted text
- Display detected threat signals and keyword breakdowns
- Use quick example inputs for lottery scam, phishing, and safe message cases
- Simulated scan pipeline with parsing, scanning, scoring, and report stages
- Responsive dashboard built with React, Vite, and Tailwind CSS

## Project Structure

```text
cyber-intel-console/
├── public/                 Static icons and public assets
├── src/
│   ├── assets/             App images and SVG assets
│   ├── components/         UI components used by the dashboard
│   ├── services/           Mock analysis API and scoring logic
│   ├── App.jsx             Main application layout and state flow
│   ├── index.css           Global styles and Tailwind utilities
│   └── main.jsx            React entry point
├── index.html              Vite HTML entry file
├── package.json            Scripts and dependencies
├── tailwind.config.js      Tailwind theme configuration
└── vite.config.js          Vite configuration
```

## Main Files

- `src/App.jsx` controls the main dashboard, scan flow, loading stages, and result state.
- `src/components/InputPanel.jsx` contains the text input, input type tabs, quick examples, and scan button.
- `src/components/AnalysisPanel.jsx` renders the risk meter, metadata, highlighted text, threat signals, and keyword breakdown.
- `src/services/mockApi.js` contains the mock scam detection logic and fake statistics.
- `src/index.css` contains the shared visual styling for the cyber console UI.

## Requirements

Install Node.js before running the project. A current LTS version of Node.js is recommended.

You can check your installed versions with:

```bash
node --version
npm --version
```

## How To Use

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

4. Paste a message, email, or URL into the input area.

5. Click **Run Analysis**.

6. Review the analysis report on the right side of the dashboard.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build in the `dist` folder.

```bash
npm run preview
```

Serves the production build locally for preview.

```bash
npm run lint
```

Runs ESLint across the project.

## How The Mock Analysis Works

The current analyzer is implemented in `src/services/mockApi.js`. It does not call a real API. Instead, it:

1. Searches the submitted text for known scam-related keywords.
2. Runs pattern checks for combinations like payment plus threat, authority plus illegal activity, suspicious shortened URLs, or OTP sharing requests.
3. Computes a weighted risk score.
4. Converts the score into a verdict.
5. Returns highlighted text segments, threat signals, keyword groups, and scan metadata.

This makes the frontend easy to test and demo without needing a backend.

## Connecting A Real Backend Later

To connect the app to a real scam detection service, replace the body of `analyzeText()` in `src/services/mockApi.js` with an API request, for example:

```js
const res = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text }),
});

return res.json();
```

The backend response should match the same result shape currently returned by the mock analyzer, or the frontend components should be updated to match the new response format.

## Notes

- This project is a frontend prototype and demonstration tool.
- The current detection logic is rule-based and should not be treated as a production-grade security system.
- For real-world use, connect it to a properly tested backend model, logging system, and abuse-reporting workflow.
