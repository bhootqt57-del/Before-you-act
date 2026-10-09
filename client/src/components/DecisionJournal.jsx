import React, { useState, useEffect } from 'react';

const JOURNAL_KEY = 'bya_decision_journal_entries';

export default function DecisionJournal({ currentAnalysis, onLoadEntry }) {
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'record'
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  // Reflection fields
  const [chosenOption, setChosenOption] = useState('');
  const [actualOutcome, setActualOutcome] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(JOURNAL_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch (e) {
      console.error('Failed reading decision journal:', e);
    }
  }, []);

  const saveCurrentAnalysis = () => {
    if (!currentAnalysis) return;
    const newEntry = {
      id: 'dec_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      decision: currentAnalysis.decision,
      summary: currentAnalysis.summary,
      metrics: currentAnalysis.metrics,
      options: currentAnalysis.options,
      fullAnalysis: currentAnalysis,
      status: 'In Progress', // 'In Progress' | 'Reviewed'
      chosenOption: currentAnalysis.options?.[0]?.title || '',
      actualOutcome: '',
      lessonsLearned: ''
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
    alert('Decision saved to your local Decision Journal!');
  };

  const handleUpdateOutcome = (e) => {
    e.preventDefault();
    if (!selectedEntry) return;

    const updated = entries.map(item => {
      if (item.id === selectedEntry.id) {
        return {
          ...item,
          status: 'Reviewed',
          chosenOption,
          actualOutcome,
          lessonsLearned,
          reviewedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        };
      }
      return item;
    });

    setEntries(updated);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
    setSelectedEntry(null);
    setActiveTab('list');
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 block tracking-wider">
            Continuous Learning Loop
          </span>
          <h3 className="text-lg font-bold text-white">Decision Journal</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare expected projections with actual outcomes over time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {currentAnalysis && (
            <button
              onClick={saveCurrentAnalysis}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider transition-all"
            >
              + Save Current Analysis
            </button>
          )}
        </div>
      </div>

      {/* Review Modal Form */}
      {selectedEntry && (
        <div className="mb-6 p-6 rounded-xl bg-slate-900 border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-emerald-400">
              Log Retrospective: "{selectedEntry.decision}"
            </h4>
            <button onClick={() => setSelectedEntry(null)} className="text-xs text-slate-400 hover:text-white">
              Cancel ✕
            </button>
          </div>

          <form onSubmit={handleUpdateOutcome} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Which option did you choose?
              </label>
              <input
                type="text"
                required
                value={chosenOption}
                onChange={e => setChosenOption(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                What actually happened? (Reality vs. Projection)
              </label>
              <textarea
                rows={3}
                required
                value={actualOutcome}
                onChange={e => setActualOutcome(e.target.value)}
                placeholder="What occurred in reality? Did downside risks materialize or were benefits attained?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Key Blind Spots / Lessons Learned
              </label>
              <textarea
                rows={2}
                value={lessonsLearned}
                onChange={e => setLessonsLearned(e.target.value)}
                placeholder="What assumption was incorrect? What would you do differently next time?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs uppercase"
            >
              Complete Retrospective Log
            </button>
          </form>
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs font-mono">
          No saved decisions in your local journal yet. Analyze a dilemma and click "Save Current Analysis".
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.date}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.status === 'Reviewed' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-200">{item.decision}</h5>
                {item.status === 'Reviewed' && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    <span className="text-emerald-400 font-semibold">Outcome:</span> {item.actualOutcome}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onLoadEntry(item.fullAnalysis)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Load Map
                </button>
                <button
                  onClick={() => {
                    setSelectedEntry(item);
                    setChosenOption(item.chosenOption || '');
                    setActualOutcome(item.actualOutcome || '');
                    setLessonsLearned(item.lessonsLearned || '');
                  }}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                >
                  {item.status === 'Reviewed' ? 'Edit Outcome' : 'Log Outcome'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}