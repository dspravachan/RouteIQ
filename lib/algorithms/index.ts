import { AlgorithmKey, AlgorithmInfo, GridCell, AlgorithmResult } from './types'
import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra } from './dijkstra'
import { astar } from './astar'
import { bellmanFord } from './bellmanFord'
import { CODE_EXAMPLES } from './codeExamples'

// Algorithm registry — single source of truth for metadata
export const ALGORITHM_INFO: Record<AlgorithmKey, AlgorithmInfo> = {
  bfs: {
    key: 'bfs',
    name: 'Breadth-First Search',
    tagline: 'Explores layer by layer — perfect for unweighted graphs',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    weighted: false,
    guaranteed: true,
    color: '#38bdf8',
    colorClass: 'algo-bfs',
    description: 'BFS explores all nodes at the current depth before moving to the next level. Using a FIFO queue, it guarantees the shortest path in terms of number of edges on unweighted graphs.',
    pseudocode: [
      'queue.enqueue(start)',
      'while queue is not empty:',
      '  current = queue.dequeue()',
      '  mark current as visited',
      '  if current == end: return path',
      '  for each neighbor of current:',
      '    if not visited and not wall:',
      '      neighbor.parent = current',
      '      queue.enqueue(neighbor)',
      'return no path found',
    ],
    realWorldUses: ['GPS shortest route (hops)', 'Social network degrees of separation', 'Web crawlers', 'Network broadcasting'],
    strengths: ['Guarantees shortest path (unweighted)', 'Complete — always finds solution if exists', 'Simple to implement'],
    weaknesses: ['High memory usage (stores all frontier nodes)', 'Ignores edge weights', 'Slow on large dense graphs'],
    codeExamples: CODE_EXAMPLES.bfs,
  },

  dfs: {
    key: 'dfs',
    name: 'Depth-First Search',
    tagline: 'Dives deep before backtracking — great for maze solving',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    weighted: false,
    guaranteed: false,
    color: '#fb923c',
    colorClass: 'algo-dfs',
    description: 'DFS explores as far as possible along each branch before backtracking. Uses a LIFO stack. Does not guarantee the shortest path — finds a valid path (if it exists) but may take long winding routes.',
    pseudocode: [
      'stack.push(start)',
      'while stack is not empty:',
      '  current = stack.pop()',
      '  if already visited: continue',
      '  mark current as visited',
      '  if current == end: return path',
      '  for each neighbor of current:',
      '    if not visited and not wall:',
      '      neighbor.parent = current',
      '      stack.push(neighbor)',
      'return no path found',
    ],
    realWorldUses: ['Topological sorting', 'Cycle detection', 'Maze generation', 'Solving puzzles (Sudoku, N-Queens)'],
    strengths: ['Low memory (only stores current path)', 'Fast for deep narrow paths', 'Good for maze generation'],
    weaknesses: ['Does NOT guarantee shortest path', 'Can get trapped in long branches', 'Not suitable for weighted graphs'],
    codeExamples: CODE_EXAMPLES.dfs,
  },

  dijkstra: {
    key: 'dijkstra',
    name: "Dijkstra's Algorithm",
    tagline: 'Optimal weighted pathfinding — the backbone of GPS routing',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    weighted: true,
    guaranteed: true,
    color: '#a78bfa',
    colorClass: 'algo-dijkstra',
    description: "Dijkstra's algorithm finds the shortest path in weighted graphs with non-negative edge weights. It greedily selects the node with the minimum accumulated cost from a priority queue.",
    pseudocode: [
      'dist[start] = 0; all others = ∞',
      'priority_queue.insert(start, 0)',
      'while queue is not empty:',
      '  current = queue.extract_min()',
      '  if current == end: return path',
      '  for each neighbor of current:',
      '    newDist = dist[current] + weight(edge)',
      '    if newDist < dist[neighbor]:',
      '      dist[neighbor] = newDist',
      '      neighbor.parent = current',
      '      queue.decrease_key(neighbor, newDist)',
    ],
    realWorldUses: ['GPS navigation (Google Maps)', 'Network routing protocols (OSPF)', 'Flight path optimization', 'Robot path planning'],
    strengths: ['Guarantees optimal path on non-negative weighted graphs', 'Efficient with binary heap', 'Well-studied and proven'],
    weaknesses: ['Slower than A* in practice (no heuristic)', 'Cannot handle negative weights', 'Explores in all directions equally'],
    codeExamples: CODE_EXAMPLES.dijkstra,
  },

  astar: {
    key: 'astar',
    name: 'A* Algorithm',
    tagline: 'Heuristic-guided search — the fastest optimal pathfinder',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    weighted: true,
    guaranteed: true,
    color: '#34d399',
    colorClass: 'algo-astar',
    description: 'A* combines Dijkstra\'s cost-so-far with a heuristic estimate of remaining cost. f(n) = g(n) + h(n). With an admissible heuristic (Manhattan distance), it guarantees the optimal path while exploring far fewer nodes than Dijkstra.',
    pseudocode: [
      'g[start] = 0; h[start] = heuristic(start, end)',
      'f[start] = g + h; open_set = {start}',
      'while open_set not empty:',
      '  current = node in open_set with min f',
      '  if current == end: return path',
      '  add current to closed_set',
      '  for each neighbor:',
      '    if in closed_set or wall: skip',
      '    tentative_g = g[current] + weight(edge)',
      '    if tentative_g < g[neighbor]:',
      '      g[neighbor] = tentative_g',
      '      f[neighbor] = g + heuristic(neighbor, end)',
      '      open_set.insert(neighbor)',
    ],
    realWorldUses: ['Game AI pathfinding', 'Robotics navigation', 'Puzzle solving (15-puzzle)', 'Real-time strategy games'],
    strengths: ['Optimal AND faster than Dijkstra with good heuristic', 'Focuses search toward goal', 'Widely used in industry'],
    weaknesses: ['Memory-intensive (stores all open/closed nodes)', 'Heuristic quality affects performance', 'Harder to implement correctly'],
    codeExamples: CODE_EXAMPLES.astar,
  },

  bellman: {
    key: 'bellman',
    name: 'Bellman-Ford',
    tagline: 'Handles negative weights and detects negative cycles',
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    weighted: true,
    guaranteed: true,
    color: '#fb7185',
    colorClass: 'algo-bellman',
    description: 'Bellman-Ford relaxes all edges V-1 times to find shortest paths. Unlike Dijkstra, it handles negative edge weights and detects negative cycles — making it critical for financial modeling and network routing.',
    pseudocode: [
      'dist[start] = 0; all others = ∞',
      'repeat V-1 times:',
      '  for each edge (u, v, w):',
      '    if dist[u] + w < dist[v]:',
      '      dist[v] = dist[u] + w',
      '      v.parent = u',
      '  if no updates: break early',
      '(Negative cycle check:)',
      'for each edge (u, v, w):',
      '  if dist[u] + w < dist[v]: negative cycle!',
    ],
    realWorldUses: ['Distance-vector routing protocols (RIP)', 'Currency arbitrage detection', 'Network flow optimization', 'Financial risk modeling'],
    strengths: ['Handles negative edge weights', 'Detects negative cycles', 'Works on any graph'],
    weaknesses: ['Much slower than Dijkstra — O(VE)', 'Not suitable for real-time use', 'Rarely needed for simple grids'],
    codeExamples: CODE_EXAMPLES.bellman,
  },
}

export type AlgorithmRunner = (
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
) => AlgorithmResult

const RUNNERS: Record<AlgorithmKey, AlgorithmRunner> = {
  bfs: bfs,
  dfs: dfs,
  dijkstra: dijkstra,
  astar: astar,
  bellman: bellmanFord,
}

export function runAlgorithm(
  key: AlgorithmKey,
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  return RUNNERS[key](grid, startRow, startCol, endRow, endCol)
}
