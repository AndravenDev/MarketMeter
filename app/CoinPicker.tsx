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
    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
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
              gap: '0.25rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              border: `1px solid ${active ? '#f7931a' : '#444'}`,
              background: active ? 'rgba(247,147,26,0.15)' : 'transparent',
              cursor: 'pointer',
              minWidth: 64,
              flexShrink: 0,
            }}
          >
            <img src={coin.image} alt={coin.name} width={28} height={28} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {coin.symbol}
            </span>
          </button>
        )
      })}
    </div>
  )
}
