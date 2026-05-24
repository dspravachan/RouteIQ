'use client'

import Link from 'next/link'

const MODES = [
  {
    num: '01',
    title: 'Grid Visualizer',
    desc: 'Paint walls, set weighted terrain, and watch the algorithm sweep through cells in real time.',
    href: '/grid',
    accent: '#22d3ee',
  },
  {
    num: '02',
    title: 'Algorithm Race',
    desc: 'Run two algorithms side-by-side on the same obstacle map. See which finds a path first.',
    href: '/compare',
    accent: '#34d399',
  },
  {
    num: '03',
    title: 'Real-World Map',
    desc: 'Drop a pin anywhere on OpenStreetMap and route between two points with live traffic simulation.',
    href: '/map',
    accent: '#818cf8',
  },
  {
    num: '04',
    title: 'Analytics',
    desc: 'Charts comparing nodes explored, path cost, and execution time across every algorithm.',
    href: '/analytics',
    accent: '#f59e0b',
  },
  {
    num: '05',
    title: 'Learn Mode',
    desc: 'Step through pseudocode, Big-O tables, real-world use cases, and pros-and-cons for each algorithm.',
    href: '/learn',
    accent: '#fb923c',
  },
]

export default function ModeList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {MODES.map((m) => (
        <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'grid', gridTemplateColumns: '64px 1fr auto',
              alignItems: 'center', gap: 24,
              padding: '22px 24px', borderRadius: 14,
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
            }}
          >
            <span className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>{m.num}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: 'white', fontFamily: 'Geist, sans-serif' }}>{m.title}</h3>
                <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.06)' }} />
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', lineHeight: 1.55 }}>{m.desc}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: m.accent, flexShrink: 0 }}>
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
}
