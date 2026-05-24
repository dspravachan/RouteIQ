import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import ModeList from '@/components/home/ModeList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RouteIQ — Pathfinding Algorithm Visualizer',
  description: 'Visualize BFS, DFS, Dijkstra, A*, and Bellman-Ford on interactive grids and real-world maps.',
}

const ALGOS = [
  { key: 'BFS',     color: '#22d3ee', time: 'O(V+E)',        opt: true,  note: 'Shortest hops'      },
  { key: 'DFS',     color: '#fb923c', time: 'O(V+E)',        opt: false, note: 'Explores deep first' },
  { key: 'Dijkstra',color: '#818cf8', time: 'O((V+E) log V)',opt: true,  note: 'Optimal weighted'   },
  { key: 'A★',     color: '#34d399', time: 'O(b^d)',         opt: true,  note: 'Heuristic guided'   },
  { key: 'Bellman', color: '#f87171', time: 'O(V·E)',         opt: true,  note: 'Negative edges'     },
]



export default function HomePage() {
  return (
    <div style={{ background: '#060910', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Grid lines */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.8 }} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(34,211,238,0.07) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', maxWidth: 820, textAlign: 'center' }}>
          {/* Label */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 99,
              fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)',
              background: 'rgba(34,211,238,0.06)', textTransform: 'uppercase',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
              Design & Analysis of Algorithms
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Geist, sans-serif', fontWeight: 800,
            fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 1.05,
            letterSpacing: '-2.5px', color: 'white', marginBottom: 20,
          }}>
            See how algorithms<br />
            <span style={{ color: '#22d3ee' }}>find the path.</span>
          </h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.45)',
            maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7,
            fontWeight: 400,
          }}>
            BFS, DFS, Dijkstra, A*, and Bellman-Ford — visualized step by step
            on interactive grids and real OpenStreetMap networks.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/grid" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <polygon points="3,2 13,8 3,14" fill="currentColor"/>
                </svg>
                Open Visualizer
              </button>
            </Link>
            <Link href="/compare" style={{ textDecoration: 'none' }}>
              <button className="btn btn-ghost" style={{ padding: '12px 24px', fontSize: 14 }}>
                Race Two Algorithms →
              </button>
            </Link>
          </div>

          {/* Algorithm pills */}
          <div style={{
            marginTop: 52, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap'
          }}>
            {ALGOS.map(a => (
              <div key={a.key} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: a.color, flexShrink: 0,
                }} />
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{a.key}</span>
                <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{a.time}</span>
                {a.opt && (
                  <span style={{
                    fontSize: 10, color: '#34d399', fontWeight: 700,
                    background: 'rgba(52,211,153,0.1)', padding: '1px 6px', borderRadius: 4,
                  }}>opt</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODES ────────────────────────────────────── */}
      <section style={{ padding: '0 24px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
            Five ways to explore
          </p>
          <h2 style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 38px)', color: 'white', letterSpacing: '-1px', lineHeight: 1.2 }}>
            One platform. Every<br />algorithm. Zero confusion.
          </h2>
        </div>

        <ModeList />
      </section>

      {/* ── COMPLEXITY TABLE ──────────────────────────── */}
      <section style={{ padding: '0 24px 120px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
            Quick reference
          </p>
          <h2 style={{ fontFamily: 'Geist, sans-serif', fontWeight: 700, fontSize: 28, color: 'white', letterSpacing: '-0.8px' }}>
            Complexity at a glance
          </h2>
        </div>

        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', background: '#0b0f1a' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Algorithm', 'Time', 'Space', 'Weighted', 'Shortest Path'].map(h => (
                  <th key={h} style={{
                    padding: '12px 18px', textAlign: 'left', fontSize: 11,
                    color: 'rgba(255,255,255,0.3)', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALGOS.map((a, i) => (
                <tr key={a.key} style={{ borderBottom: i < ALGOS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color }} />
                      <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                        {a.key === 'A★' ? 'A*' : a.key === 'Bellman' ? 'Bellman-Ford' : a.key}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <code className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{a.time}</code>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <code className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>O(V)</code>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: 12, color: a.key === 'BFS' || a.key === 'DFS' ? '#f87171' : '#34d399', fontWeight: 600 }}>
                      {a.key === 'BFS' || a.key === 'DFS' ? 'No' : 'Yes'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: 12, color: a.opt ? '#34d399' : '#f59e0b', fontWeight: 600 }}>
                      {a.opt ? 'Guaranteed' : 'Not guaranteed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: 1100, margin: '0 auto',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Route<span style={{ color: '#22d3ee' }}>IQ</span>
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          Design & Analysis of Algorithms · Next.js 16 · React 19
        </span>
      </footer>
    </div>
  )
}
