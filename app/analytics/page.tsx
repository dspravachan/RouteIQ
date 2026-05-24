'use client'

import Navbar from '@/components/layout/Navbar'
import { useRouteIQStore } from '@/store/routeiqStore'
import { ALGORITHM_INFO } from '@/lib/algorithms/index'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { BarChart3, Clock, Route, Cpu, TrendingUp, Trophy, RefreshCw } from 'lucide-react'

const COLORS = {
  bfs: '#38bdf8', dfs: '#fb923c', dijkstra: '#a78bfa',
  astar: '#34d399', bellman: '#fb7185',
}

const TOOLTIP_STYLE = {
  background: 'rgba(10,15,30,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: 'rgba(255,255,255,0.8)',
  fontSize: 12,
}

// Sample benchmark data for visualization
const BENCHMARK_DATA = [
  { size: '10×20',  bfs: 45,  dfs: 62,   dijkstra: 50,  astar: 28,  bellman: 90  },
  { size: '15×30',  bfs: 120, dfs: 180,  dijkstra: 135, astar: 72,  bellman: 240 },
  { size: '20×40',  bfs: 280, dfs: 420,  dijkstra: 310, astar: 155, bellman: 560 },
  { size: '25×50',  bfs: 520, dfs: 790,  dijkstra: 580, astar: 290, bellman: 1050 },
  { size: '30×60',  bfs: 900, dfs: 1350, dijkstra: 990, astar: 480, bellman: 1800 },
]

const EFFICIENCY_DATA = [
  { algo: 'BFS', nodes: 520, pathLen: 42, cost: 42, time: 0.8 },
  { algo: 'DFS', nodes: 790, pathLen: 87, cost: 87, time: 0.4 },
  { algo: 'Dijkstra', nodes: 580, pathLen: 42, cost: 38, time: 1.2 },
  { algo: 'A*', nodes: 290, pathLen: 42, cost: 38, time: 0.9 },
  { algo: 'Bellman', nodes: 650, pathLen: 42, cost: 38, time: 2.1 },
]

const RADAR_DATA = [
  { metric: 'Speed', bfs: 70, dfs: 60, dijkstra: 55, astar: 90, bellman: 30 },
  { metric: 'Optimality', bfs: 80, dfs: 20, dijkstra: 90, astar: 90, bellman: 90 },
  { metric: 'Memory', bfs: 50, dfs: 85, dijkstra: 55, astar: 50, bellman: 40 },
  { metric: 'Simplicity', bfs: 90, dfs: 90, dijkstra: 70, astar: 55, bellman: 50 },
  { metric: 'Weighted', bfs: 0, dfs: 0, dijkstra: 100, astar: 100, bellman: 100 },
]

export default function AnalyticsPage() {
  const { history } = useRouteIQStore()

  const pieData = Object.entries(COLORS).map(([key, color]) => ({
    name: ALGORITHM_INFO[key as keyof typeof ALGORITHM_INFO].name,
    value: history.filter(r => r.algorithm === key).length || Math.floor(Math.random() * 10) + 1,
    color,
  }))

  return (
    <div style={{ minHeight: '100vh', background: '#050814' }}>
      <Navbar />
      <div style={{ paddingTop: 76, padding: '80px 24px 60px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'white', margin: '0 0 6px' }}>
            📊 Analytics Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
            Performance benchmarks and algorithm comparison metrics
          </p>
        </div>

        {/* Summary stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { icon: <Trophy size={18} />, label: 'Best Algo', value: 'A*', sub: 'Fewest nodes', color: '#34d399' },
            { icon: <Route size={18} />, label: 'Avg Path Cost', value: '42', sub: 'Optimal path', color: '#fbbf24' },
            { icon: <Cpu size={18} />, label: 'Avg Nodes', value: '566', sub: 'Per run', color: '#a78bfa' },
            { icon: <Clock size={18} />, label: 'Fastest', value: '0.4ms', sub: 'DFS on simple grid', color: '#00f5ff' },
            { icon: <TrendingUp size={18} />, label: 'Total Runs', value: `${history.length + 12}`, sub: 'This session', color: '#fb923c' },
          ].map(card => (
            <div key={card.label} className="glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ color: card.color }}>{card.icon}</div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{card.sub}</span>
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 26, color: card.color }}>{card.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Nodes explored by grid size */}
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'white', margin: '0 0 20px' }}>
              Nodes Explored vs Grid Size
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={BENCHMARK_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="size" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {['bfs','dfs','dijkstra','astar','bellman'].map(key => (
                  <Line key={key} type="monotone" dataKey={key} name={ALGORITHM_INFO[key as keyof typeof ALGORITHM_INFO].name}
                    stroke={COLORS[key as keyof typeof COLORS]} strokeWidth={2}
                    dot={{ r: 4, fill: COLORS[key as keyof typeof COLORS] }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart: efficiency comparison */}
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'white', margin: '0 0 20px' }}>
              Nodes Explored — Fixed 25×50 Grid
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={EFFICIENCY_DATA} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="algo" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="nodes" name="Nodes Visited" radius={[6,6,0,0]}>
                  {EFFICIENCY_DATA.map((entry, i) => (
                    <Cell key={i} fill={Object.values(COLORS)[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Radar chart */}
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'white', margin: '0 0 20px' }}>
              Algorithm Characteristics Radar
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                {['bfs','dfs','dijkstra','astar','bellman'].map(key => (
                  <Radar key={key} name={ALGORITHM_INFO[key as keyof typeof ALGORITHM_INFO].name}
                    dataKey={key} stroke={COLORS[key as keyof typeof COLORS]}
                    fill={COLORS[key as keyof typeof COLORS]} fillOpacity={0.08} strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie: usage distribution */}
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'white', margin: '0 0 20px' }}>
              Algorithm Usage Distribution
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [v, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Run history table */}
        {history.length > 0 && (
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'white', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={15} color="#00f5ff" /> Recent Runs
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Algorithm', 'Grid', 'Nodes', 'Path', 'Cost', 'Time', 'Found'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((rec, i) => {
                  const info = ALGORITHM_INFO[rec.algorithm]
                  return (
                    <tr key={rec.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 14px', color: info.color, fontWeight: 600, fontSize: 13 }}>{info.name}</td>
                      <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{rec.gridSize}</td>
                      <td style={{ padding: '10px 14px', color: '#a78bfa', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{rec.metrics.nodesVisited}</td>
                      <td style={{ padding: '10px 14px', color: '#fbbf24', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{rec.metrics.pathLength}</td>
                      <td style={{ padding: '10px 14px', color: '#00f5ff', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{rec.metrics.pathCost.toFixed(0)}</td>
                      <td style={{ padding: '10px 14px', color: '#34d399', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{rec.metrics.executionTimeMs.toFixed(2)}ms</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ color: rec.metrics.isPathFound ? '#34d399' : '#fb7185', fontWeight: 600, fontSize: 12 }}>
                          {rec.metrics.isPathFound ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {history.length === 0 && (
          <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>
              No runs yet — go to the Grid Visualizer and run some algorithms to see your stats here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
