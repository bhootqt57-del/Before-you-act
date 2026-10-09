import React, { useState, useEffect } from 'react';
import DecisionMap from './components/DecisionMap';
import DecisionJournal from './components/DecisionJournal';
import ExportModal from './components/ExportModal';

const API_BASE = 'http://127.0.0.1:5000/api';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'intake' | 'dashboard'
  const [dashboardTab, setDashboardTab] = useState('overview'); // 'overview' | 'map' | 'journal'
  const [showExportModal, setShowExportModal] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  
  // Adversarial & Analyst states
  const [adversarialData, setAdversarialData] = useState(null);
  const [adversarialLoading, setAdversarialLoading] = useState(false);
  const [analystQuestion, setAnalystQuestion] = useState('');
  const [analystChat, setAnalystChat] = useState([]);
  const [analystLoading, setAnalystLoading] = useState(false);

  // Intake Form State
  const [formData, setFormData] = useState({
    decision: '',
    category: 'Career',
    currentSituation: '',
    goals: '',
    constraints: '',
    timeHorizon: '1-3 Years',
    location: '',
    riskTolerance: 'Balanced',
    importance: 8
  });

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.json())
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  const handleLoadDemo = () => {
    setFormData({
      decision: "Should I leave my current university economics program to switch to computer science at another university?",
      category: "Education",
      currentSituation: "Currently in 2nd year of economics; finding coursework dry; passionate about software engineering.",
      goals: "Secure a high-upside career as a software engineer within 3 years.",
      constraints: "Tuition budget is limited; family expects on-time graduation; zero guaranteed credit transfers yet.",
      timeHorizon: "2-4 Years",
      location: "International",
      riskTolerance: "Balanced",
      importance: 9
    });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.decision.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/decision/analyze`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.data);
        if (data.data.options?.length > 0) {
          setSelectedOptionId(data.data.options[0].id);
        }
        setView('dashboard');
        setDashboardTab('overview');
      } else {
        alert(data.error || 'Failed to analyze decision');
      }
    } catch (err) {
      alert('Cannot connect to backend server at http://localhost:5000. Ensure npm run dev is running in backend terminal.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAdversarial = async () => {
    if (!analysis) return;
    setAdversarialLoading(true);
    try {
      const preferred = analysis.options.find(o => o.id === selectedOptionId)?.title || "Preferred Option";
      const res = await fetch(`${API_BASE}/decision/challenge`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ analysisData: analysis, preferredOptionTitle: preferred })
      });
      const data = await res.json();
      if (data.success) setAdversarialData(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAdversarialLoading(false);
    }
  };

  const handleAskAnalyst = async (e) => {
    e.preventDefault();
    if (!analystQuestion.trim() || !analysis) return;
    const q = analystQuestion;
    setAnalystQuestion('');
    setAnalystChat(prev => [...prev, { sender: 'user', text: q }]);
    setAnalystLoading(true);

    try {
      const res = await fetch(`${API_BASE}/decision/analyst`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ analysisData: analysis, question: q })
      });
      const data = await res.json();
      if (data.success) {
        setAnalystChat(prev => [...prev, { 
          sender: 'analyst', 
          text: data.data.analystAnswer,
          step: data.data.recommendedInspectionStep 
        }]);
      }
    } catch (err) {
      setAnalystChat(prev => [...prev, { sender: 'analyst', text: 'Error connecting to Decision Analyst.' }]);
    } finally {
      setAnalystLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-amber-400/30">
      
      {/* INJECT CURSIVE GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Great+Vibes&display=swap');
        .font-cursive {
          font-family: 'Dancing Script', 'Great Vibes', cursive;
        }
      `}</style>

      {/* TOP NAVIGATION BAR — 100% TRANSPARENT ON INTAKE & LANDING */}
      <header className={`h-16 transition-all ${
        view === 'landing' || view === 'intake'
          ? 'absolute top-0 inset-x-0 z-40 bg-transparent border-b border-transparent'
          : 'sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LEFT: BACK ARROW ON INTAKE / LOGO ON DASHBOARD */}
          <div>
            {view === 'intake' ? (
              <button
                onClick={() => setView('landing')}
                className="flex items-center space-x-2.5 text-white bg-black/25 hover:bg-black/45 border border-white/35 px-4 py-2 rounded-xl backdrop-blur-md transition-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-sm font-bold hover:scale-105 active:scale-95"
              >
                <span className="text-xl font-bold leading-none">←</span>
                <span>Back</span>
              </button>
            ) : view === 'dashboard' ? (
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('landing')}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/25 border border-white/30 flex items-center justify-center text-emerald-300 font-mono font-bold text-sm shadow-md backdrop-blur-sm">
                  ▲
                </div>
                <span className="font-bold tracking-tight text-white text-base drop-shadow-sm">
                  BEFORE YOU ACT
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-mono px-2 py-0.5 rounded bg-black/40 text-slate-250 border border-white/15 backdrop-blur-sm">
                  AI DECISION INTELLIGENCE
                </span>
              </div>
            ) : null}
          </div>

          {/* RIGHT: ENGINE STATUS / EXPORT / ACTION BUTTONS */}
          <div className="flex items-center space-x-4">
            {view !== 'landing' && (
              <div className="flex items-center space-x-2 text-xs font-mono bg-black/30 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-md">
                <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                <span className="text-white hidden md:inline font-bold drop-shadow-sm">
                  {apiOnline ? 'ENGINE READY' : 'API OFFLINE'}
                </span>
              </div>
            )}

            {view === 'dashboard' && (
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-black/45 hover:bg-black/60 border border-white/20 text-white font-bold px-3.5 py-2 rounded-xl text-xs font-mono transition-all hover:scale-105 active:scale-95 shadow-md backdrop-blur-sm"
              >
                Export Brief
              </button>
            )}

            {view === 'landing' && (
              <button
                onClick={() => setView('intake')}
                className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300 hover:brightness-105 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 border border-white/40"
              >
                Analyze a Decision
              </button>
            )}
          </div>
        </div>
      </header>

      {/* VIEW 1: LANDING PAGE */}
      {view === 'landing' && (
        <div className="relative flex-1 min-h-screen flex flex-col items-center justify-between w-full overflow-hidden pt-16 pb-8">
          
          {/* Background Image Layer — download (7).jpg */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('/download%20(7).jpg')` }}
          />

          {/* Foreground Content */}
          <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-between w-full">
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 my-auto pt-8">
              
              {/* Left Column: Cursive Display Headline */}
              <div className="text-left max-w-2xl lg:max-w-3xl">
                <h1 className="font-cursive text-6xl sm:text-7xl lg:text-8xl tracking-wide text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] leading-[1.15]">
                  See the possibilities <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-100 to-sky-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                    before you choose.
                  </span>
                </h1>

                <p className="mt-6 text-white text-base sm:text-xl font-medium max-w-xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  An AI decision-intelligence system that exposes consequences, trade-offs, uncertainty, and hidden assumptions before you take action.
                </p>
              </div>

              {/* Right Column: Stacked Action Buttons */}
              <div className="flex flex-col gap-5 items-center lg:items-end w-full lg:w-auto shrink-0">
                <button
                  onClick={() => setView('intake')}
                  className="w-72 sm:w-80 bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300 hover:brightness-110 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base transition-all shadow-[0_8px_30px_rgba(0,0,0,0.45)] flex items-center justify-center space-x-2 border border-white/60 hover:scale-105 active:scale-95"
                >
                  <span className="tracking-wide">Analyze a Decision</span>
                  <span className="text-lg">→</span>
                </button>

                <button
                  onClick={() => {
                    handleLoadDemo();
                    setView('intake');
                  }}
                  className="w-72 sm:w-80 bg-white/25 hover:bg-white/40 border border-white/60 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                >
                  Load Demo Scenario
                </button>
              </div>

            </div>

            {/* Decision Intelligence Cycle */}
            <div className="w-full mt-10 p-5 sm:p-6 rounded-2xl bg-black/20 border border-white/25 backdrop-blur-[3px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <p className="text-xs font-mono uppercase tracking-widest text-amber-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] mb-4 font-bold">
                The Decision Intelligence Cycle
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/25 shadow-md">
                  <span className="text-emerald-300 font-bold block mb-1 drop-shadow-md">01. INTAKE</span>
                  <span className="text-white drop-shadow-sm font-medium">Deconstruct dilemma & goals</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/25 shadow-md">
                  <span className="text-sky-300 font-bold block mb-1 drop-shadow-md">02. OPTIONS</span>
                  <span className="text-white drop-shadow-sm font-medium">Generate viable alternatives</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/25 shadow-md">
                  <span className="text-teal-200 font-bold block mb-1 drop-shadow-md">03. BLIND SPOTS</span>
                  <span className="text-white drop-shadow-sm font-medium">Expose hidden assumptions</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/25 shadow-md">
                  <span className="text-amber-200 font-bold block mb-1 drop-shadow-md">04. SCENARIOS</span>
                  <span className="text-white drop-shadow-sm font-medium">Simulate best, likely & downside</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/25 shadow-md col-span-2 sm:col-span-1">
                  <span className="text-amber-300 font-bold block mb-1 drop-shadow-md">05. EXPERIMENT</span>
                  <span className="text-white drop-shadow-sm font-medium">Test reversibly before acting</span>
                </div>
              </div>
            </div>

          </main>
        </div>
      )}

      {/* VIEW 2: DECISION INTAKE WORKSPACE */}
      {view === 'intake' && (
        <div className="relative flex-1 min-h-screen flex flex-col items-center justify-start w-full overflow-hidden pt-20 pb-12">
          
          {/* Background: download (9).jpg — 100% Bright, No Dark Film */}
          <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('/download%20(9).jpg')` }}
          />

          {/* Frosted Transparent Workspace Card */}
          <main className="relative z-10 max-w-3xl mx-auto px-6 py-6 w-full">
            <div className="p-8 sm:p-10 rounded-3xl bg-black/20 backdrop-blur-md border border-white/35 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-white/20">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    What decision are you facing?
                  </h2>
                  <p className="text-white/95 text-sm mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] font-medium">
                    Provide context to enable calibrated scenario decomposition.
                  </p>
                </div>
                <button
                  onClick={handleLoadDemo}
                  className="self-start sm:self-auto text-xs font-mono font-bold text-amber-200 bg-black/30 hover:bg-black/50 border border-amber-200/50 px-3.5 py-2 rounded-xl transition-all backdrop-blur-md shadow-md hover:scale-105 active:scale-95"
                >
                  Auto-Fill Hackathon Demo
                </button>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    The Core Decision <span className="text-white">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.decision}
                    onChange={e => setFormData({ ...formData, decision: e.target.value })}
                    placeholder="e.g. Should I switch programs, relocate to a new city, launch this product, or leave my current job?"
                    className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none transition-all backdrop-blur-md shadow-inner drop-shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none backdrop-blur-md shadow-inner"
                    >
                      {['Education', 'Career', 'Finance', 'Business', 'Relationships', 'Relocation', 'Health & Lifestyle', 'Technology', 'Other'].map(c => (
                        <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Time Horizon
                    </label>
                    <select
                      value={formData.timeHorizon}
                      onChange={e => setFormData({ ...formData, timeHorizon: e.target.value })}
                      className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none backdrop-blur-md shadow-inner"
                    >
                      {['Immediate (Days)', 'Short-term (Weeks)', 'Medium-term (Months)', '1-3 Years', 'Long-term (5+ Years)'].map(t => (
                        <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Current Situation
                    </label>
                    <input
                      type="text"
                      value={formData.currentSituation}
                      onChange={e => setFormData({ ...formData, currentSituation: e.target.value })}
                      placeholder="Where do things stand right now?"
                      className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none backdrop-blur-md shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Primary Goal
                    </label>
                    <input
                      type="text"
                      value={formData.goals}
                      onChange={e => setFormData({ ...formData, goals: e.target.value })}
                      placeholder="What is the #1 outcome desired?"
                      className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none backdrop-blur-md shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    Constraints & Limitations
                  </label>
                  <input
                    type="text"
                    value={formData.constraints}
                    onChange={e => setFormData({ ...formData, constraints: e.target.value })}
                    placeholder="Financial limits, family obligations, time barriers, legal factors..."
                    className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none backdrop-blur-md shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Risk Tolerance
                    </label>
                    <select
                      value={formData.riskTolerance}
                      onChange={e => setFormData({ ...formData, riskTolerance: e.target.value })}
                      className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none backdrop-blur-md shadow-inner"
                    >
                      <option value="Conservative" className="bg-slate-900 text-white">Conservative (Preserve Capital & Stability)</option>
                      <option value="Balanced" className="bg-slate-900 text-white">Balanced (Calculated Asymmetric Risk)</option>
                      <option value="Comfortable with uncertainty" className="bg-slate-900 text-white">Comfortable with Uncertainty (High Upside)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-200 mb-2 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Importance (1 to 10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.importance}
                      onChange={e => setFormData({ ...formData, importance: parseInt(e.target.value) || 5 })}
                      className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/30 focus:border-amber-200 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none backdrop-blur-md shadow-inner"
                    />
                  </div>
                </div>

                {/* BLUE HIGHLIGHT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-amber-200 via-amber-300 to-sky-200 hover:brightness-110 disabled:opacity-50 text-slate-900 font-extrabold py-4 rounded-2xl text-sm uppercase tracking-wider transition-all shadow-[0_10px_30px_rgba(251,191,36,0.4)] flex items-center justify-center space-x-2 border border-white/70 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Decomposing Decision Space...</span>
                    </>
                  ) : (
                    <span>Run Decision Analysis Pipeline →</span>
                  )}
                </button>
              </form>

            </div>
          </main>
        </div>
      )}

      {/* VIEW 3: RESULTS DASHBOARD (WITH 100% FIXED CLOUD BACKGROUND) */}
      {view === 'dashboard' && analysis && (
        <div className="relative flex-1 min-h-screen flex flex-col w-full overflow-hidden">
          
          {/* Background: dashboard-bg.png (Clouds & Sky) */}
          <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('/dashboard-bg.png')` }}
          />

          {/* Slight frosted overlay for text/box contrast */}
          <div className="absolute inset-0 bg-slate-950/15 backdrop-blur-[1px] pointer-events-none"></div>

          {/* Foreground Dashboard Workspace */}
          <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-8 overflow-y-auto">
            
            {/* TAB BAR — FROSTED CARD STYLE */}
            <div className="flex bg-black/35 backdrop-blur-md border border-white/10 px-6 py-2 rounded-2xl space-x-8 text-sm font-mono shadow-[0_4px_24px_rgba(0,0,0,0.15)] max-w-max mx-auto">
              <button
                onClick={() => setDashboardTab('overview')}
                className={`pb-2.5 pt-2.5 border-b-2 transition-all drop-shadow-sm ${
                  dashboardTab === 'overview'
                    ? 'border-amber-300 text-amber-300 font-bold'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                01. Decision Intelligence Matrix
              </button>
              <button
                onClick={() => setDashboardTab('map')}
                className={`pb-2.5 pt-2.5 border-b-2 transition-all drop-shadow-sm ${
                  dashboardTab === 'map'
                    ? 'border-amber-300 text-amber-300 font-bold'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                02. Visual Decision Canvas
              </button>
              <button
                onClick={() => setDashboardTab('journal')}
                className={`pb-2.5 pt-2.5 border-b-2 transition-all drop-shadow-sm ${
                  dashboardTab === 'journal'
                    ? 'border-amber-300 text-amber-300 font-bold'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                03. Decision Journal & Learning Loop
              </button>
            </div>

            {/* TAB CONTENT: RADIAL DECISION MAP */}
            {dashboardTab === 'map' && (
              <div className="p-6 bg-black/45 backdrop-blur-lg border border-white/15 rounded-3xl shadow-xl">
                <DecisionMap analysis={analysis} />
              </div>
            )}

            {/* TAB CONTENT: DECISION JOURNAL */}
            {dashboardTab === 'journal' && (
              <div className="p-6 bg-black/45 backdrop-blur-lg border border-white/15 rounded-3xl shadow-xl">
                <DecisionJournal
                  currentAnalysis={analysis}
                  onLoadEntry={(loaded) => {
                    setAnalysis(loaded);
                    setDashboardTab('overview');
                  }}
                />
              </div>
            )}

            {/* TAB CONTENT: MAIN DECISION MATRIX OVERVIEW */}
            {dashboardTab === 'overview' && (
              <>
                {/* TOP SUMMARY & GAUGES */}
                <section className="bg-black/55 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-mono text-amber-200 uppercase tracking-widest mb-1 font-bold">
                        <span>DECISION UNDER ANALYSIS</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-snug drop-shadow-sm">{analysis.decision}</h2>
                      <p className="text-white/85 text-sm mt-2 max-w-3xl drop-shadow-sm leading-relaxed">{analysis.summary}</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => setView('intake')}
                        className="text-xs font-mono font-bold bg-white/15 hover:bg-white/25 border border-white/25 px-4 py-2.5 rounded-xl text-white transition-all backdrop-blur-sm hover:scale-105"
                      >
                        Modify Parameters
                      </button>
                      <button
                        onClick={handleRunAdversarial}
                        disabled={adversarialLoading}
                        className="text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all hover:scale-105 disabled:opacity-50"
                      >
                        <span>{adversarialLoading ? 'Simulating Opponent...' : '⚔ Challenge My Choice'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-black/35 border border-white/10 shadow-inner">
                      <span className="text-amber-200/80 text-xs font-mono uppercase block mb-1 font-bold">Complexity</span>
                      <span className="text-xl font-black font-mono text-white drop-shadow-md">{analysis.metrics.complexity}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/35 border border-white/10 shadow-inner">
                      <span className="text-amber-200/80 text-xs font-mono uppercase block mb-1 font-bold">Info Completeness</span>
                      <span className="text-xl font-black font-mono text-white drop-shadow-md">{analysis.metrics.informationCompletenessPercent}%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/35 border border-white/10 shadow-inner">
                      <span className="text-amber-200/80 text-xs font-mono uppercase block mb-1 font-bold">Uncertainty</span>
                      <span className="text-xl font-black font-mono text-white drop-shadow-md">{analysis.metrics.uncertaintyLevel}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/35 border border-white/10 shadow-inner">
                      <span className="text-amber-200/80 text-xs font-mono uppercase block mb-1 font-bold">Decision Readiness</span>
                      <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-black/45 text-amber-200 border border-amber-200/30 inline-block mt-1">
                        {analysis.metrics.decisionReadiness}
                      </span>
                    </div>
                  </div>
                </section>

                {/* ADVERSARIAL MODE DRAWER */}
                {adversarialData && (
                  <section className="bg-rose-950/45 backdrop-blur-xl border border-rose-500/40 rounded-3xl p-6 sm:p-8 animate-fadeIn shadow-[0_12px_40px_rgba(153,27,27,0.2)]">
                    <div className="flex items-center justify-between mb-4 border-b border-rose-500/20 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
                        <h3 className="text-rose-200 font-bold text-sm tracking-wide uppercase font-mono">
                          ADVERSARIAL STRESS TEST: {adversarialData.challengedOption}
                        </h3>
                      </div>
                      <button onClick={() => setAdversarialData(null)} className="text-xs font-mono text-rose-300/80 hover:text-white">
                        ✕ Close Adversarial View
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm">
                      <div className="p-4.5 rounded-2xl bg-black/45 border border-rose-500/20">
                        <span className="text-rose-300 font-bold block mb-1">Steelman Counterargument:</span>
                        <p className="text-white/90 leading-relaxed">{adversarialData.steelmanCounterArgument}</p>
                      </div>
                      <div className="p-4.5 rounded-2xl bg-black/45 border border-rose-500/20">
                        <span className="text-rose-300 font-bold block mb-1">Overlooked Risk:</span>
                        <p className="text-white/90 leading-relaxed">{adversarialData.overlookedRisk}</p>
                      </div>
                      <div className="p-4.5 rounded-2xl bg-black/45 border border-rose-500/20 md:col-span-2">
                        <span className="text-rose-300 font-bold block mb-1">Pre-Mortem Failure Narrative (18-Month Outlook):</span>
                        <p className="text-white/90 leading-relaxed">{adversarialData.preMortemNarrative}</p>
                      </div>
                    </div>
                  </section>
                )}

                {/* OPTION COMPARISON */}
                <section className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white drop-shadow-sm">Generated Alternative Paths</h3>
                    <p className="text-white/80 text-xs font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                      Examine trade-offs, reversibility, and short vs. long term impact across options.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {analysis.options.map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`cursor-pointer rounded-3xl p-6.5 transition-all border ${
                          selectedOptionId === opt.id 
                            ? 'bg-black/55 border-amber-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)] scale-[1.02]' 
                            : 'bg-black/35 border-white/10 hover:border-white/25 hover:bg-black/45'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3.5">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/45 text-amber-200 border border-amber-200/30">
                            {opt.id}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                            opt.reversibility === 'HIGH' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' :
                            opt.reversibility === 'MEDIUM' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' :
                            'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          }`}>
                            Reversibility: {opt.reversibility}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-white mb-1 drop-shadow-sm">{opt.title}</h4>
                        <p className="text-xs text-amber-200/95 mb-4 font-semibold leading-relaxed">{opt.tagline}</p>

                        <div className="space-y-3.5 text-xs border-t border-white/10 pt-4">
                          <div>
                            <span className="text-emerald-300 font-bold block">Potential Upside:</span>
                            <span className="text-white/85 leading-relaxed">{opt.potentialUpside}</span>
                          </div>
                          <div>
                            <span className="text-rose-300 font-bold block">Potential Downside:</span>
                            <span className="text-white/85 leading-relaxed">{opt.potentialDownside}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CONSEQUENCE MAP */}
                <section className="bg-black/55 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                  <div className="mb-6">
                    <span className="text-xs font-mono uppercase text-amber-200 font-bold block">Consequence Tree</span>
                    <h3 className="text-lg font-black text-white drop-shadow-sm">Causal Cascades & Second-Order Effects</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-emerald-300 uppercase font-extrabold tracking-wider">▲ Benefit Propagation</span>
                      <div className="space-y-2">
                        {analysis.consequenceTrees?.[0]?.primaryBenefitsBranch.map((node, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-black/35 border border-white/10 flex items-start space-x-3 text-xs shadow-inner">
                            <span className="font-mono text-emerald-300 font-extrabold">L{node.level}</span>
                            <div className="flex-1">
                              <span className="text-white block font-semibold leading-relaxed">{node.event}</span>
                              <span className="text-white/60 text-[10px] block mt-0.5 font-medium">Confidence: {node.confidence}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-mono text-rose-300 uppercase font-extrabold tracking-wider">▼ Friction Propagation</span>
                      <div className="space-y-2">
                        {analysis.consequenceTrees?.[0]?.primaryCostsBranch.map((node, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-black/35 border border-white/10 flex items-start space-x-3 text-xs shadow-inner">
                            <span className="font-mono text-rose-300 font-extrabold">L{node.level}</span>
                            <div className="flex-1">
                              <span className="text-white block font-semibold leading-relaxed">{node.event}</span>
                              <span className="text-white/60 text-[10px] block mt-0.5 font-medium">Confidence: {node.confidence}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* SCENARIOS */}
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white drop-shadow-sm">Scenario Simulator</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/45 backdrop-blur-lg border border-white/15 rounded-3xl p-6 shadow-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-xs font-mono text-emerald-300 font-extrabold uppercase">Best Case</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white mb-2 leading-snug">{analysis.scenarios.bestCase.headline}</h4>
                      <p className="text-xs text-white/85 mb-4 leading-relaxed">{analysis.scenarios.bestCase.plausibleOutcome}</p>
                      <div className="text-[11px] text-white/70 border-t border-white/10 pt-3">
                        <span className="font-extrabold block text-amber-200 mb-1">Required Conditions:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {analysis.scenarios.bestCase.conditionsRequired.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-black/45 backdrop-blur-lg border border-white/15 rounded-3xl p-6 shadow-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                        <span className="text-xs font-mono text-sky-300 font-extrabold uppercase">Most Likely</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white mb-2 leading-snug">{analysis.scenarios.mostLikely.headline}</h4>
                      <p className="text-xs text-white/85 mb-4 leading-relaxed">{analysis.scenarios.mostLikely.likelyTrajectory}</p>
                      <div className="text-[11px] text-white/70 border-t border-white/10 pt-3">
                        <span className="font-extrabold block text-amber-200 mb-1">Key Uncertainty:</span>
                        <span>{analysis.scenarios.mostLikely.keyUncertainty}</span>
                      </div>
                    </div>

                    <div className="bg-black/45 backdrop-blur-lg border border-white/15 rounded-3xl p-6 shadow-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                        <span className="text-xs font-mono text-rose-300 font-extrabold uppercase">Downside Case</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white mb-2 leading-snug">{analysis.scenarios.downsideCase.headline}</h4>
                      <div className="text-[11px] text-white/70 space-y-3.5 border-t border-white/10 pt-3">
                        <div>
                          <span className="font-extrabold block text-rose-300">Early Warning Signs:</span>
                          <ul className="list-disc list-inside">
                            {analysis.scenarios.downsideCase.earlyWarningSigns.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="font-extrabold block text-white/90">Mitigation:</span>
                          <ul className="list-disc list-inside">
                            {analysis.scenarios.downsideCase.mitigationStrategies.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ASSUMPTIONS & SENSITIVITY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-black/55 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                    <span className="text-xs font-mono uppercase text-amber-200 font-bold block mb-1">Assumption Detector</span>
                    <h3 className="text-base font-extrabold text-white mb-4">Hidden Assumptions Detected</h3>
                    <div className="space-y-3">
                      {analysis.assumptions.map(asm => (
                        <div key={asm.id} className="p-4 rounded-2xl bg-black/35 border border-white/10 text-xs space-y-2.5 shadow-inner">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-extrabold text-white">"{asm.statement}"</span>
                            <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-black/45 text-amber-200 border border-amber-200/30 shrink-0">
                              {asm.importance} IMPORTANCE
                            </span>
                          </div>
                          <p className="text-white/80 leading-relaxed">{asm.whyItMatters}</p>
                          <div className="text-emerald-300 font-mono font-bold">
                            Validation: {asm.howToValidate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-black/55 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                    <span className="text-xs font-mono uppercase text-sky-200 font-bold block mb-1">Decision Sensitivity</span>
                    <h3 className="text-base font-extrabold text-white mb-4">"What Would Change My Mind?"</h3>
                    <div className="p-4 rounded-2xl bg-amber-200/10 border border-amber-200/30 mb-4 text-xs">
                      <span className="text-amber-200 font-extrabold block mb-0.5">Current Analytical Lean:</span>
                      <span className="text-white font-medium">{analysis.decisionSensitivity.currentLean}</span>
                    </div>
                    <div className="space-y-3">
                      {analysis.decisionSensitivity.whatWouldChangeMyMind.map((chg, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-black/35 border border-white/10 text-xs shadow-inner">
                          <span className="text-amber-200 font-bold block mb-0.5">If this happens:</span>
                          <span className="text-white font-medium block mb-1">"{chg.condition}"</span>
                          <div className="text-emerald-300 font-mono font-bold">
                            → Pivot Recommendation: {chg.pivotTo}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* NEXT BEST ACTION */}
                <section className="bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/35 rounded-3xl p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.3)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                    <div>
                      <span className="text-xs font-mono uppercase text-emerald-300 font-extrabold tracking-wider">
                        HIGH-LEVERAGE REVERSIBLE ACTION
                      </span>
                      <h3 className="text-xl font-black text-white mt-1 leading-snug drop-shadow-sm">
                        {analysis.nextBestAction.action}
                      </h3>
                      <p className="text-white/85 text-xs mt-2 max-w-2xl drop-shadow-sm leading-relaxed font-medium">
                        {analysis.nextBestAction.whyThisFirst}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-mono shrink-0">
                      <span className="px-3.5 py-2 rounded-xl bg-black/45 border border-white/10 text-white font-bold shadow-md">
                        Time: {analysis.nextBestAction.timeCommitment}
                      </span>
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black shadow-md">
                        Reversible: YES
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {analysis.decisionExperiments.map((exp, i) => (
                      <div key={i} className="p-4.5 rounded-2xl bg-black/35 border border-white/10 text-xs space-y-1.5 shadow-inner">
                        <span className="font-extrabold text-white block leading-snug">{exp.title}</span>
                        <span className="text-white/75 text-[11px] block leading-relaxed">{exp.description}</span>
                        <div className="pt-2 border-t border-white/5 flex justify-between text-[10px] font-mono font-bold text-emerald-300">
                          <span>Duration: {exp.duration}</span>
                          <span>Cost: {exp.estimatedCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CONTEXTUAL DECISION ANALYST */}
                <section className="bg-black/55 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center space-x-3.5 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-amber-300/20 border border-amber-300/30 flex items-center justify-center text-amber-200 font-mono text-base font-black shadow-md">
                      ◉
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white leading-tight">Decision Analyst Assistant</h3>
                      <p className="text-white/70 text-xs mt-0.5 font-medium">Ask specific questions grounded entirely in this decision's context.</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2">
                    {analystChat.map((msg, i) => (
                      <div key={i} className={`p-4 rounded-2xl text-xs max-w-2xl ${
                        msg.sender === 'user' 
                          ? 'ml-auto bg-amber-300/20 border border-amber-300/40 text-white font-medium' 
                          : 'bg-black/45 border border-white/10 text-white/90'
                      } shadow-md`}>
                        <span className="font-mono text-[9px] font-bold block opacity-70 uppercase mb-1">
                          {msg.sender === 'user' ? 'You' : 'Decision Analyst'}
                        </span>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAskAnalyst} className="flex gap-2 border-t border-white/10 pt-4">
                    <input
                      type="text"
                      value={analystQuestion}
                      onChange={e => setAnalystQuestion(e.target.value)}
                      placeholder="e.g. What is the single biggest risk if I switch? What evidence should I gather first?"
                      className="flex-1 bg-black/35 hover:bg-black/45 focus:bg-black/50 border border-white/20 focus:border-amber-200 rounded-2xl px-4.5 py-3 text-xs text-white placeholder-white/55 focus:outline-none transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={analystLoading}
                      className="bg-gradient-to-r from-amber-200 to-amber-300 hover:brightness-105 text-slate-900 font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md hover:scale-105"
                    >
                      {analystLoading ? 'Evaluating...' : 'Inspect'}
                    </button>
                  </form>
                </section>

                <footer className="text-center text-white/60 text-[10px] max-w-3xl mx-auto pt-6 pb-12 font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-semibold">
                  {analysis.disclaimer}
                </footer>
              </>
            )}

          </main>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && (
        <ExportModal
          analysis={analysis}
          onClose={() => setShowExportModal(false)}
        />
      )}

    </div>
  );
}