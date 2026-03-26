'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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

      <nav style={{ padding: '0.75rem 0' }}>
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
    </aside>
  )
}
