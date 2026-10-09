const fs = require('fs');
const path = require('path');

const files = {
  'package.json': `{
  "name": "before-you-act-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.2.0"
  }
}`,

  'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
};`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BEFORE YOU ACT — AI Decision Intelligence</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #020617;
  color: #f8fafc;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #090d16;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}`,

  'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,

  'src/App.jsx': `import React, { useState } from 'react';
import { 
  Compass, ArrowRight, ShieldAlert, GitFork, AlertCircle, 
  HelpCircle, CheckCircle2, ChevronRight, RefreshCw, Sparkles, 
  Layers, UserCheck, Activity, Scale, EyeOff, RotateCcw
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [activeTab, setActiveTab] = useState('options');

  const [formData, setFormData] = useState({
    decision: "Should I drop my current economics degree to switch to computer science at another university?",
    category: "Education",
    currentSituation: "In 2nd year of economics; finding coursework dry; passionate about building software.",
    goals: "Transition into tech as a software engineer with high ceiling.",
    constraints: "Family expects on-time graduation; finite savings for tuition.",
    timeHorizon: "3-5 years",
    location: "International",
    riskTolerance: "Balanced",
    importance: 8
  });

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/decision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data);
        if (data.data.options?.length > 0) {
          setSelectedOptionId(data.data.options[0].id);
        }
        setView('dashboard');
      } else {
        alert(data.error || "Analysis failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to decision engine. Ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => setView('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:border-sky-400 transition-colors">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold tracking-wider text-sm text-slate-100">BEFORE YOU ACT</span>
            <span className="text-[10px] block text-slate-400 font-mono tracking-tight">DECISION INTELLIGENCE PLATFORM</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {view === 'dashboard' && (
            <button
              onClick={() => setView('input')}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Modify Parameters
            </button>
          )}
          {view !== 'input' && view !== 'dashboard' && (
            <button 
              onClick={() => setView('input')}
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium transition-all text-xs flex items-center gap-1.5 shadow-sm shadow-sky-500/20"
            >
              Analyze a Decision <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {view === 'landing' && (
          <div className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/5 text-sky-400 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" /> AI DECISION-INTELLIGENCE SYSTEM
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                See the possibilities <br />
                <span className="text-slate-400">before you choose.</span>
              </h1>

              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                An AI decision-intelligence system that helps you explore consequences, trade-offs, uncertainty, and blind spots before you commit to action.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setView('input')}
                  className="px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-all text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  Analyze a Decision <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-slate-300 font-medium transition-all text-sm flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin text-sky-400" /> : <Layers className="w-4 h-4 text-sky-400" />}
                  Run 90s Hackathon Demo
                </button>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-900 grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              {[
                { label: "1. Decision", desc: "Decompose dilemma" },
                { label: "2. Options", desc: "Generate alternatives" },
                { label: "3. Consequences", desc: "Multi-order chains" },
                { label: "4. Uncertainty", desc: "Assumptions & gaps" },
                { label: "5. Next Step", desc: "Reversible experiment" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-900/40">
                  <div className="font-semibold text-xs text-sky-400 font-mono">{item.label}</div>
                  <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'input' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12 flex-1">
            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white">What decision are you facing?</h2>
              <p className="text-sm text-slate-400">The system decomposes your dilemma to expose structural trade-offs, not dictate an answer.</p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Core Decision *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.decision}
                  onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
                  placeholder="Describe the decision in your own words..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {['Education', 'Career', 'Finance', 'Business', 'Relationships', 'Relocation', 'Health & Lifestyle', 'Technology', 'Other'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Time Horizon</label>
                  <select
                    value={formData.timeHorizon}
                    onChange={(e) => setFormData({ ...formData, timeHorizon: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {['Days', 'Weeks', 'Months', '1-2 Years', '3-5 Years', 'Decade'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Current Situation</label>
                <input
                  type="text"
                  value={formData.currentSituation}
                  onChange={(e) => setFormData({ ...formData, currentSituation: e.target.value })}
                  placeholder="What is your current baseline reality?"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Goals & Objectives</label>
                  <input
                    type="text"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    placeholder="What are you trying to achieve?"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Constraints</label>
                  <input
                    type="text"
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    placeholder="Budget limits, family, deadlines..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Risk Tolerance</label>
                  <select
                    value={formData.riskTolerance}
                    onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Comfortable with uncertainty">Comfortable with uncertainty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Country / Region</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., India, Germany, Global"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">Importance (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.importance}
                    onChange={(e) => setFormData({ ...formData, importance: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Executing 10-Stage Reasoning Pipeline...
                    </>
                  ) : (
                    <>
                      Analyze My Decision <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'dashboard' && analysis && (
          <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8 flex-1">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
                  <Activity className="w-3.5 h-3.5" /> DECISION INTELLIGENCE PROFILE
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{analysis.decision}</h1>
                <p className="text-slate-400 text-sm mt-1 max-w-4xl">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-400 block">COMPLEXITY</span>
                  <span className="text-xs font-semibold text-amber-400">{analysis.metrics?.complexity || 'HIGH'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-400 block">INFO COMPLETENESS</span>
                  <span className="text-xs font-semibold text-sky-400">{analysis.metrics?.informationCompletenessPercent || 60}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-400 block">UNCERTAINTY</span>
                  <span className="text-xs font-semibold text-indigo-400">{analysis.metrics?.uncertaintyLevel || 'MODERATE'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-400 block">RISK EXPOSURE</span>
                  <span className="text-xs font-semibold text-emerald-400">{analysis.metrics?.riskExposure || 'BALANCED'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 col-span-2 md:col-span-1">
                  <span className="text-[10px] font-mono text-slate-400 block">READINESS</span>
                  <span className="text-xs font-semibold text-sky-300">{analysis.metrics?.decisionReadiness || 'READY TO TEST'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'options', label: '1. Options Comparison' },
                { id: 'tree', label: '2. Consequence Tree' },
                { id: 'scenarios', label: '3. Scenarios' },
                { id: 'assumptions', label: '4. Assumptions & Blindspots' },
                { id: 'experiments', label: '5. Experiments & Sensitivity' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'options' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.options?.map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        selectedOptionId === opt.id 
                          ? 'border-sky-500/80 bg-sky-950/20 shadow-lg shadow-sky-500/5' 
                          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white text-sm">{opt.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                          opt.reversibility === 'HIGH' 
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                            : opt.reversibility === 'LOW'
                            ? 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                            : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                        }`}>
                          {opt.reversibility}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{opt.tagline}</p>
                    </div>
                  ))}
                </div>

                {analysis.options?.find(o => o.id === selectedOptionId) && (
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Potential Upside</span>
                        <p className="text-sm text-slate-200 mt-1">{analysis.options.find(o => o.id === selectedOptionId).potentialUpside}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Short-Term Impact</span>
                        <p className="text-xs text-slate-300 mt-1">{analysis.options.find(o => o.id === selectedOptionId).shortTermEffects}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Affected Areas</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {analysis.options.find(o => o.id === selectedOptionId).affectedAreas?.map((area, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 pt-4 md:pt-0">
                      <div>
                        <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">Potential Downside</span>
                        <p className="text-sm text-slate-200 mt-1">{analysis.options.find(o => o.id === selectedOptionId).potentialDownside}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Long-Term Impact</span>
                        <p className="text-xs text-slate-300 mt-1">{analysis.options.find(o => o.id === selectedOptionId).longTermEffects}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Reversibility Assessment</span>
                        <p className="text-xs text-slate-300 mt-1">{analysis.options.find(o => o.id === selectedOptionId).reversibilityReasoning}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tree' && (
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-sky-400" /> Multi-Order Consequence Map
                  </h3>
                  <span className="text-xs text-slate-400">Option: {analysis.options?.find(o => o.id === selectedOptionId)?.title || 'Selected Option'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div> POTENTIAL BENEFIT CHAIN
                    </div>
                    {analysis.consequenceTrees?.[0]?.primaryBenefitsBranch?.map((node, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-emerald-950/60 bg-emerald-950/10 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-emerald-400">Order {node.level} Effect</span>
                          <span className="text-slate-400 font-mono text-[10px]">Confidence: {node.confidence}</span>
                        </div>
                        <p className="text-xs text-slate-200">{node.event}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-mono text-rose-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div> POTENTIAL FRICTION & COST CHAIN
                    </div>
                    {analysis.consequenceTrees?.[0]?.primaryCostsBranch?.map((node, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-rose-950/60 bg-rose-950/10 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-rose-400">Order {node.level} Effect</span>
                          <span className="text-slate-400 font-mono text-[10px]">Confidence: {node.confidence}</span>
                        </div>
                        <p className="text-xs text-slate-200">{node.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scenarios' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl border border-emerald-900/50 bg-emerald-950/10 space-y-4">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Best-Case Trajectory</span>
                  <h4 className="text-sm font-semibold text-white">{analysis.scenarios?.bestCase?.headline}</h4>
                  <p className="text-xs text-slate-300">{analysis.scenarios?.bestCase?.plausibleOutcome}</p>
                  <div className="pt-2 border-t border-emerald-900/40">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">CONDITIONS REQUIRED</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {analysis.scenarios?.bestCase?.conditionsRequired?.map((c, i) => (
                        <li key={i} className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-emerald-400" /> {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-sky-900/50 bg-sky-950/10 space-y-4">
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">Most Likely Trajectory</span>
                  <h4 className="text-sm font-semibold text-white">{analysis.scenarios?.mostLikely?.headline}</h4>
                  <p className="text-xs text-slate-300">{analysis.scenarios?.mostLikely?.likelyTrajectory}</p>
                  <div className="pt-2 border-t border-sky-900/40">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">KEY UNCERTAINTY</span>
                    <p className="text-xs text-sky-300">{analysis.scenarios?.mostLikely?.keyUncertainty}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-rose-900/50 bg-rose-950/10 space-y-4">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">Downside Case</span>
                  <h4 className="text-sm font-semibold text-white">{analysis.scenarios?.downsideCase?.headline}</h4>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block">EARLY WARNING SIGNS</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {analysis.scenarios?.downsideCase?.earlyWarningSigns?.map((w, i) => (
                        <li key={i} className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-rose-400" /> {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assumptions' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" /> What Are We Assuming?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.assumptions?.map((asm) => (
                      <div key={asm.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400">IMPORTANCE: {asm.importance}</span>
                          <span className="text-slate-400">CONFIDENCE: {asm.confidence}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-200">"{asm.statement}"</p>
                        <p className="text-[11px] text-slate-400">{asm.whyItMatters}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-purple-400" /> Potential Cognitive Blind Spots
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                      <span className="text-[10px] font-mono text-purple-400 block mb-2">YOU MAY BE UNDERESTIMATING</span>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        {analysis.potentialBlindSpots?.underestimating?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                      <span className="text-[10px] font-mono text-purple-400 block mb-2">YOU MAY BE OVERESTIMATING</span>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        {analysis.potentialBlindSpots?.overestimating?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experiments' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-sky-900/40 bg-sky-950/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-semibold text-white">What Would Change My Mind? (Sensitivity)</h3>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-mono text-slate-400 block text-[10px]">CURRENT LEAN</span>
                    <span className="font-semibold text-sky-300 mt-0.5 block">{analysis.decisionSensitivity?.currentLean}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Pivoting Triggers</span>
                    {analysis.decisionSensitivity?.whatWouldChangeMyMind?.map((item, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs space-y-1">
                        <div className="text-slate-200"><span className="text-amber-400 font-mono">IF:</span> {item.condition}</div>
                        <div className="text-sky-300"><span className="text-sky-400 font-mono">THEN PIVOT TO:</span> {item.pivotTo}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Low-Cost Decision Experiments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.decisionExperiments?.map((exp, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 block">TEST {i + 1} • {exp.duration}</span>
                        <h4 className="text-xs font-semibold text-white">{exp.title}</h4>
                        <p className="text-xs text-slate-300">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> NEXT BEST ACTION (REVERSIBLE STEP)
                </div>
                <p className="text-sm font-semibold text-white">{analysis.nextBestAction?.action}</p>
                <p className="text-xs text-slate-400">{analysis.nextBestAction?.whyThisFirst}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-[10px] font-mono text-slate-400 block">COMMITMENT</span>
                <span className="text-xs font-semibold text-emerald-400">{analysis.nextBestAction?.timeCommitment}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-400">
        AI should improve human decisions, not replace human judgment. Verify high-stakes legal, medical, or financial matters with certified professionals.
      </footer>
    </div>
  );
}`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log("Wrote cleanly: " + relPath);
}

console.log("\nAll client files generated successfully!");
