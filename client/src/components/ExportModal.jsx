import React, { useState } from 'react';

export default function ExportModal({ analysis, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const generateMarkdown = () => {
    return `# BEFORE YOU ACT — EXECUTIVE DECISION BRIEF
**Tagline:** See the possibilities before you choose.
**Date:** ${new Date().toLocaleDateString()}

---

## 1. PRIMARY DECISION
> "${analysis.decision}"

**Summary:** ${analysis.summary}

### Key Analytical Metrics
- **Decision Complexity:** ${analysis.metrics.complexity}
- **Information Completeness:** ${analysis.metrics.informationCompletenessPercent}%
- **Uncertainty Level:** ${analysis.metrics.uncertaintyLevel}
- **Decision Readiness:** ${analysis.metrics.decisionReadiness}
- **Assessment:** ${analysis.metrics.readinessExplanation}

---

## 2. IDENTIFIED ALTERNATIVE PATHS
${analysis.options.map((opt, i) => `
### Option ${i + 1}: ${opt.title}
- **Description:** ${opt.tagline}
- **Potential Upside:** ${opt.potentialUpside}
- **Potential Downside:** ${opt.potentialDownside}
- **Reversibility:** ${opt.reversibility} (${opt.reversibilityReasoning})
`).join('\n')}

---

## 3. HIDDEN ASSUMPTIONS DETECTED
${analysis.assumptions.map((asm, i) => `
${i + 1}. **"${asm.statement}"**
   - Importance: ${asm.importance} | Confidence: ${asm.confidence}
   - Why it matters: ${asm.whyItMatters}
   - How to validate: ${asm.howToValidate}
`).join('\n')}

---

## 4. WHAT WOULD CHANGE MY MIND?
**Current Analytical Lean:** ${analysis.decisionSensitivity.currentLean}

**Trigger Conditions to Pivot:**
${analysis.decisionSensitivity.whatWouldChangeMyMind.map(chg => `- **If:** ${chg.condition}\n  - **Pivot To:** ${chg.pivotTo} (${chg.rationale})`).join('\n')}

---

## 5. IMMEDIATE REVERSIBLE NEXT ACTION
- **Action:** ${analysis.nextBestAction.action}
- **Time Required:** ${analysis.nextBestAction.timeCommitment}
- **Rationale:** ${analysis.nextBestAction.whyThisFirst}

---
*Disclaimer: ${analysis.disclaimer}*
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Executive Decision Debrief</h3>
            <p className="text-xs text-slate-400">Ready to share with mentors, advisors, or decision stakeholders.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono text-xs">
            Close ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950/60 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/30">
          {generateMarkdown()}
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/50">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all"
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy Markdown Brief'}
          </button>
        </div>
      </div>
    </div>
  );
}