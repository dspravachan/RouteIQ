import { GridCell, AlgorithmResult } from './types'

/**
 * Dijkstra's Algorithm
 * Guarantees shortest path on weighted graphs (non-negative weights).
 * Uses a min-priority queue based on cumulative distance.
 * Time: O((V+E) log V), Space: O(V)
 */
export function dijkstra(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const startTime = performance.now()
  const rows = grid.length
  const cols = grid[0].length

  // Reset distances
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      grid[r][c].distance = Infinity
      grid[r][c].parent = null
    }

  grid[startRow][startCol].distance = 0

  const visitedOrder: GridCell[] = []
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))

  // Min-heap simulation using sorted array (good enough for visualizer scale)
  const queue: GridCell[] = [grid[startRow][startCol]]

  let maxQueueSize = 0
  let pathFound = false

  while (queue.length > 0) {
    // Extract min-distance node
    queue.sort((a, b) => a.distance - b.distance)
    maxQueueSize = Math.max(maxQueueSize, queue.length)
    const current = queue.shift()!

    if (visited[current.row][current.col]) continue
    visited[current.row][current.col] = true

    if (current.type !== 'start') visitedOrder.push(current)

    if (current.row === endRow && current.col === endCol) {
      pathFound = true
      break
    }

    if (current.distance === Infinity) break // Remaining nodes unreachable

    const neighbors = getNeighbors(grid, current, rows, cols)
    for (const neighbor of neighbors) {
      if (neighbor.type === 'wall' || visited[neighbor.row][neighbor.col]) continue
      const newDist = current.distance + neighbor.weight
      if (newDist < neighbor.distance) {
        neighbor.distance = newDist
        neighbor.parent = current
        queue.push(neighbor)
      }
    }
  }

  const pathOrder = pathFound ? tracePath(grid[endRow][endCol]) : []
  const pathCost = grid[endRow][endCol].distance === Infinity ? 0 : grid[endRow][endCol].distance

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

function tracePath(endCell: GridCell): GridCell[] {
  const path: GridCell[] = []
  let current: GridCell | null = endCell
  while (current !== null && current.type !== 'start') {
    path.unshift(current)
    current = current.parent
  }
  return path
}
