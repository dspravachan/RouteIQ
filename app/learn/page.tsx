'use client'

import Navbar from '@/components/layout/Navbar'
import { ALGORITHM_INFO } from '@/lib/algorithms/index'
import { AlgorithmKey } from '@/lib/algorithms/types'
import { useState } from 'react'
import { BookOpen, Code2, ChevronDown, ChevronUp, Cpu, Zap, AlertTriangle, CheckCircle, Globe } from 'lucide-react'

const TABS = ['Overview', 'Pseudocode', 'Complexity', 'Use Cases', 'Code Implementation'] as const
type Tab = typeof TABS[number]

export default function LearnPage() {
  const [selected, setSelected] = useState<AlgorithmKey>('astar')
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [codeLang, setCodeLang] = useState<'java' | 'python' | 'c'>('java')
  const [expanded, setExpanded] = useState<Record<AlgorithmKey, boolean>>({
    bfs: false, dfs: false, dijkstra: false, astar: true, bellman: false,
  })

  const info = ALGORITHM_INFO[selected]

  return (
    <div style={{ minHeight: '100vh', background: '#050814' }}>
      <Navbar />
      <div style={{ paddingTop: 80, maxWidth: 1200, margin: '0 auto', padding: '80px 24px 60px' }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'white', margin: '0 0 6px' }}>
            📚 Educational Mode
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
            Deep-dive into every algorithm — theory, pseudocode, complexity, and real-world applications.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>

          {/* Left: algorithm list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.values(ALGORITHM_INFO).map(algo => (
              <button
                key={algo.key}
                onClick={() => { setSelected(algo.key); setActiveTab('Overview') }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '14px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: selected === algo.key ? `${algo.color}12` : 'rgba(255,255,255,0.03)',
                  borderLeft: `3px solid ${selected === algo.key ? algo.color : 'transparent'}`,
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
              >
                <span style={{ color: selected === algo.key ? algo.color : 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 15 }}>
                  {algo.name}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2, fontFamily: 'JetBrains Mono' }}>
                  T: {algo.timeComplexity} · S: {algo.spaceComplexity}
                </span>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99,
                    color: algo.weighted ? '#a78bfa' : '#64748b',
                    background: algo.weighted ? 'rgba(167,139,250,0.1)' : 'rgba(100,116,139,0.1)',
                    border: `1px solid ${algo.weighted ? 'rgba(167,139,250,0.3)' : 'rgba(100,116,139,0.2)'}`,
                  }}>
                    {algo.weighted ? 'Weighted' : 'Unweighted'}
                  </span>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99,
                    color: algo.guaranteed ? '#34d399' : '#fb923c',
                    background: algo.guaranteed ? 'rgba(52,211,153,0.1)' : 'rgba(251,146,60,0.1)',
                    border: `1px solid ${algo.guaranteed ? 'rgba(52,211,153,0.3)' : 'rgba(251,146,60,0.3)'}`,
                  }}>
                    {algo.guaranteed ? '✓ Optimal' : '✗ Non-optimal'}
                  </span>
                </div>
              </button>
            ))}

            {/* Comparison table shortcut */}
            <div className="glass" style={{ padding: 16, marginTop: 8 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, color: 'white', margin: '0 0 12px' }}>
                Quick Comparison
              </h3>
              <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'left', paddingBottom: 6, fontWeight: 600 }}>Algo</th>
                    <th style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'left', paddingBottom: 6, fontWeight: 600 }}>Optimal</th>
                    <th style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'left', paddingBottom: 6, fontWeight: 600 }}>Wt</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(ALGORITHM_INFO).map(a => (
                    <tr key={a.key} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '5px 0', color: a.color, fontWeight: 600 }}>{a.key.toUpperCase()}</td>
                      <td style={{ color: a.guaranteed ? '#34d399' : '#fb7185' }}>{a.guaranteed ? '✓' : '✗'}</td>
                      <td style={{ color: a.weighted ? '#a78bfa' : '#64748b' }}>{a.weighted ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: detail panel */}
          <div>
            {/* Algorithm header */}
            <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: info.color, margin: '0 0 6px' }}>
                    {info.name}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0 }}>{info.tagline}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <span className="badge" style={{ background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}30`, borderRadius: 99, padding: '4px 12px', fontSize: 12 }}>
                    T: {info.timeComplexity}
                  </span>
                  <span className="badge" style={{ background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}30`, borderRadius: 99, padding: '4px 12px', fontSize: 12 }}>
                    S: {info.spaceComplexity}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: activeTab === tab ? `${info.color}15` : 'rgba(255,255,255,0.04)',
                  color: activeTab === tab ? info.color : 'rgba(255,255,255,0.5)',
                  fontWeight: 600, fontSize: 13,
                  borderBottom: activeTab === tab ? `2px solid ${info.color}` : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'Overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="glass" style={{ padding: 20 }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: 'white', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BookOpen size={16} color={info.color} /> How It Works
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0, fontSize: 14 }}>
                    {info.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="glass" style={{ padding: 20 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: '#34d399', margin: '0 0 12px' }}>
                      <CheckCircle size={15} /> Strengths
                    </h3>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {info.strengths.map((s, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                          <span style={{ color: '#34d399', marginTop: 1, flexShrink: 0 }}>+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass" style={{ padding: 20 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: '#fb7185', margin: '0 0 12px' }}>
                      <AlertTriangle size={15} /> Weaknesses
                    </h3>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {info.weaknesses.map((w, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                          <span style={{ color: '#fb7185', marginTop: 1, flexShrink: 0 }}>−</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Pseudocode' && (
              <div className="glass" style={{ padding: 20 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, color: 'white', margin: '0 0 16px' }}>
                  <Code2 size={16} color={info.color} /> Pseudocode
                </h3>
                <div className="code-block">
                  {info.pseudocode.map((line, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      padding: '2px 0',
                    }}>
                      <span style={{ color: '#334155', width: 20, flexShrink: 0, textAlign: 'right', userSelect: 'none', fontSize: 11 }}>
                        {i + 1}
                      </span>
                      <span style={{
                        paddingLeft: line.startsWith(' ') ? (line.match(/^\s+/)?.[0].length || 0) * 8 : 0,
                        color: line.includes('//') || line.startsWith('#') ? '#475569' :
                               line.toLowerCase().includes('while') || line.toLowerCase().includes('for') || line.toLowerCase().includes('if') ? '#c084fc' :
                               line.includes('=') ? '#94a3b8' : '#94a3b8',
                        fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: 1.6,
                        whiteSpace: 'pre',
                      }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Complexity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Time Complexity', value: info.timeComplexity, icon: <Cpu size={16} />, color: info.color },
                    { label: 'Space Complexity', value: info.spaceComplexity, icon: <Zap size={16} />, color: '#fbbf24' },
                    { label: 'Optimality', value: info.guaranteed ? 'Guaranteed ✓' : 'Not guaranteed ✗', icon: <CheckCircle size={16} />, color: info.guaranteed ? '#34d399' : '#fb7185' },
                  ].map(m => (
                    <div key={m.label} className="glass" style={{ padding: 20, textAlign: 'center' }}>
                      <div style={{ color: m.color, marginBottom: 8 }}>{m.icon}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, color: m.color, marginBottom: 4 }}>
                        {m.value}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Comparison across all algorithms */}
                <div className="glass" style={{ padding: 20 }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'white', margin: '0 0 16px' }}>
                    All Algorithms — Big-O Comparison
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Algorithm', 'Time', 'Space', 'Weighted', 'Optimal'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 600, textTransform: 'uppercase' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(ALGORITHM_INFO).map(a => (
                        <tr key={a.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: a.key === info.key ? `${a.color}08` : 'transparent' }}>
                          <td style={{ padding: '10px 12px', color: a.color, fontWeight: 700, fontSize: 13 }}>{a.name}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{a.timeComplexity}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{a.spaceComplexity}</td>
                          <td style={{ padding: '10px 12px', color: a.weighted ? '#a78bfa' : '#64748b' }}>{a.weighted ? '✓' : '✗'}</td>
                          <td style={{ padding: '10px 12px', color: a.guaranteed ? '#34d399' : '#fb7185' }}>{a.guaranteed ? '✓' : '✗'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Use Cases' && (
              <div className="glass" style={{ padding: 20 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, color: 'white', margin: '0 0 16px' }}>
                  <Globe size={16} color={info.color} /> Real-World Applications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {info.realWorldUses.map((use, i) => (
                    <div key={i} style={{
                      padding: '14px 16px', borderRadius: 12,
                      background: `${info.color}0a`,
                      border: `1px solid ${info.color}20`,
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>
                        {['🗺️', '🌐', '🎮', '🤖', '📡', '💰', '✈️', '🏥'][i % 8]}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
                        {use}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Code Implementation' && (
              <div className="glass" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, color: 'white', margin: 0 }}>
                    <Code2 size={16} color={info.color} /> Code Implementation
                  </h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['java', 'python', 'c'] as const).map(lang => (
                      <button key={lang} onClick={() => setCodeLang(lang)} style={{
                        padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: codeLang === lang ? info.color : 'rgba(255,255,255,0.04)',
                        color: codeLang === lang ? '#050814' : 'rgba(255,255,255,0.6)',
                        fontWeight: 700, fontSize: 12, textTransform: 'uppercase',
                        transition: 'all 0.15s',
                      }}>
                        {lang === 'java' ? 'Java' : lang === 'python' ? 'Python' : 'C'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="code-block" style={{ maxHeight: '500px', overflowY: 'auto', background: 'rgba(5,8,20,0.5)', borderRadius: 8, padding: 16 }}>
                  {(info.codeExamples?.[codeLang] || '').split('\n').map((line, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      padding: '2px 0',
                    }}>
                      <span style={{ color: '#334155', width: 24, flexShrink: 0, textAlign: 'right', userSelect: 'none', fontSize: 11, fontFamily: 'monospace' }}>
                        {i + 1}
                      </span>
                      <span style={{
                        color: '#cbd5e1',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.6,
                        whiteSpace: 'pre',
                      }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
