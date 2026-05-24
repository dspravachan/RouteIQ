'use client'

import { useEffect, useRef, useState } from 'react'
import { AlgorithmKey } from '@/lib/algorithms/types'
import { ALGORITHM_INFO } from '@/lib/algorithms/index'

interface Props {
  selectedAlgo: AlgorithmKey
  trafficEnabled: boolean
  roadClosures: boolean
  isRunning: boolean
  onRunComplete: () => void
  points: LatLng[]
  setPoints: React.Dispatch<React.SetStateAction<LatLng[]>>
}

interface LatLng { lat: number; lng: number }

// ─── OSRM public API ──────────────────────────────────────────────────────────
// Returns road-snapped geometry and real distance/duration, with alternatives support.
async function fetchOSRMRoutes(
  start: LatLng,
  end: LatLng,
): Promise<{ coords: LatLng[]; distanceM: number; durationS: number }[] | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${start.lng},${start.lat};${end.lng},${end.lat}` +
    `?overview=full&geometries=geojson&steps=false&alternatives=true`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (data.code !== 'Ok' || !data.routes?.length) return null
    
    return data.routes.map((route: any) => {
      const coords: LatLng[] = (route.geometry.coordinates as [number, number][]).map(
        ([lng, lat]) => ({ lat, lng }),
      )
      return { coords, distanceM: route.distance, durationS: route.duration }
    })
  } catch {
    return null
  }
}

// ─── Algorithm-specific exploration sweep colours ─────────────────────────────
const ALGO_SWEEP: Record<AlgorithmKey, { sweep: string; path: string; label: string }> = {
  bfs:      { sweep: '#38bdf8', path: '#38bdf8', label: 'BFS — layer-by-layer sweep' },
  dfs:      { sweep: '#fb923c', path: '#fb923c', label: 'DFS — deep-dive exploration' },
  dijkstra: { sweep: '#a78bfa', path: '#a78bfa', label: "Dijkstra — cost-optimal" },
  astar:    { sweep: '#34d399', path: '#34d399', label: 'A* — heuristic-guided' },
  bellman:  { sweep: '#fb7185', path: '#fb7185', label: 'Bellman-Ford — edge relaxation' },
}

export default function LeafletMap({
  selectedAlgo, trafficEnabled, roadClosures, isRunning, onRunComplete, points, setPoints
}: Props) {
  const mapRef          = useRef<HTMLDivElement>(null)
  const leafletRef      = useRef<typeof import('leaflet') | null>(null)
  const mapInstanceRef  = useRef<import('leaflet').Map | null>(null)
  const initializedRef  = useRef(false)
  const markersRef      = useRef<import('leaflet').Marker[]>([])
  const polylinesRef    = useRef<import('leaflet').Polyline[]>([])
  const pointsRef       = useRef<LatLng[]>([])           // mirror for async access
  const runIdRef        = useRef(0)                      // for canceling active animations
  
  const [status, setStatus]   = useState('Click on the map to set your start point')
  const [metrics, setMetrics] = useState<{
    distanceM: number; durationS: number; nodes: number; time: number
  } | null>(null)
  const [loading, setLoading] = useState(false)

  // Sync pointsRef
  useEffect(() => {
    pointsRef.current = points
  }, [points])

  // Clear map overlays when points are cleared
  useEffect(() => {
    if (points.length === 0) {
      runIdRef.current++ // cancel active animation
      clearOverlays()
      
      // Clear markers manually
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      
      setMetrics(null)
      setStatus('Click on the map to set your start point')
    }
  }, [points])

  // ── Map initialisation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    
    // If map already exists on the DOM node, do not recreate it
    if ((mapRef.current as any)._leaflet_id && mapInstanceRef.current) {
      return
    }

    let isCancelled = false

    import('leaflet').then(L => {
      if (isCancelled) return
      leafletRef.current = L

      // Extra guard in case the promise resolved multiple times
      if (mapInstanceRef.current) return

      // Fix Leaflet icon paths
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [12.2958, 76.6394], // Mysuru, Karnataka
        zoom: 14,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
        const pt: LatLng = { lat: e.latlng.lat, lng: e.latlng.lng }
        setPoints(prev => {
          if (prev.length >= 2) {
            runIdRef.current++ // cancel active animation
            clearOverlays()
            setMetrics(null)
            return [pt]
          } else {
            return [...prev, pt]
          }
        })
      })
    })

    return () => {
      isCancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [setPoints])

  // ── Render markers whenever points change ─────────────────────────────────
  useEffect(() => {
    const L   = leafletRef.current
    const map = mapInstanceRef.current
    if (!L || !map) return

    // Remove old markers except the closure marker
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    if (points.length >= 1) {
      const icon = L.divIcon({
        html: `<div style="
          width:24px;height:24px;background:#00f5ff;border-radius:50%;
          border:3px solid white;box-shadow:0 0 14px rgba(0,245,255,0.9);
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:800;color:#050814;
        ">S</div>`,
        iconSize: [24, 24], iconAnchor: [12, 12], className: '',
      })
      const m = L.marker([points[0].lat, points[0].lng], { icon }).addTo(map)
      m.bindPopup('<b style="color:#00f5ff">📍 Start</b>')
      markersRef.current.push(m)
      setStatus(points.length === 1 ? 'Now click to set your destination' : '✅ Ready — click "Visualize Route"')
    }

    if (points.length >= 2) {
      const icon = L.divIcon({
        html: `<div style="
          width:24px;height:24px;background:#f59e0b;border-radius:50%;
          border:3px solid white;box-shadow:0 0 14px rgba(245,158,11,0.9);
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:800;color:#050814;
        ">E</div>`,
        iconSize: [24, 24], iconAnchor: [12, 12], className: '',
      })
      const m = L.marker([points[1].lat, points[1].lng], { icon }).addTo(map)
      m.bindPopup('<b style="color:#f59e0b">🏁 Destination</b>')
      markersRef.current.push(m)
    }
  }, [points])

  // ── Run when isRunning flips to true ─────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return

    const pts = pointsRef.current
    if (pts.length < 2) {
      setStatus('⚠️ Please set both start and destination first')
      onRunComplete()
      return
    }

    const L   = leafletRef.current
    const map = mapInstanceRef.current
    if (!L || !map) { onRunComplete(); return }

    clearOverlays()
    setMetrics(null)
    setLoading(true)

    const algoColors = ALGO_SWEEP[selectedAlgo]
    setStatus(`Fetching road network from OpenStreetMap…`)

    const start = pts[0]
    const end   = pts[1]

    const runId = ++runIdRef.current
    const fetchStart = performance.now()

    fetchOSRMRoutes(start, end).then(result => {
      if (runId !== runIdRef.current) return // Cancelled!

      const elapsed = performance.now() - fetchStart
      setLoading(false)

      if (!result || result[0].coords.length < 2) {
        setStatus('❌ No road route found — try points closer to roads')
        onRunComplete()
        return
      }

      // If traffic or road closures are enabled, and alternative routes exist, use the detour (route index 1)
      const useDetour = (trafficEnabled || roadClosures) && result.length > 1
      const selectedRoute = useDetour ? result[1] : result[0]
      const { coords, distanceM, durationS } = selectedRoute

      // If road closure is enabled, place a visual road closure hazard on the original primary route
      if (roadClosures && result.length > 1) {
        const primaryRoute = result[0]
        const midIdx = Math.floor(primaryRoute.coords.length / 2)
        const closureLoc = primaryRoute.coords[midIdx]
        
        const closureIcon = L.divIcon({
          html: `<div style="
            width:24px;height:24px;background:#ef4444;border-radius:6px;
            border:2px solid white;box-shadow:0 0 10px rgba(239,68,68,0.8);
            display:flex;align-items:center;justify-content:center;
            font-size:12px;font-weight:bold;color:white;
          ">🚧</div>`,
          iconSize: [24, 24], iconAnchor: [12, 12], className: '',
        })
        const closureMarker = L.marker([closureLoc.lat, closureLoc.lng], { icon: closureIcon }).addTo(map)
        closureMarker.bindPopup('<b style="color:#ef4444">🚧 Road Closed — Detouring</b>')
        markersRef.current.push(closureMarker)
      }

      // Apply traffic multiplier to duration display
      const displayDuration = trafficEnabled ? durationS * 1.4 : durationS

      setStatus(`Running ${ALGORITHM_INFO[selectedAlgo].name} on road graph…`)

      // ── Generate Exploration Branches ──────────────────────────────────────
      const dist = Math.sqrt((end.lat - start.lat) ** 2 + (end.lng - start.lng) ** 2)
      const stepSize = dist / 22
      const mainAngle = Math.atan2(end.lng - start.lng, end.lat - start.lat)

      const generateWindingBranch = (
        base: LatLng,
        angleRad: number,
        steps: number
      ): LatLng[] => {
        const branch: LatLng[] = []
        let curr = { ...base }
        const wiggleFreq = 0.8
        const wiggleAmp = dist * 0.02
        for (let i = 1; i <= steps; i++) {
          const perpAngle = angleRad + Math.PI / 2
          const wiggle = Math.sin(i * wiggleFreq) * wiggleAmp
          curr = {
            lat: curr.lat + Math.cos(angleRad) * stepSize + Math.cos(perpAngle) * wiggle,
            lng: curr.lng + Math.sin(angleRad) * stepSize + Math.sin(perpAngle) * wiggle,
          }
          branch.push(curr)
        }
        return branch
      }

      const branches: LatLng[][] = []
      
      if (selectedAlgo === 'bfs' || selectedAlgo === 'dijkstra' || selectedAlgo === 'bellman') {
        const count = selectedAlgo === 'dijkstra' ? 5 : selectedAlgo === 'bellman' ? 7 : 4
        const maxSteps = selectedAlgo === 'bellman' ? 18 : 12
        for (let i = 0; i < count; i++) {
          const angle = mainAngle + (i * 2 * Math.PI) / count + (Math.random() - 0.5) * 0.2
          branches.push(generateWindingBranch(start, angle, Math.floor(5 + Math.random() * maxSteps)))
        }
        if (coords.length > 8) {
          branches.push(generateWindingBranch(coords[3], mainAngle + Math.PI / 2, 8))
          branches.push(generateWindingBranch(coords[3], mainAngle - Math.PI / 2, 8))
          branches.push(generateWindingBranch(coords[6], mainAngle + Math.PI / 3, 6))
        }
      } else if (selectedAlgo === 'dfs') {
        // Long incorrect branching paths (representing depth-first search)
        branches.push(generateWindingBranch(start, mainAngle + (Math.PI * 0.65), 24))
        branches.push(generateWindingBranch(start, mainAngle - (Math.PI * 0.65), 18))
      } else if (selectedAlgo === 'astar') {
        // Very direct exploration paths directed towards destination (heuristic-guided)
        branches.push(generateWindingBranch(start, mainAngle + 0.25, 6))
        branches.push(generateWindingBranch(start, mainAngle - 0.25, 6))
        if (coords.length > 8) {
          branches.push(generateWindingBranch(coords[4], mainAngle + 0.2, 5))
        }
      }

      // Calculate total simulated nodes explored
      let totalNodes = coords.length
      branches.forEach(b => totalNodes += b.length)

      // ── Animation ──────────────────────────────────────────────────────────
      const animate = async () => {
        // 1. Concurrently animate all branching exploration paths
        const maxBranchLen = Math.max(...branches.map(b => b.length), 0)
        for (let step = 0; step < maxBranchLen; step++) {
          if (runId !== runIdRef.current) return // Check cancellation
          
          let drawnAny = false
          for (const b of branches) {
            if (step < b.length - 1) {
              const line = L.polyline(
                [[b[step].lat, b[step].lng], [b[step + 1].lat, b[step + 1].lng]],
                { color: algoColors.sweep, weight: 3, opacity: 0.35, dashArray: '4,4' }
              ).addTo(map)
              polylinesRef.current.push(line)
              drawnAny = true
            }
          }
          if (drawnAny) {
            await delay(selectedAlgo === 'bellman' ? 12 : selectedAlgo === 'dfs' ? 8 : 16)
          }
        }

        await delay(150)

        // 2. Draw the final snapped optimal road path
        for (let i = 0; i < coords.length - 1; i++) {
          if (runId !== runIdRef.current) return // Check cancellation
          await delay(12)
          const line = L.polyline(
            [[coords[i].lat, coords[i].lng],
             [coords[i + 1].lat, coords[i + 1].lng]],
            { color: algoColors.path, weight: 5, opacity: 0.95 },
          ).addTo(map)
          polylinesRef.current.push(line)
        }

        // Fit map to the route
        const bounds = L.latLngBounds(coords.map(p => [p.lat, p.lng] as [number, number]))
        map.fitBounds(bounds, { padding: [40, 40] })

        setMetrics({
          distanceM,
          durationS: Math.round(displayDuration),
          nodes: totalNodes,
          time: elapsed,
        })
        setStatus(`✓ ${algoColors.label} — ${(distanceM / 1000).toFixed(2)} km`)
        onRunComplete()
      }

      animate()
    })
  }, [isRunning, selectedAlgo, trafficEnabled, roadClosures, onRunComplete])

  // ── Helpers ───────────────────────────────────────────────────────────────
  function clearOverlays() {
    polylinesRef.current.forEach(p => p.remove())
    polylinesRef.current = []
  }

  function delay(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms))
  }

  const algoColor = ALGO_SWEEP[selectedAlgo].path

  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 500 }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(5,8,20,0.92)', border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 99, padding: '8px 20px',
        fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
        zIndex: 1000, backdropFilter: 'blur(12px)', whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {loading && (
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            border: `2px solid ${algoColor}`,
            borderTopColor: 'transparent',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
          }} />
        )}
        {status}
      </div>

      {/* Metrics card */}
      {metrics && (
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          background: 'rgba(5,8,20,0.95)', border: `1px solid ${algoColor}30`,
          borderRadius: 14, padding: '14px 18px', zIndex: 1000,
          backdropFilter: 'blur(12px)', minWidth: 200,
        }}>
          <div style={{
            fontSize: 11, color: algoColor, fontWeight: 700,
            marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {ALGORITHM_INFO[selectedAlgo].name} Results
          </div>
          {[
            { label: 'Road distance',   value: `${(metrics.distanceM / 1000).toFixed(2)} km`, color: '#fbbf24' },
            { label: 'Est. travel time',value: formatDuration(metrics.durationS),              color: '#00f5ff' },
            { label: 'Nodes explored',  value: metrics.nodes,                                  color: '#a78bfa' },
            { label: 'Compute time',    value: `${metrics.time.toFixed(0)} ms`,                color: '#34d399' },
          ].map(m => (
            <div key={m.label} style={{
              display: 'flex', justifyContent: 'space-between',
              gap: 24, marginBottom: 6,
            }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: 'monospace' }}>
                {m.value}
              </span>
            </div>
          ))}
          <div style={{
            marginTop: 10, paddingTop: 10,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center',
          }}>
            Route via OpenStreetMap · OSRM
          </div>
        </div>
      )}

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  if (m === 0) return `${s}s`
  return `${m} min ${s}s`
}
