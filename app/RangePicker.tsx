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
    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
      {RANGES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => select(value)}
          style={{
            padding: '0.35rem 0.9rem',
            borderRadius: 20,
            border: '1.5px solid',
            borderColor: current === value ? '#f59e0b' : '#e8e3db',
            background: current === value ? '#fffbeb' : 'transparent',
            color: current === value ? '#d97706' : '#78716c',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.82rem',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
