import { GridCell, AlgorithmResult } from './types'

/**
 * A* (A-Star) Algorithm
 * Optimal pathfinding using heuristic guidance.
 * f(n) = g(n) + h(n) — balances cost so far + estimated cost to goal.
 * Uses Manhattan distance heuristic (admissible for 4-directional grids).
 * Time: O(b^d) worst case, much faster in practice.
 * Space: O(b^d)
 */
export function astar(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const startTime = performance.now()
  const rows = grid.length
  const cols = grid[0].length

  // Reset costs
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      grid[r][c].gCost = Infinity
      grid[r][c].hCost = 0
      grid[r][c].fCost = Infinity
      grid[r][c].parent = null
    }

  const startCell = grid[startRow][startCol]
  startCell.gCost = 0
  startCell.hCost = heuristic(startRow, startCol, endRow, endCol)
  startCell.fCost = startCell.hCost

  const openSet: GridCell[] = [startCell]
  const closedSet: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
  const visitedOrder: GridCell[] = []

  let maxQueueSize = 0
  let pathFound = false

  while (openSet.length > 0) {
    // Get node with lowest fCost (ties broken by lowest hCost)
    openSet.sort((a, b) => a.fCost !== b.fCost ? a.fCost - b.fCost : a.hCost - b.hCost)
    maxQueueSize = Math.max(maxQueueSize, openSet.length)

    const current = openSet.shift()!
    closedSet[current.row][current.col] = true

    if (current.type !== 'start') visitedOrder.push(current)

    if (current.row === endRow && current.col === endCol) {
      pathFound = true
      break
    }

    const neighbors = getNeighbors(grid, current, rows, cols)
    for (const neighbor of neighbors) {
      if (neighbor.type === 'wall' || closedSet[neighbor.row][neighbor.col]) continue

      const tentativeG = current.gCost + neighbor.weight
      if (tentativeG < neighbor.gCost) {
        neighbor.parent = current
        neighbor.gCost = tentativeG
        neighbor.hCost = heuristic(neighbor.row, neighbor.col, endRow, endCol)
        neighbor.fCost = neighbor.gCost + neighbor.hCost

        if (!openSet.find(n => n.row === neighbor.row && n.col === neighbor.col)) {
          openSet.push(neighbor)
        }
      }
    }
  }

  const pathOrder = pathFound ? tracePath(grid[endRow][endCol]) : []
  const pathCost = grid[endRow][endCol].gCost === Infinity ? 0 : grid[endRow][endCol].gCost

  return {
    visitedOrder,
    pathOrder,
    metrics: {
      nodesVisited: visitedOrder.length,
      pathLength: pathOrder.length,
      pathCost,
      executionTimeMs: performance.now() - startTime,
      maxQueueSize,
      isPathFound: pathFound,
    },
  }
}

/** Manhattan distance heuristic — admissible for 4-direction movement */
function heuristic(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2)
}

function getNeighbors(grid: GridCell[][], cell: GridCell, rows: number, cols: number): GridCell[] {
  const { row, col } = cell
  const neighbors: GridCell[] = []
  if (row > 0)        neighbors.push(grid[row - 1][col])
  if (row < rows - 1) neighbors.push(grid[row + 1][col])
  if (col > 0)        neighbors.push(grid[row][col - 1])
  if (col < cols - 1) neighbors.push(grid[row][col + 1])
  return neighbors
}

function tracePath(endCell: GridCell): GridCell[] {
  const path: GridCell[] = []
  let current: GridCell | null = endCell
  while (current !== null && current.type !== 'start') {
    path.unshift(current)
    current = current.parent
  }
  return path
}
