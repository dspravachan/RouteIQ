import Navbar from '@/components/layout/Navbar'
import GridCanvas from '@/components/grid/GridCanvas'
import GridControls from '@/components/grid/GridControls'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grid Visualizer — RouteIQ',
  description: 'Visualize BFS, DFS, Dijkstra, A*, and Bellman-Ford on an interactive grid.',
}

export default function GridPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#060910', overflow: 'hidden' }}>
      <Navbar />

      {/* Toolbar strip */}
      <div style={{
        marginTop: 56,
        padding: '0 20px',
        height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(11,15,26,0.8)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Grid Visualizer</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Click & drag to draw</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="chip chip-cyan">Interactive</span>
          <span className="chip">22 × 50</span>
        </div>
      </div>

      {/* Main workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panel */}
        <aside style={{
          width: 260, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflowY: 'auto', overflowX: 'hidden',
          background: '#0b0f1a',
        }}>
          <GridControls />
        </aside>

        {/* Canvas area */}
        <main style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'auto', padding: 20,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,211,238,0.025) 0%, transparent 70%)',
        }}>
          <GridCanvas />
        </main>
      </div>
    </div>
  )
}
