'use client'

import { useState, useCallback, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import { AlgorithmKey, GridCell, AlgorithmMetrics } from '@/lib/algorithms/types'
import { ALGORITHM_INFO, runAlgorithm } from '@/lib/algorithms/index'
import { createGrid, resetGridState, findStartEnd } from '@/lib/grid/gridFactory'

const R = 16, C = 38

const BG: Record<string, string> = {
  unvisited: '#0e1420', wall: '#1a2236',
  start: '#22d3ee', end: '#f59e0b',
  visited: '#1e3a6e', frontier: '#3730a3', path: '#f59e0b', weighted: '#1e2a3a',
}

function buildGrid() {
  const g = createGrid(R, C)
  g[R >> 1][3].type = 'start'; g[R >> 1][3].state = 'start'
  g[R >> 1][C - 4].type = 'end'; g[R >> 1][C - 4].state = 'end'
  for (let r = 2; r < R - 2; r++) if (r !== R >> 1) { g[r][12].type = 'wall'; g[r][12].state = 'wall' }
  for (let r = 2; r < R - 2; r++) if (r !== R >> 1) { g[r][24].type = 'wall'; g[r][24].state = 'wall' }
  for (let c = 12; c < 24; c++) { g[4][c].type = 'wall'; g[4][c].state = 'wall' }
  return g
}

export default function ComparePage() {
  const base = useRef(buildGrid())
  const [gridA, setGridA] = useState<GridCell[][]>(() => buildGrid())
  const [gridB, setGridB] = useState<GridCell[][]>(() => buildGrid())
  const [algoA, setAlgoA] = useState<AlgorithmKey>('dijkstra')
  const [algoB, setAlgoB] = useState<AlgorithmKey>('astar')
  const [metricsA, setMetricsA] = useState<AlgorithmMetrics | null>(null)
  const [metricsB, setMetricsB] = useState<AlgorithmMetrics | null>(null)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(20)
  const [winner, setWinner] = useState<'A' | 'B' | 'tie' | null>(null)
  const stopRef = useRef(false)

  const reset = useCallback(() => {
    stopRef.current = true
    base.current = buildGrid()
    setGridA(buildGrid()); setGridB(buildGrid())
    setMetricsA(null); setMetricsB(null)
    setRunning(false); setWinner(null)
    setTimeout(() => { stopRef.current = false }, 100)
  }, [])

  const race = useCallback(async () => {
    stopRef.current = false; setRunning(true)
    setMetricsA(null); setMetricsB(null); setWinner(null)

    const cleanA = resetGridState(base.current).map(r => r.map(c => ({ ...c })))
    const cleanB = resetGridState(base.current).map(r => r.map(c => ({ ...c })))
    setGridA(cleanA.map(r => r.map(c => ({ ...c }))))
    setGridB(cleanB.map(r => r.map(c => ({ ...c }))))

    const { start, end } = findStartEnd(base.current)
    if (!start || !end) { setRunning(false); return }

    const rA = runAlgorithm(algoA, cleanA, start[0], start[1], end[0], end[1])
    const rB = runAlgorithm(algoB, cleanB, start[0], start[1], end[0], end[1])
    const maxV = Math.max(rA.visitedOrder.length, rB.visitedOrder.length)

    for (let i = 0; i < maxV; i++) {
      if (stopRef.current) break
      await new Promise<void>(res => setTimeout(res, speed))
      setGridA(prev => {
        if (i >= rA.visitedOrder.length) return prev
        const g = prev.map(r => r.map(c => ({ ...c })))
        const { row, col } = rA.visitedOrder[i]
        if (g[row][col].type === 'empty' || g[row][col].type === 'weighted') g[row][col].state = 'visited'
        return g
      })
      setGridB(prev => {
        if (i >= rB.visitedOrder.length) return prev
        const g = prev.map(r => r.map(c => ({ ...c })))
        const { row, col } = rB.visitedOrder[i]
        if (g[row][col].type === 'empty' || g[row][col].type === 'weighted') g[row][col].state = 'visited'
        return g
      })
    }
    for (let i = 0; i < Math.max(rA.pathOrder.length, rB.pathOrder.length); i++) {
      if (stopRef.current) break
      await new Promise<void>(res => setTimeout(res, speed * 3))
      setGridA(prev => { if (i >= rA.pathOrder.length) return prev; const g = prev.map(r => r.map(c => ({ ...c }))); const { row, col } = rA.pathOrder[i]; if (g[row][col].type !== 'start' && g[row][col].type !== 'end') g[row][col].state = 'path'; return g })
      setGridB(prev => { if (i >= rB.pathOrder.length) return prev; const g = prev.map(r => r.map(c => ({ ...c }))); const { row, col } = rB.pathOrder[i]; if (g[row][col].type !== 'start' && g[row][col].type !== 'end') g[row][col].state = 'path'; return g })
    }

    setMetricsA(rA.metrics); setMetricsB(rB.metrics); setRunning(false)
    const sA = rA.metrics.nodesVisited + rA.metrics.pathCost * 0.5
    const sB = rB.metrics.nodesVisited + rB.metrics.pathCost * 0.5
    if (!rA.metrics.isPathFound && !rB.metrics.isPathFound) setWinner('tie')
    else if (!rA.metrics.isPathFound) setWinner('B')
    else if (!rB.metrics.isPathFound) setWinner('A')
    else if (Math.abs(sA - sB) < 1) setWinner('tie')
    else setWinner(sA < sB ? 'A' : 'B')
  }, [algoA, algoB, speed])

  const infoA = ALGORITHM_INFO[algoA], infoB = ALGORITHM_INFO[algoB]

  return (
    <div style={{ minHeight: '100vh', background: '#060910' }}>
      <Navbar />
      <div style={{ paddingTop: 56, padding: '56px 24px 40px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700, fontSize: 22, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
              Algorithm Race
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>
              Same map. Two algorithms. Which is faster?
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Speed</span>
              <input type="range" min={5} max={150} value={speed} onChange={e => setSpeed(+e.target.value)} disabled={running} style={{ width: 90 }} />
            </div>
            {!running ? (
              <button className="btn btn-primary" onClick={race} style={{ gap: 8 }}>
                <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="1,0 11,6 1,12" fill="currentColor"/></svg>
                Start Race
              </button>
            ) : (
              <button className="btn btn-ghost" disabled style={{ opacity: 0.6 }}>Running…</button>
            )}
            <button className="btn btn-ghost" onClick={reset} disabled={running}>Reset</button>
          </div>
        </div>

        {/* Winner */}
        {winner && (
          <div style={{
            marginBottom: 20, padding: '12px 20px', borderRadius: 12,
            background: winner === 'tie' ? 'rgba(255,255,255,0.04)' : `${winner === 'A' ? infoA.color : infoB.color}10`,
            border: `1px solid ${winner === 'tie' ? 'rgba(255,255,255,0.08)' : `${winner === 'A' ? infoA.color : infoB.color}25`}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 18 }}>{winner === 'tie' ? '🤝' : '🏆'}</span>
            <div>
              <span style={{ fontWeight: 700, fontSize: 15, color: winner === 'tie' ? 'white' : winner === 'A' ? infoA.color : infoB.color }}>
                {winner === 'tie' ? "It's a tie!" : `${winner === 'A' ? infoA.name : infoB.name} wins`}
              </span>
              {winner !== 'tie' && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>fewer nodes explored, lower total cost</span>}
            </div>
          </div>
        )}

        {/* Algo selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {([['A', algoA, setAlgoA, infoA, metricsA], ['B', algoB, setAlgoB, infoB, metricsB]] as const).map(([side, algo, setAlgo, info, metrics]) => (
            <div key={side as string} style={{ background: '#0b0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)' }}>
                  Algorithm {side as string}
                </span>
                {winner === side && <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700 }}>Winner</span>}
              </div>
              <select
                value={algo}
                onChange={e => !running && (setAlgo as (v: AlgorithmKey) => void)(e.target.value as AlgorithmKey)}
                disabled={running}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: '#10151f', border: '1px solid rgba(255,255,255,0.10)',
                  color: info.color, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', outline: 'none', fontFamily: 'Geist, sans-serif',
                }}
              >
                {Object.values(ALGORITHM_INFO).map(a => (
                  <option key={a.key} value={a.key} style={{ background: '#0b0f1a', color: 'white' }}>
                    {a.name} — {a.timeComplexity}
                  </option>
                ))}
              </select>
              {metrics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
                  {[
                    { k: 'Visited', v: String(metrics.nodesVisited) },
                    { k: 'Length', v: `${metrics.pathLength}` },
                    { k: 'Cost', v: metrics.pathCost.toFixed(0) },
                    { k: 'Time', v: `${metrics.executionTimeMs.toFixed(1)}ms` },
                  ].map(m => (
                    <div key={m.k} style={{ textAlign: 'center', padding: '8px 4px', background: `${info.color}0a`, borderRadius: 8, border: `1px solid ${info.color}18` }}>
                      <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: info.color }}>{m.v}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{m.k}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dual grids */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MiniGrid grid={gridA} label={infoA.name} color={infoA.color} />
          <MiniGrid grid={gridB} label={infoB.name} color={infoB.color} />
        </div>
      </div>
    </div>
  )
}

function MiniGrid({ grid, label, color }: { grid: GridCell[][], label: string, color: string }) {
  const S = 14
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      </div>
      <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
        {grid.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((cell, c) => (
              <div key={c} style={{
                width: S, height: S,
                background: BG[cell.state] ?? BG.unvisited,
                borderRight: '1px solid rgba(255,255,255,0.025)',
                borderBottom: '1px solid rgba(255,255,255,0.025)',
                flexShrink: 0,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
