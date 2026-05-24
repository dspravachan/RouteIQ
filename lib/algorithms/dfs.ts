import { GridCell, AlgorithmResult } from './types'
import { tracePath } from './bfs'

/**
 * Depth-First Search
 * Does NOT guarantee shortest path.
 * Uses a LIFO stack — explores as deep as possible before backtracking.
 * Time: O(V+E), Space: O(V)
 */
export function dfs(
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
  const stack: GridCell[] = []

  let maxQueueSize = 0

  stack.push(grid[startRow][startCol])
  let pathFound = false

  while (stack.length > 0) {
    maxQueueSize = Math.max(maxQueueSize, stack.length)
    const current = stack.pop()!

    if (visited[current.row][current.col]) continue
    visited[current.row][current.col] = true

    if (current.type !== 'start') visitedOrder.push(current)

    if (current.row === endRow && current.col === endCol) {
      pathFound = true
      break
    }

    const neighbors = getNeighbors(grid, current, rows, cols)
    // Reverse so we process top→right→bottom→left in intuitive order
    for (const neighbor of neighbors.reverse()) {
      if (!visited[neighbor.row][neighbor.col] && neighbor.type !== 'wall') {
        neighbor.parent = current
        stack.push(neighbor)
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
  if (row > 0)        neighbors.push(grid[row - 1][col])
  if (row < rows - 1) neighbors.push(grid[row + 1][col])
  if (col > 0)        neighbors.push(grid[row][col - 1])
  if (col < cols - 1) neighbors.push(grid[row][col + 1])
  return neighbors
}
