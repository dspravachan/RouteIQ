import { GridCell, AlgorithmResult } from './types'

/**
 * Breadth-First Search
 * Guarantees shortest path on unweighted graphs.
 * Uses a FIFO queue — explores layer by layer.
 * Time: O(V+E), Space: O(V)
 */
export function bfs(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const startTime = performance.now()
  const rows = grid.length
  const cols = grid[0].length

  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
  const visitedOrder: GridCell[] = []
  const queue: GridCell[] = []

  let maxQueueSize = 0

  const start = grid[startRow][startCol]
  queue.push(start)
  visited[startRow][startCol] = true
  let pathFound = false

  while (queue.length > 0) {
    maxQueueSize = Math.max(maxQueueSize, queue.length)
    const current = queue.shift()!

    if (current.type !== 'start') visitedOrder.push(current)

    if (current.row === endRow && current.col === endCol) {
      pathFound = true
      break
    }

    const neighbors = getNeighbors(grid, current, rows, cols)
    for (const neighbor of neighbors) {
      if (!visited[neighbor.row][neighbor.col] && neighbor.type !== 'wall') {
        visited[neighbor.row][neighbor.col] = true
        neighbor.parent = current
        queue.push(neighbor)
      }
    }
  }

  const pathOrder = pathFound ? tracePath(grid[endRow][endCol]) : []
  const pathCost = pathOrder.reduce((sum, c) => sum + c.weight, 0)

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

function getNeighbors(grid: GridCell[][], cell: GridCell, rows: number, cols: number): GridCell[] {
  const { row, col } = cell
  const neighbors: GridCell[] = []
  if (row > 0)       neighbors.push(grid[row - 1][col])
  if (row < rows - 1) neighbors.push(grid[row + 1][col])
  if (col > 0)       neighbors.push(grid[row][col - 1])
  if (col < cols - 1) neighbors.push(grid[row][col + 1])
  return neighbors
}

export function tracePath(endCell: GridCell): GridCell[] {
  const path: GridCell[] = []
  let current: GridCell | null = endCell
  while (current !== null && current.type !== 'start') {
    path.unshift(current)
    current = current.parent
  }
  return path
}
