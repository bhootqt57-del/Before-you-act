import React, { useState } from 'react';

export default function DecisionMap({ analysis }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!analysis) return null;

  // Center coordinates for 800x600 SVG canvas
  const cx = 400;
  const cy = 300;
  const radius = 210;

  // Construct orbital satellite nodes
  const nodes = [
    {
      id: 'opt_main',
      type: 'OPTIONS',
      label: `${analysis.options?.length || 3} Alternatives`,
      color: '#10b981', // emerald
      angle: 0,
      details: analysis.options?.map(o => `• ${o.title}: ${o.tagline}`).join('\n')
    },
    {
      id: 'assump_node',
      type: 'ASSUMPTIONS',
      label: `${analysis.assumptions?.length || 2} Assumptions`,
      color: '#f59e0b', // amber
      angle: 60,
      details: analysis.assumptions?.map(a => `• "${a.statement}" (${a.importance} priority)`).join('\n')
    },
    {
      id: 'risks_node',
      type: 'DOWNSIDE',
      label: 'Risks & Failure Modes',
      color: '#f43f5e', // rose
      angle: 120,
      details: analysis.scenarios?.downsideCase?.failureModes?.map(f => `• ${f}`).join('\n')
    },
    {
      id: 'second_order',
      type: 'CASCADES',
      label: '2nd-Order Effects',
      color: '#a855f7', // purple
      angle: 180,
      details: analysis.secondOrderEffects?.map(s => `• ${s.firstOrder} → ${s.secondOrder}`).join('\n')
    },
    {
      id: 'uncertainty_node',
      type: 'MISSING INFO',
      label: `${analysis.missingInformation?.length || 1} Unknowns`,
      color: '#06b6d4', // cyan
      angle: 240,
      details: analysis.missingInformation?.map(m => `• ${m.item} (Impact: ${m.impactOnDecision})`).join('\n')
    },
    {
      id: 'experiments_node',
      type: 'EXPERIMENTS',
      label: 'Reversible Tests',
      color: '#3b82f6', // blue
      angle: 300,
      details: analysis.decisionExperiments?.map(e => `• ${e.title} (${e.duration})`).join('\n')
    }
  ];

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 block tracking-wider">
            Signature Topology Map
          </span>
          <h3 className="text-lg font-bold text-white">Radial Decision Space</h3>
          <p className="text-xs text-slate-400">Click any surrounding node to inspect its relational weight.</p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Center: Primary Decision
        </div>
      </div>

      <div className="relative flex justify-center items-center py-4">
        <svg viewBox="0 0 800 600" className="w-full max-w-3xl h-auto select-none">
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Radial orbit guide ring */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx={cx} cy={cy} r={radius + 40} fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />

          {/* Connection vectors */}
          {nodes.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const nx = cx + radius * Math.cos(rad);
            const ny = cy + radius * Math.sin(rad);
            const isSelected = activeNode?.id === node.id;

            return (
              <g key={node.id}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={nx}
                  y2={ny}
                  stroke={isSelected ? node.color : '#334155'}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeDasharray={isSelected ? 'none' : '4 4'}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Center Hub: The Decision */}
          <circle cx={cx} cy={cy} r="85" fill="url(#centerGlow)" />
          <circle cx={cx} cy={cy} r="65" fill="#090d16" stroke="#10b981" strokeWidth="2" />
          <foreignObject x={cx - 55} y={cy - 45} width="110" height="90">
            <div className="h-full flex flex-col items-center justify-center text-center px-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                THE DECISION
              </span>
              <p className="text-[10px] text-slate-200 font-semibold line-clamp-3 leading-tight mt-1">
                {analysis.decision}
              </p>
            </div>
          </foreignObject>

          {/* Orbital Satellite Nodes */}
          {nodes.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const nx = cx + radius * Math.cos(rad);
            const ny = cy + radius * Math.sin(rad);
            const isSelected = activeNode?.id === node.id;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setActiveNode(node)}
              >
                <circle
                  cx={nx}
                  cy={ny}
                  r="42"
                  fill="#0b1120"
                  stroke={node.color}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <circle
                  cx={nx}
                  cy={ny}
                  r="48"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1"
                  opacity={isSelected ? 0.6 : 0}
                  className="transition-opacity"
                />
                <foreignObject x={nx - 38} y={ny - 30} width="76" height="60">
                  <div className="h-full flex flex-col items-center justify-center text-center px-1">
                    <span className="text-[8px] font-mono tracking-wider uppercase font-bold" style={{ color: node.color }}>
                      {node.type}
                    </span>
                    <span className="text-[10px] text-slate-200 font-bold leading-tight line-clamp-2 mt-0.5">
                      {node.label}
                    </span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Inspector Drawer */}
      {activeNode ? (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeNode.color }}></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                {activeNode.type}: {activeNode.label}
              </span>
            </div>
            <button
              onClick={() => setActiveNode(null)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Close ✕
            </button>
          </div>
          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
            {activeNode.details}
          </pre>
        </div>
      ) : (
        <p className="text-center text-[11px] font-mono text-slate-500 mt-2">
          Click any satellite node to reveal decomposed variables.
        </p>
      )}
    </div>
  );
}