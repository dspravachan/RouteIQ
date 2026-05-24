'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import { useState } from 'react'
import { AlgorithmKey } from '@/lib/algorithms/types'
import { ALGORITHM_INFO } from '@/lib/algorithms/index'
import { Map, Layers, Play, RotateCcw, Info } from 'lucide-react'

// Leaflet must be dynamically imported (no SSR) — it uses window/document
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0f1e', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading map...</p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmKey>('astar')
  const [trafficEnabled, setTrafficEnabled] = useState(false)
  const [roadClosures, setRoadClosures] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [points, setPoints] = useState<{ lat: number; lng: number }[]>([])

  const info = ALGORITHM_INFO[selectedAlgo]

  return (
    <div style={{ minHeight: '100vh', background: '#050814', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ paddingTop: 76, padding: '76px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, color: 'white', margin: 0 }}>
              Real-World Map Visualizer
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>
              Run pathfinding on real OpenStreetMap road networks
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-violet">OpenStreetMap</span>
            <span className="badge badge-cyan">Leaflet.js</span>
          </div>
        </div>

        {/* Main layout */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, minHeight: 0 }}>

          {/* Left panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>

            {/* Instructions */}
            <div className="glass" style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <Info size={14} style={{ color: '#00f5ff', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>How to use</span>
              </div>
              <ol style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                <li>Click the map to set your <span style={{ color: '#00f5ff' }}>start point</span></li>
                <li>Click again to set the <span style={{ color: '#f59e0b' }}>destination</span></li>
                <li>Choose an algorithm below</li>
                <li>Hit Visualize and watch it find the route</li>
              </ol>
            </div>

            {/* Algorithm selector */}
            <div className="glass" style={{ padding: 16 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
                Algorithm
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {Object.values(ALGORITHM_INFO).map(algo => (
                  <button key={algo.key} onClick={() => setSelectedAlgo(algo.key)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: selectedAlgo === algo.key ? `${algo.color}18` : 'rgba(255,255,255,0.03)',
                      borderLeft: `3px solid ${selectedAlgo === algo.key ? algo.color : 'transparent'}`,
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ color: selectedAlgo === algo.key ? algo.color : 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>
                      {algo.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation toggles */}
            <div className="glass" style={{ padding: 16 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 12 }}>
                Simulation
              </label>
              {[
                { label: 'Traffic Congestion', sub: 'Increases road weights', value: trafficEnabled, toggle: () => setTrafficEnabled(v => !v), color: '#f59e0b' },
                { label: 'Road Closures', sub: 'Blocks random roads', value: roadClosures, toggle: () => setRoadClosures(v => !v), color: '#fb7185' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{item.sub}</div>
                  </div>
                  <button
                    onClick={item.toggle}
                    style={{
                      width: 42, height: 22, borderRadius: 99, border: 'none', cursor: 'pointer',
                      background: item.value ? item.color : 'rgba(255,255,255,0.15)',
                      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 2, left: item.value ? 22 : 2,
                      width: 18, height: 18, borderRadius: '50%', background: 'white',
                      transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="glass" style={{ padding: 16 }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
                onClick={() => setIsRunning(true)}
                disabled={isRunning || points.length < 2}
              >
                <Play size={14} /> {isRunning ? 'Visualizing...' : 'Visualize Route'}
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setIsRunning(false); setPoints([]) }}
              >
                <RotateCcw size={14} /> Reset Map
              </button>
            </div>

            {/* Current algorithm info */}
            <div className="glass" style={{ padding: 16 }}>
              <div style={{ color: info.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{info.name}</div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: 0 }}>{info.tagline}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <code style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>
                  T: {info.timeComplexity}
                </code>
              </div>
            </div>
          </div>

          {/* Map */}
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', minHeight: 500 }}>
            <LeafletMap
              selectedAlgo={selectedAlgo}
              trafficEnabled={trafficEnabled}
              roadClosures={roadClosures}
              isRunning={isRunning}
              onRunComplete={() => setIsRunning(false)}
              points={points}
              setPoints={setPoints}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
