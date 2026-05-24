// Shared types for RouteIQ algorithm engine

export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'weighted'
export type CellState = 'unvisited' | 'visited' | 'frontier' | 'path' | 'start' | 'end' | 'wall' | 'weighted'
export type AlgorithmKey = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'bellman'
export type ToolType = 'start' | 'end' | 'wall' | 'weight' | 'erase'

export interface GridCell {
  row: number
  col: number
  type: CellType
  state: CellState
  weight: number      // 1 = normal, >1 = weighted terrain
  gCost: number       // Used by A* / Dijkstra
  hCost: number       // Used by A* (heuristic)
  fCost: number       // gCost + hCost
  parent: GridCell | null
  distance: number    // Used by Dijkstra / Bellman-Ford
}

export interface AlgorithmMetrics {
  nodesVisited: number
  pathLength: number
  pathCost: number
  executionTimeMs: number
  maxQueueSize: number
  isPathFound: boolean
}

export interface AlgorithmResult {
  visitedOrder: GridCell[]
  pathOrder: GridCell[]
  metrics: AlgorithmMetrics
}

export interface AlgorithmInfo {
  key: AlgorithmKey
  name: string
  tagline: string
  timeComplexity: string
  spaceComplexity: string
  weighted: boolean
  guaranteed: boolean
  color: string
  colorClass: string
  description: string
  pseudocode: string[]
  codeExamples: { java: string; python: string; c: string }
  realWorldUses: string[]
  strengths: string[]
  weaknesses: string[]
}

export interface AnimationStep {
  cells: [number, number][]
  state: CellState
  timestamp: number
}

export interface RunRecord {
  id: string
  algorithm: AlgorithmKey
  gridSize: string
  metrics: AlgorithmMetrics
  timestamp: number
}
