'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const CLOCKS = [
  { label: 'New York', tz: 'America/New_York' },
  { label: 'London',   tz: 'Europe/London' },
  { label: 'Sofia',    tz: 'Europe/Sofia' },
  { label: 'Tokyo',    tz: 'Asia/Tokyo' },
]

function WorldClocks({ collapsed }: { collapsed: boolean }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  return (
    <div style={{
      padding: collapsed ? '0.75rem 0' : '0.75rem 1rem 1rem',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      {CLOCKS.map(({ label, tz }) => {
        const time = now.toLocaleTimeString('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        return (
          <div
            key={tz}
            title={collapsed ? `${label}: ${time}` : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              padding: '0.28rem 0',
              whiteSpace: 'nowrap',
            }}
          >
            {!collapsed && (
              <span style={{ fontSize: '0.82rem', color: '#78716c' }}>{label}</span>
            )}
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a8a29e', fontVariantNumeric: 'tabular-nums' }}>
              {collapsed ? time.slice(0, 5) : time}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const LINKS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? 56 : 200,
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#1c1917',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
      transition: 'width 0.2s ease',
    }}>
      <div style={{
        padding: '0.69rem 1rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
      }}>
        {!collapsed && (
          <span style={{
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#ffffff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            MarketMeter
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#a8a29e',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed
              ? <path d="M9 18l6-6-6-6"/>
              : <path d="M15 18l-6-6 6-6"/>
            }
          </svg>
        </button>
      </div>

      <nav style={{ padding: '0.75rem 0', flex: 1 }}>
        {LINKS.map(({ href, label, icon }) => {
          const active = href === '/'
            ? pathname === '/' || pathname.startsWith('/coin')
            : pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '0.6rem',
                padding: collapsed ? '0.65rem 0' : '0.65rem 1.5rem',
                fontSize: '0.88rem',
                fontWeight: active ? 600 : 400,
                color: active ? '#ffffff' : '#a8a29e',
                textDecoration: 'none',
                borderLeft: collapsed ? 'none' : `3px solid ${active ? '#f59e0b' : 'transparent'}`,
                background: active ? 'rgba(245,158,11,0.1)' : 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>

      <WorldClocks collapsed={collapsed} />

      <div style={{
        padding: collapsed ? '0.75rem 0' : '0.75rem 1rem',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '0.4rem',
      }}>
        <a
          href="https://www.coingecko.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Data provided by CoinGecko"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: collapsed ? 'center' : 'flex-start',
            gap: '0.15rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? (
            <span style={{ fontSize: '1.1rem' }}>🦎</span>
          ) : (
            <>
              <span style={{ fontSize: '0.65rem', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Powered by
              </span>
              <span style={{ fontSize: '0.88rem', color: '#d6d3d1', fontWeight: 700, letterSpacing: '0.01em' }}>
                CoinGecko
              </span>
            </>
          )}
        </a>
      </div>
    </aside>
  )
}
