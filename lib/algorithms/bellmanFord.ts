import { GridCell, AlgorithmResult } from './types'

/**
 * Bellman-Ford Algorithm
 * Works with negative edge weights. Detects negative cycles.
 * Relaxes all edges V-1 times.
 * Time: O(V × E), Space: O(V)
 * 
 * Note: For visualization, we show the iteration-by-iteration relaxation.
 */
export function bellmanFord(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const startTime = performance.now()
  const rows = grid.length
  const cols = grid[0].length

  // Build flat list of non-wall nodes
  const nodes: GridCell[] = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      grid[r][c].distance = Infinity
      grid[r][c].parent = null
      if (grid[r][c].type !== 'wall') nodes.push(grid[r][c])
    }

  grid[startRow][startCol].distance = 0

  const visitedOrder: GridCell[] = []
  const relaxedSet = new Set<string>()

  const V = nodes.length

  // Relax edges V-1 times
  for (let iter = 0; iter < V - 1; iter++) {
    let updated = false

    for (const node of nodes) {
      if (node.distance === Infinity) continue

      const neighbors = getNeighbors(grid, node, rows, cols)
      for (const neighbor of neighbors) {
        if (neighbor.type === 'wall') continue

        const newDist = node.distance + neighbor.weight
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist
          neighbor.parent = node
          updated = true

          const key = `${neighbor.row}-${neighbor.col}`
          if (!relaxedSet.has(key) && neighbor.type !== 'start') {
            relaxedSet.add(key)
            visitedOrder.push(neighbor)
          }
        }
      }
    }

    // Early termination if no updates
    if (!updated) break
  }

  const endCell = grid[endRow][endCol]
  const pathFound = endCell.distance !== Infinity
  const pathOrder = pathFound ? tracePath(endCell) : []
  const pathCost = pathFound ? endCell.distance : 0

  return {
    visitedOrder,
    pathOrder,
    metrics: {
      nodesVisited: visitedOrder.length,
      pathLength: pathOrder.length,
      pathCost,
      executionTimeMs: performance.now() - startTime,
      maxQueueSize: V,
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
