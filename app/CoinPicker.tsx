'use client'

import { useRouter } from 'next/navigation'

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
}

export default function CoinPicker({ coins, current }: { coins: Coin[]; current?: string }) {
  const router = useRouter()

  function select(id: string) {
    router.push('/coin/' + id)
  }

  return (
    <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.75rem' }}>
      {coins.map((coin) => {
        const active = coin.id === current
        return (
          <button
            key={coin.id}
            onClick={() => select(coin.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.6rem 0.85rem',
              borderRadius: 10,
              border: `1.5px solid ${active ? '#f59e0b' : '#e8e3db'}`,
              background: active ? '#fffbeb' : '#ffffff',
              cursor: 'pointer',
              minWidth: 68,
              flexShrink: 0,
              boxShadow: active ? '0 0 0 3px rgba(245,158,11,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          >
            <img src={coin.image} alt={coin.name} width={28} height={28} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: active ? '#d97706' : '#78716c', letterSpacing: '0.03em' }}>
              {coin.symbol}
            </span>
          </button>
        )
      })}
    </div>
  )
}
