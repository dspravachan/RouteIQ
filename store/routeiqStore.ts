'use client'

import { create } from 'zustand'
import { GridCell, AlgorithmKey, ToolType, RunRecord, AlgorithmMetrics, CellType } from '@/lib/algorithms/types'
import { createGrid, resetGridState, generateMaze, findStartEnd } from '@/lib/grid/gridFactory'
import { runAlgorithm } from '@/lib/algorithms/index'

const DEFAULT_ROWS = 22
const DEFAULT_COLS = 50

interface RouteIQStore {
  // Grid
  grid: GridCell[][]
  rows: number
  cols: number

  // Tool
  selectedTool: ToolType
  selectedAlgorithm: AlgorithmKey

  // Animation state
  isRunning: boolean
  isPaused: boolean
  speed: number
  currentStep: number
  totalSteps: number
  visitedNodes: string[]
  pathNodes: string[]

  // Compare mode
  compareMode: boolean
  algorithmA: AlgorithmKey
  algorithmB: AlgorithmKey

  // Analytics
  metrics: AlgorithmMetrics | null
  history: RunRecord[]

  // Actions
  setGrid: (grid: GridCell[][]) => void
  setCell: (row: number, col: number, type: ToolType) => void
  setSelectedTool: (tool: ToolType) => void
  setSelectedAlgorithm: (algo: AlgorithmKey) => void
  setSpeed: (speed: number) => void
  setCompareMode: (mode: boolean) => void
  setAlgorithmA: (algo: AlgorithmKey) => void
  setAlgorithmB: (algo: AlgorithmKey) => void
  resetVisualization: () => void
  clearWalls: () => void
  generateMazeGrid: () => void
  runVisualization: () => Promise<void>
  pauseResume: () => void
  addToHistory: (record: RunRecord) => void
}

export const useRouteIQStore = create<RouteIQStore>((set, get) => ({
  grid: (() => {
    const g = createGrid(DEFAULT_ROWS, DEFAULT_COLS)
    g[10][5].type = 'start'; g[10][5].state = 'start'
    g[10][44].type = 'end'; g[10][44].state = 'end'
    return g
  })(),
  rows: DEFAULT_ROWS,
  cols: DEFAULT_COLS,

  selectedTool: 'wall',
  selectedAlgorithm: 'astar',

  isRunning: false,
  isPaused: false,
  speed: 30,
  currentStep: 0,
  totalSteps: 0,
  visitedNodes: [],
  pathNodes: [],

  compareMode: false,
  algorithmA: 'dijkstra',
  algorithmB: 'astar',

  metrics: null,
  history: [],

  setGrid: (grid) => set({ grid }),

  setCell: (row, col, type) => {
    const grid = get().grid.map(r => r.map(c => ({ ...c })))
    const cell = grid[row][col]

    // Remove existing start/end if placing a new one
    if (type === 'start') {
      for (const r of grid) for (const c of r)
        if (c.type === 'start') { c.type = 'empty'; c.state = 'unvisited' }
    }
    if (type === 'end') {
      for (const r of grid) for (const c of r)
        if (c.type === 'end') { c.type = 'empty'; c.state = 'unvisited' }
    }

    const cellType: CellType = type === 'erase' ? 'empty' : type as CellType
    cell.type = cellType
    cell.state = cellType as GridCell['state']
    cell.weight = type === 'weight' ? 5 : 1

    set({ grid })
  },

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedAlgorithm: (algo) => set({ selectedAlgorithm: algo }),
  setSpeed: (speed) => set({ speed }),
  setCompareMode: (mode) => set({ compareMode: mode }),
  setAlgorithmA: (algo) => set({ algorithmA: algo }),
  setAlgorithmB: (algo) => set({ algorithmB: algo }),

  resetVisualization: () => {
    const grid = resetGridState(get().grid)
    set({
      grid,
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      visitedNodes: [],
      pathNodes: [],
      metrics: null,
    })
  },

  clearWalls: () => {
    const grid = get().grid.map(row => row.map(cell => {
      if (cell.type === 'wall' || cell.type === 'weighted') {
        return { ...cell, type: 'empty' as GridCell['type'], state: 'unvisited' as GridCell['state'], weight: 1 }
      }
      return { ...cell }
    }))
    set({ grid })
  },

  generateMazeGrid: () => {
    const { rows, cols } = get()
    const maze = generateMaze(rows, cols)
    // Place start and end
    maze[1][1].type = 'start'; maze[1][1].state = 'start'
    maze[rows-2][cols-2].type = 'end'; maze[rows-2][cols-2].state = 'end'
    set({ grid: maze, metrics: null, visitedNodes: [], pathNodes: [] })
  },

  pauseResume: () => set(state => ({ isPaused: !state.isPaused })),

  addToHistory: (record) => set(state => ({
    history: [record, ...state.history].slice(0, 50)
  })),

  runVisualization: async () => {
    const { grid, selectedAlgorithm, speed } = get()
    const { start, end } = findStartEnd(grid)
    if (!start || !end) return

    // Reset visual state
    const cleanGrid = resetGridState(grid)
    set({ grid: cleanGrid, isRunning: true, isPaused: false, visitedNodes: [], pathNodes: [], metrics: null })

    const result = runAlgorithm(
      selectedAlgorithm,
      cleanGrid.map(r => r.map(c => ({ ...c }))),
      start[0], start[1],
      end[0], end[1]
    )

    const { visitedOrder, pathOrder, metrics } = result

    // Animate visited nodes
    for (let i = 0; i < visitedOrder.length; i++) {
      await new Promise<void>((resolve) => {
        const checkPause = () => {
          if (!get().isRunning) { resolve(); return }
          if (get().isPaused) { setTimeout(checkPause, 100); return }

          set(state => {
            const newGrid = state.grid.map(r => r.map(c => ({ ...c })))
            const cell = visitedOrder[i]
            if (newGrid[cell.row][cell.col].type === 'empty' ||
                newGrid[cell.row][cell.col].type === 'weighted') {
              newGrid[cell.row][cell.col].state = 'visited'
            }
            return { grid: newGrid, currentStep: i }
          })
          resolve()
        }
        setTimeout(checkPause, speed)
      })
    }

    // Animate path
    for (let i = 0; i < pathOrder.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          if (!get().isRunning) { resolve(); return }
          set(state => {
            const newGrid = state.grid.map(r => r.map(c => ({ ...c })))
            const cell = pathOrder[i]
            if (newGrid[cell.row][cell.col].type !== 'start' &&
                newGrid[cell.row][cell.col].type !== 'end') {
              newGrid[cell.row][cell.col].state = 'path'
            }
            return { grid: newGrid }
          })
          resolve()
        }, speed * 2)
      })
    }

    const record: RunRecord = {
      id: Date.now().toString(),
      algorithm: selectedAlgorithm,
      gridSize: `${get().rows}×${get().cols}`,
      metrics,
      timestamp: Date.now(),
    }

    set({ isRunning: false, metrics, totalSteps: visitedOrder.length })
    get().addToHistory(record)
  },
}))
