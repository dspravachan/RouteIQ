# 🔷 RouteIQ — Pathfinding & Route Optimization Visualizer

<div align="center">

![RouteIQ](https://img.shields.io/badge/RouteIQ-Pathfinding%20Visualizer-00f5ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMyAyLjA1djIuMDJjMy45NS41MSA3IDMuODUgNyA3Ljkzcy0zLjA1IDcuNDItNyA3LjkzdjIuMDJjNS4wNS0uNTUgOS00Ljc2IDktMTAuMzVTMTguMDUgMi42IDEzIDIuMDV6TTExIDIuMDVDNS45NSAyLjYgMiA2LjgxIDIgMTIuNHM0IDkuMzUgOSA5Ljkxdi0yLjAzQzcuMDUgMTkuNzggNCA xNi4yOCA0IDEyLjQgNCA4LjUyIDcuMDUgNS4wMiAxMSA0LjA3VjIuMDV6Ii8+PC9zdmc+)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)

**An advanced, interactive pathfinding algorithm visualizer built for Design & Analysis of Algorithms (DAA). Visualize BFS, DFS, Dijkstra, A\*, and Bellman-Ford on virtual grids and real-world OpenStreetMap networks.**

[🚀 Live Demo](#) · [📚 Documentation](#documentation) · [🎮 Try It](#quick-start)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔷 **Grid Visualizer** | Draw walls, set terrain weights, animate step-by-step |
| 🗺️ **Real-World Map** | OpenStreetMap + Leaflet.js road network pathfinding |
| ⚡ **Algorithm Race** | Side-by-side comparison with live metrics |
| 📊 **Analytics Dashboard** | Recharts performance visualizations |
| 📚 **Educational Mode** | Pseudocode, complexity tables, use cases |
| 🌀 **Maze Generator** | Recursive backtracker algorithm |
| 🚦 **Traffic Simulation** | Dynamic road weight modification |
| 💾 **Run History** | Persistent metrics tracking |

---

## 🧠 Algorithms Implemented

> All algorithms are **hand-crafted** — no external pathfinding libraries.

| Algorithm | Time | Space | Weighted | Optimal |
|---|---|---|---|---|
| Breadth-First Search (BFS) | O(V+E) | O(V) | ✗ | ✓ |
| Depth-First Search (DFS) | O(V+E) | O(V) | ✗ | ✗ |
| Dijkstra's Algorithm | O((V+E)logV) | O(V) | ✓ | ✓ |
| A\* Search | O(b^d) | O(b^d) | ✓ | ✓ |
| Bellman-Ford | O(V×E) | O(V) | ✓ | ✓ |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 + custom design system
- **State**: Zustand (lightweight, zero-boilerplate)
- **Maps**: Leaflet.js + OpenStreetMap
- **Charts**: Recharts (line, bar, pie, radar)
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 📁 Project Structure

```
routeiq/
├── app/
│   ├── page.tsx          # Landing page
│   ├── grid/page.tsx     # Grid visualizer
│   ├── map/page.tsx      # Real-world map
│   ├── compare/page.tsx  # Algorithm race
│   ├── analytics/page.tsx# Dashboard
│   └── learn/page.tsx    # Educational mode
│
├── components/
│   ├── layout/Navbar.tsx
│   ├── grid/GridCanvas.tsx
│   ├── grid/GridControls.tsx
│   └── map/LeafletMap.tsx
│
├── lib/
│   ├── algorithms/
│   │   ├── types.ts      # Shared interfaces
│   │   ├── bfs.ts
│   │   ├── dfs.ts
│   │   ├── dijkstra.ts
│   │   ├── astar.ts
│   │   ├── bellmanFord.ts
│   │   └── index.ts      # Registry + factory
│   └── grid/
│       └── gridFactory.ts # Grid + maze utilities
│
└── store/
    └── routeiqStore.ts   # Zustand global state
```

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/routeiq.git
cd routeiq

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

---

## 🎮 How to Use

### Grid Visualizer (`/grid`)
1. **Select a tool** from the left panel: Start, End, Wall, Weight, or Erase
2. **Click and drag** on the grid to draw obstacles or set start/end points
3. **Choose an algorithm** from the sidebar
4. **Adjust speed** with the slider (Fast → Slow)
5. Click **Visualize** to watch the algorithm find a path
6. Use **Maze** to generate a random maze, **Reset** to clear paths

### Algorithm Race (`/compare`)
1. Choose **Algorithm A** and **Algorithm B**
2. Click **Start Race** — both run simultaneously on the same map
3. Watch live metrics update in real time
4. A winner is declared based on nodes explored + path cost

### Real Map (`/map`)
1. Click the map to set your **start point** (cyan dot)
2. Click again to set your **destination** (amber dot)
3. Toggle **Traffic** or **Road Closures** for simulation
4. Click **Visualize Route** — the algorithm runs on a road graph

---

## 📊 Algorithm Comparison

### Why A\* is Usually Best
```
Same grid, 25×50 cells, with weighted terrain:
─────────────────────────────────────────────
BFS       → 520 nodes  | path: 42 | cost: 42
DFS       → 790 nodes  | path: 87 | cost: 87  ← Non-optimal!
Dijkstra  → 580 nodes  | path: 42 | cost: 38
A*        → 290 nodes  | path: 42 | cost: 38  ← Winner!
Bellman   → 650 nodes  | path: 42 | cost: 38
```

A\* explores **44% fewer nodes** than Dijkstra while finding the same optimal path because its heuristic function guides it toward the goal.

---

## 🎓 Educational Value

This project demonstrates:

- **Graph representation** — 2D grid as adjacency list
- **Queue vs Stack** — BFS uses FIFO, DFS uses LIFO
- **Priority queues** — Dijkstra's min-heap
- **Heuristic functions** — Manhattan distance for A\*
- **Edge relaxation** — Bellman-Ford's V-1 iterations
- **Animation architecture** — decoupled algorithm + renderer
- **State management** — Zustand pattern in React

---

## 🗺️ Real-World Use Cases

| Algorithm | Used In |
|---|---|
| BFS | Social network degrees, web crawlers |
| DFS | Topological sort, cycle detection |
| Dijkstra | Google Maps, OSPF routing protocol |
| A\* | Game AI, robot navigation |
| Bellman-Ford | BGP routing, currency arbitrage |

---

## 🔮 Future Scope

- [ ] **Bidirectional A\*** for even faster pathfinding
- [ ] **Jump Point Search** optimization
- [ ] **3D terrain visualization** with Three.js
- [ ] **Multiplayer race mode** via WebSockets
- [ ] **AI algorithm recommender** based on graph properties
- [ ] **Overpass API integration** for live OSM road data
- [ ] **Export as GIF/Video** for presentations
- [ ] **Mobile touch support** with drag gestures

---

## 📋 Viva Questions

**Q: What is the time complexity of Dijkstra's algorithm and why?**
A: O((V+E) log V) with a binary heap priority queue. Each vertex is extracted once O(V log V) and each edge relaxation with heap update is O(log V), giving O(E log V). Combined: O((V+E) log V).

**Q: Why does A\* perform better than Dijkstra in practice?**
A: A\* uses a heuristic h(n) to estimate cost to goal, allowing it to prioritize promising directions. This eliminates exploring nodes that Dijkstra would visit. With an admissible heuristic (h(n) ≤ true cost), A\* is still guaranteed optimal.

**Q: Why doesn't DFS guarantee the shortest path?**
A: DFS follows one branch as deep as possible before backtracking. It may find a long winding path before exploring shorter alternatives. BFS, by contrast, explores all paths of length k before length k+1, guaranteeing shortest-hop path.

**Q: When would you use Bellman-Ford over Dijkstra?**
A: When edge weights can be negative. Dijkstra fails with negative edges because it assumes adding edges never decreases total cost. Bellman-Ford handles this via full edge relaxation. Also use when negative cycle detection is needed.

**Q: What makes the Manhattan distance heuristic admissible for A\*?**
A: On a 4-directional grid, the minimum moves between two cells is exactly |Δrow| + |Δcol| (Manhattan distance). Since actual cost ≥ minimum moves × minimum weight per cell, h(n) never overestimates the true cost, making it admissible.

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-hosted (PM2)
```bash
npm run build
pm2 start npm --name routeiq -- start
pm2 save && pm2 startup
```

---

## 📈 Performance Optimizations

- **Decoupled animation engine** — algorithm runs once, animation replays steps
- **Zustand** — minimal re-renders vs. Redux/Context
- **Next.js Turbopack** — 10× faster dev builds
- **Dynamic import** for Leaflet — zero SSR overhead
- **useMemo/useCallback** throughout to prevent unnecessary recalcs
- **CSS transitions** instead of JS animations where possible

---

## 🎨 Resume Description

> **RouteIQ — Pathfinding Algorithm Visualizer** | Next.js · TypeScript · Zustand · Leaflet.js · Recharts
>
> Built a full-stack interactive pathfinding visualizer demonstrating BFS, DFS, Dijkstra, A\*, and Bellman-Ford algorithms on a 22×50 animated grid and real-world OpenStreetMap road networks. Implemented all algorithms from scratch with animated step-by-step traversal, configurable speed control, maze generation via recursive backtracking, side-by-side algorithm comparison mode with live metrics, and a Recharts analytics dashboard. Architected with Next.js 16 App Router, Zustand for O(1) state updates, and a custom design system with dark glassmorphism aesthetic.

---

## 📄 License

MIT License — free to use for academic and portfolio purposes.

---

<div align="center">
Built with ❤️ for DAA | <strong>RouteIQ</strong> © 2026
</div>
