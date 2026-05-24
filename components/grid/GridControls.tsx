'use client'

import { useRouteIQStore } from '@/store/routeiqStore'
import { AlgorithmKey, ToolType } from '@/lib/algorithms/types'
import { ALGORITHM_INFO } from '@/lib/algorithms/index'

const ALGOS = Object.values(ALGORITHM_INFO)

const TOOLS: { key: ToolType; label: string; shortcut: string; color: string }[] = [
  { key: 'start',  label: 'Start',  shortcut: 'S', color: '#22d3ee' },
  { key: 'end',    label: 'End',    shortcut: 'E', color: '#f59e0b' },
  { key: 'wall',   label: 'Wall',   shortcut: 'W', color: '#475569' },
  { key: 'weight', label: 'Weight', shortcut: 'X', color: '#818cf8' },
  { key: 'erase',  label: 'Erase',  shortcut: 'R', color: '#f87171' },
]

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '14px 14px 0' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 8 }}>
        {label}
      </div>
      {children}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '14px -14px 0' }} />
    </div>
  )
}

export default function GridControls() {
  const {
    selectedTool, setSelectedTool,
    selectedAlgorithm, setSelectedAlgorithm,
    speed, setSpeed,
    isRunning, isPaused,
    runVisualization, pauseResume, resetVisualization,
    clearWalls, generateMazeGrid,
    metrics,
  } = useRouteIQStore()

  const algoInfo = ALGORITHM_INFO[selectedAlgorithm]
  const speedPct = Math.round((1 - (speed - 5) / 195) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Algorithm */}
      <Section label="Algorithm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ALGOS.map(a => (
            <button
              key={a.key}
              onClick={() => !isRunning && setSelectedAlgorithm(a.key)}
              disabled={isRunning}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 8, border: 'none', cursor: isRunning ? 'default' : 'pointer',
                background: selectedAlgorithm === a.key ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'background 0.12s',
                width: '100%',
              }}
              onMouseEnter={e => { if (!isRunning && selectedAlgorithm !== a.key) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={e => { if (selectedAlgorithm !== a.key) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: selectedAlgorithm === a.key ? a.color : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.2s',
                }} />
                <span style={{ fontSize: 13, fontWeight: selectedAlgorithm === a.key ? 600 : 400, color: selectedAlgorithm === a.key ? 'white' : 'rgba(255,255,255,0.5)' }}>
                  {a.name}
                </span>
              </div>
              <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                {a.timeComplexity}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Tool */}
      <Section label="Draw Tool">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {TOOLS.map(t => (
            <button
              key={t.key}
              onClick={() => setSelectedTool(t.key)}
              disabled={isRunning}
              title={`${t.label} (${t.shortcut})`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 5, padding: '8px 4px', borderRadius: 8, border: 'none',
                cursor: isRunning ? 'default' : 'pointer',
                background: selectedTool === t.key ? 'rgba(255,255,255,0.07)' : 'transparent',
                transition: 'background 0.12s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 4,
                background: selectedTool === t.key ? t.color : 'rgba(255,255,255,0.1)',
                transition: 'background 0.15s',
              }} />
              <span style={{ fontSize: 10, color: selectedTool === t.key ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Speed */}
      <Section label={`Speed — ${speedPct}%`}>
        <input
          type="range" min={5} max={200} value={speed}
          onChange={e => setSpeed(+e.target.value)}
          disabled={isRunning}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Fast</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Slow</span>
        </div>
      </Section>

      {/* Actions */}
      <Section label="Actions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {!isRunning ? (
            <button
              className="btn btn-primary"
              onClick={runVisualization}
              style={{ width: '100%', justifyContent: 'center', height: 38 }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <polygon points="2,1 12,6.5 2,12" fill="currentColor"/>
              </svg>
              Run {algoInfo.name.split("'")[0].trim()}
            </button>
          ) : (
            <button
              className="btn btn-outline"
              onClick={pauseResume}
              style={{ width: '100%', justifyContent: 'center', height: 38 }}
            >
              {isPaused ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <polygon points="2,1 12,6.5 2,12" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="2" y="1" width="3.5" height="11" rx="1" fill="currentColor"/>
                  <rect x="7.5" y="1" width="3.5" height="11" rx="1" fill="currentColor"/>
                </svg>
              )}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
            <button className="btn btn-ghost" onClick={resetVisualization} style={{ justifyContent: 'center', fontSize: 12, padding: '7px 8px' }}>
              Reset
            </button>
            <button className="btn btn-violet" onClick={generateMazeGrid} disabled={isRunning} style={{ justifyContent: 'center', fontSize: 12, padding: '7px 8px' }}>
              Maze
            </button>
            <button className="btn btn-danger" onClick={clearWalls} disabled={isRunning} style={{ justifyContent: 'center', fontSize: 12, padding: '7px 8px' }}>
              Clear
            </button>
          </div>
        </div>
      </Section>

      {/* Metrics */}
      {metrics && (
        <Section label="Results">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Found',   value: metrics.isPathFound ? 'Yes' : 'No', color: metrics.isPathFound ? '#34d399' : '#f87171' },
              { label: 'Visited', value: String(metrics.nodesVisited),        color: '#818cf8' },
              { label: 'Length',  value: metrics.pathLength > 0 ? `${metrics.pathLength} cells` : '—', color: '#f59e0b' },
              { label: 'Cost',    value: metrics.pathCost > 0 ? metrics.pathCost.toFixed(0) : '—', color: '#22d3ee' },
              { label: 'Time',    value: `${metrics.executionTimeMs.toFixed(2)}ms`, color: '#34d399' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{m.label}</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Legend */}
      <Section label="Legend">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { color: '#22d3ee', label: 'Start' },
            { color: '#f59e0b', label: 'End' },
            { color: '#1e2a3a', label: 'Wall' },
            { color: '#2d3548', label: 'Weighted (×5)' },
            { color: '#1e3a6e', label: 'Visited' },
            { color: '#3730a3', label: 'Frontier' },
            { color: '#f59e0b', label: 'Path' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Algo note */}
      <div style={{ padding: '14px 14px 20px', marginTop: 'auto' }}>
        <div style={{ padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: algoInfo.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: algoInfo.color }}>{algoInfo.name}</span>
            <span style={{ fontSize: 10, color: algoInfo.guaranteed ? '#34d399' : '#f59e0b', fontWeight: 600, marginLeft: 'auto' }}>
              {algoInfo.guaranteed ? '✓ Optimal' : '✗ Non-opt'}
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, margin: 0 }}>
            {algoInfo.tagline}
          </p>
        </div>
      </div>
    </div>
  )
}
