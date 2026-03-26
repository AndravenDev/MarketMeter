'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Coin } from './CoinPicker'

export default function CoinSearch() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Coin[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.coins)
      setOpen(true)
      setLoading(false)
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function select(coin: Coin) {
    router.push('/coin/' + coin.id)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', maxWidth: 300 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search coins..."
        style={{
          width: '100%',
          padding: '0.6rem 1rem',
          borderRadius: 10,
          border: '1.5px solid #e8e3db',
          background: '#ffffff',
          color: '#292524',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
          outline: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      />
      {loading && (
        <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#a8a29e' }}>
          ...
        </span>
      )}
      {open && results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1.5px solid #e8e3db',
            borderRadius: 10,
            margin: 0,
            padding: '0.3rem 0',
            listStyle: 'none',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}
        >
          {results.map((coin) => (
            <li key={coin.id}>
              <button
                onClick={() => select(coin)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  padding: '0.55rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#292524',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#faf8f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <img src={coin.image} alt={coin.name} width={22} height={22} />
                <span style={{ fontWeight: 500 }}>{coin.name}</span>
                <span style={{ marginLeft: 'auto', color: '#a8a29e', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  {coin.symbol}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
