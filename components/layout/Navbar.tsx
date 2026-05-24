'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/grid',     label: 'Grid',      dot: '#22d3ee' },
  { href: '/map',      label: 'Map',       dot: '#818cf8' },
  { href: '/compare',  label: 'Race',      dot: '#34d399' },
  { href: '/analytics',label: 'Analytics', dot: '#f59e0b' },
  { href: '/learn',    label: 'Learn',     dot: '#fb923c' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 56,
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        background: 'rgba(6,9,16,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#22d3ee" fillOpacity="0.12"/>
            <circle cx="7" cy="14" r="2.5" fill="#22d3ee"/>
            <circle cx="21" cy="7" r="2.5" fill="#818cf8"/>
            <circle cx="21" cy="21" r="2.5" fill="#f59e0b"/>
            <line x1="7" y1="14" x2="21" y2="7" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.6"/>
            <line x1="7" y1="14" x2="21" y2="21" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.6"/>
            <line x1="21" y1="7" x2="21" y2="21" stroke="rgba(129,140,248,0.4)" strokeWidth="1" strokeDasharray="2 2"/>
          </svg>
          <span style={{
            fontFamily: 'Geist, sans-serif', fontWeight: 700,
            fontSize: 16, letterSpacing: '-0.3px', color: 'white'
          }}>
            Route<span style={{ color: '#22d3ee' }}>IQ</span>
          </span>
        </Link>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', marginRight: 20 }} />

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 2, flex: 1 }}>
          {NAV.map(({ href, label, dot }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  color: active ? 'white' : 'rgba(255,255,255,0.45)',
                  background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  transition: 'all 0.15s', cursor: 'pointer',
                  position: 'relative',
                }}>
                  {active && (
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: dot, flexShrink: 0,
                      boxShadow: `0 0 8px ${dot}`,
                    }} />
                  )}
                  {label}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            DAA Project
          </span>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-menu-btn"
            style={{
              display: 'none', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, zIndex: 199,
          background: 'rgba(6,9,16,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '12px 16px 16px',
        }}>
          {NAV.map(({ href, label, dot }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none', display: 'block' }} onClick={() => setOpen(false)}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10, marginBottom: 4,
                color: pathname === href ? 'white' : 'rgba(255,255,255,0.5)',
                background: pathname === href ? 'rgba(255,255,255,0.06)' : 'transparent',
                fontSize: 14, fontWeight: 500,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
                {label}
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
