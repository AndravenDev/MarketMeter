import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')
  if (!query) return NextResponse.json({ coins: [] })

  const res = await fetch(
    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`,
  )

  const data = await res.json()

  const coins = (data.coins ?? []).slice(0, 8).map((c: { id: string; name: string; symbol: string; thumb: string }) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    image: c.thumb,
  }))

  return NextResponse.json({ coins })
}
