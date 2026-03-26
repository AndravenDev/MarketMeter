'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Coin } from './CoinPicker'

export default function CoinSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

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
    const params = new URLSearchParams(searchParams.toString())
    params.set('coin', coin.id)
    router.push('?' + params.toString())
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 320 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search coins..."
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          borderRadius: 8,
          border: '1px solid #444',
          background: '#111',
          color: '#fff',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
        }}
      />
      {loading && (
        <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#888' }}>
          ...
        </span>
      )}
      {open && results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#1a1a1a',
            border: '1px solid #444',
            borderRadius: 8,
            margin: 0,
            padding: '0.25rem 0',
            listStyle: 'none',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
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
                  padding: '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#2a2a2a')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <img src={coin.image} alt={coin.name} width={20} height={20} />
                <span>{coin.name}</span>
                <span style={{ marginLeft: 'auto', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>
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
