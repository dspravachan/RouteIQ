'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouteIQStore } from '@/store/routeiqStore'
import type { GridCell } from '@/lib/algorithms/types'

// Precise palette for each cell state
const BG: Record<string, string> = {
  unvisited: '#0e1420',
  wall:       '#1a2236',
  start:      '#22d3ee',
  end:        '#f59e0b',
  visited:    '#1e3a6e',
  frontier:   '#3730a3',
  path:       '#f59e0b',
  weighted:   '#1e2a3a',
}
const BORDER: Record<string, string> = {
  unvisited: 'rgba(255,255,255,0.03)',
  wall:      'rgba(255,255,255,0.04)',
  start:     'rgba(34,211,238,0.6)',
  end:       'rgba(245,158,11,0.6)',
  visited:   'rgba(30,58,110,0.8)',
  frontier:  'rgba(55,48,163,0.8)',
  path:      'rgba(245,158,11,0.5)',
  weighted:  'rgba(255,255,255,0.05)',
}

export default function GridCanvas() {
  const { grid, selectedTool, isRunning, setCell } = useRouteIQStore()
  const [isDown, setIsDown] = useState(false)
  const last = useRef('')

  const paint = useCallback((r: number, c: number) => {
    if (isRunning) return
    const key = `${r}-${c}`
    if (key === last.current) return
    last.current = key
    const cell = grid[r][c]
    if (selectedTool === 'wall' && (cell.type === 'start' || cell.type === 'end')) return
    if (selectedTool === 'weight' && (cell.type === 'start' || cell.type === 'end')) return
    setCell(r, c, selectedTool)
  }, [grid, selectedTool, isRunning, setCell])

  const [cellSize, setCellSize] = useState(17)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth - 300
      const h = window.innerHeight - 120
      const rows = grid.length
      const cols = grid[0]?.length || 50
      const s = Math.floor(Math.min(w / cols, h / rows))
      setCellSize(Math.max(11, Math.min(26, s)))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [grid])

  return (
    <div
      style={{
        display: 'inline-block',
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 0 60px rgba(0,0,0,0.6)',
        userSelect: 'none' as const,
        cursor: isRunning ? 'default' : 'crosshair',
        touchAction: 'none',
      }}
      onMouseLeave={() => { setIsDown(false); last.current = '' }}
      onMouseUp={() => { setIsDown(false); last.current = '' }}
    >
      {grid.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((cell, c) => (
            <Cell
              key={c}
              cell={cell}
              size={cellSize}
              onMouseDown={() => { setIsDown(true); paint(r, c) }}
              onMouseEnter={() => { if (isDown) paint(r, c) }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function Cell({ cell, size, onMouseDown, onMouseEnter }: {
  cell: GridCell; size: number
  onMouseDown: () => void; onMouseEnter: () => void
}) {
  const s = cell.state
  const isStart = cell.type === 'start'
  const isEnd   = cell.type === 'end'
  const isPath  = s === 'path'

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      style={{
        width: size, height: size,
        background: BG[s] ?? BG.unvisited,
        borderRight: `1px solid ${BORDER[s] ?? BORDER.unvisited}`,
        borderBottom: `1px solid ${BORDER[s] ?? BORDER.unvisited}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, position: 'relative',
        transition: s === 'start' || s === 'end' ? 'none' : 'background-color 0.1s',
        boxShadow: isPath ? 'inset 0 0 4px rgba(245,158,11,0.3)' : 'none',
      }}
    >
      {isStart && (
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 10 10" fill="none">
          <polygon points="1,9 9,5 1,1" fill="#060910" />
        </svg>
      )}
      {isEnd && (
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4" stroke="#060910" strokeWidth="2" fill="none"/>
          <circle cx="5" cy="5" r="1.5" fill="#060910"/>
        </svg>
      )}
      {cell.type === 'weighted' && !isStart && !isEnd && size >= 14 && (
        <span className="mono" style={{ fontSize: Math.max(7, size * 0.35), color: 'rgba(129,140,248,0.5)', lineHeight: 1 }}>
          {cell.weight}
        </span>
      )}
    </div>
  )
}
