import { GridCell, CellType } from '../algorithms/types'

export function createGrid(rows: number, cols: number): GridCell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => createCell(r, c))
  )
}

export function createCell(row: number, col: number): GridCell {
  return {
    row,
    col,
    type: 'empty',
    state: 'unvisited',
    weight: 1,
    gCost: Infinity,
    hCost: 0,
    fCost: Infinity,
    parent: null,
    distance: Infinity,
  }
}

/** Deep-clone a grid and reset algorithm state, preserving walls/weights/start/end */
export function cloneGrid(grid: GridCell[][]): GridCell[][] {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      state: cell.type === 'wall' ? 'wall'
           : cell.type === 'start' ? 'start'
           : cell.type === 'end'   ? 'end'
           : cell.type === 'weighted' ? 'weighted'
           : 'unvisited',
      gCost: Infinity,
      hCost: 0,
      fCost: Infinity,
      parent: null,
      distance: Infinity,
    }))
  )
}

/** Reset only traversal state — keep walls, weights, start, end */
export function resetGridState(grid: GridCell[][]): GridCell[][] {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      state: (cell.type as string) as GridCell['state'],
      gCost: Infinity,
      hCost: 0,
      fCost: Infinity,
      parent: null,
      distance: Infinity,
    }))
  )
}

/** Recursive backtracker maze generator */
export function generateMaze(rows: number, cols: number): GridCell[][] {
  const grid = createGrid(rows, cols)

  // Fill with walls
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      grid[r][c].type = 'wall'
      grid[r][c].state = 'wall'
    }

  function carve(r: number, c: number) {
    const dirs = shuffle([[0,2],[0,-2],[2,0],[-2,0]])
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].type === 'wall') {
        grid[r + dr/2][c + dc/2].type = 'empty'
        grid[r + dr/2][c + dc/2].state = 'unvisited'
        grid[nr][nc].type = 'empty'
        grid[nr][nc].state = 'unvisited'
        carve(nr, nc)
      }
    }
  }

  const startR = 1, startC = 1
  grid[startR][startC].type = 'empty'
  grid[startR][startC].state = 'unvisited'
  carve(startR, startC)

  return grid
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Serialize grid to JSON (for save/load) */
export function serializeGrid(grid: GridCell[][]): string {
  const data = grid.map(row => row.map(cell => ({
    r: cell.row, c: cell.col,
    t: cell.type,
    w: cell.weight,
  })))
  return JSON.stringify(data)
}

/** Find start and end node positions */
export function findStartEnd(grid: GridCell[][]): {
  start: [number, number] | null
  end: [number, number] | null
} {
  let start: [number, number] | null = null
  let end: [number, number] | null = null
  for (const row of grid)
    for (const cell of row) {
      if (cell.type === 'start') start = [cell.row, cell.col]
      if (cell.type === 'end') end = [cell.row, cell.col]
    }
  return { start, end }
}
