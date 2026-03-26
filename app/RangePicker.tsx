'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const RANGES = [
  { label: '24H', value: 'day' },
  { label: '1W', value: 'week' },
  { label: '1M', value: 'month' },
  { label: '1Y', value: 'year' },
]

export default function RangePicker({ current }: { current: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('range', value)
    router.push('?' + params.toString())
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      {RANGES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => select(value)}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: 6,
            border: '1px solid #f7931a',
            background: current === value ? '#f7931a' : 'transparent',
            color: current === value ? '#fff' : '#f7931a',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
