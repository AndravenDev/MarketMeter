import PriceChart from "../../PriceChart";
import RangePicker from "../../RangePicker";

const RANGE_CONFIG = {
  day:   { days: 1,   dateFormat: { hour: '2-digit', minute: '2-digit' } },
  week:  { days: 7,   dateFormat: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } },
  month: { days: 30,  dateFormat: { month: 'short', day: 'numeric', hour: '2-digit' } },
  year:  { days: 365, dateFormat: { month: 'short', day: 'numeric', year: 'numeric' } },
} as const;

type Range = keyof typeof RANGE_CONFIG;

interface CoinDetail {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
}

function fmt(n: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-US', opts).format(n)
}

function fmtUsd(n: number) {
  return '$' + fmt(n, { minimumFractionDigits: n < 1 ? 4 : 2, maximumFractionDigits: n < 1 ? 6 : 2 })
}

function fmtLarge(n: number) {
  if (n >= 1e12) return '$' + fmt(n / 1e12, { maximumFractionDigits: 2 }) + 'T'
  if (n >= 1e9)  return '$' + fmt(n / 1e9,  { maximumFractionDigits: 2 }) + 'B'
  if (n >= 1e6)  return '$' + fmt(n / 1e6,  { maximumFractionDigits: 2 }) + 'M'
  return '$' + fmt(n)
}

function fmtSupply(n: number, symbol: string) {
  if (n >= 1e9) return fmt(n / 1e9, { maximumFractionDigits: 2 }) + 'B ' + symbol.toUpperCase()
  if (n >= 1e6) return fmt(n / 1e6, { maximumFractionDigits: 2 }) + 'M ' + symbol.toUpperCase()
  return fmt(n) + ' ' + symbol.toUpperCase()
}

function StatCard({ label, value, sub, subColor }: { label: string; value: string; sub?: string; subColor?: string }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e8e3db',
      borderRadius: 10,
      padding: '0.85rem 1.1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#292524' }}>{value}</div>
      {sub && (
        <div style={{ fontSize: '0.78rem', fontWeight: 500, color: subColor ?? '#a8a29e', marginTop: '0.2rem' }}>{sub}</div>
      )}
    </div>
  )
}

export default async function CoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { id } = await params;
  const { range: rawRange = 'day' } = await searchParams;
  const range: Range = rawRange in RANGE_CONFIG ? (rawRange as Range) : 'day';
  const { days, dateFormat } = RANGE_CONFIG[range];

  const apiKey = process.env.COINGECKO_API_KEY;

  const [chartRes, coinRes] = await Promise.all([
    fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${apiKey}`),
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&x_cg_demo_api_key=${apiKey}`),
  ]);

  const [chartData, [coin]]: [{ prices: [number, number][] }, CoinDetail[]] = await Promise.all([
    chartRes.json(),
    coinRes.json(),
  ]);

  const labels = chartData.prices.map(([timestamp]) =>
    new Date(timestamp).toLocaleString("en-US", dateFormat as Intl.DateTimeFormatOptions),
  );
  const prices = chartData.prices.map(([, price]) => price);

  const changeColor = coin.price_change_percentage_24h >= 0 ? '#16a34a' : '#dc2626'
  const changeSign  = coin.price_change_percentage_24h >= 0 ? '+' : ''

  return (
    <main>
      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          fontSize: "0.88rem",
          color: "#78716c",
          textDecoration: "none",
          marginBottom: "1.75rem",
          padding: "0.3rem 0.75rem",
          borderRadius: 20,
          background: "#f0ebe4",
          border: "1px solid #e8e3db",
        }}
      >
        ← Back
      </a>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.25rem",
        padding: "1rem 1.25rem",
        background: "#ffffff",
        borderRadius: 12,
        border: "1px solid #e8e3db",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coin.image} alt={coin.name} width={40} height={40} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#292524" }}>{coin.name}</h2>
            <span style={{ color: "#a8a29e", textTransform: "uppercase", fontSize: "0.82rem", fontWeight: 600 }}>{coin.symbol}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#292524' }}>{fmtUsd(coin.current_price)}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: changeColor }}>
              {changeSign}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
            <span style={{ fontSize: '0.78rem', color: '#a8a29e' }}>24h</span>
          </div>
        </div>
        {coin.market_cap_rank && (
          <div style={{
            padding: '0.3rem 0.7rem',
            borderRadius: 20,
            background: '#f0ebe4',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#78716c',
          }}>
            #{coin.market_cap_rank}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.6rem',
        marginBottom: '1.25rem',
      }}>
        <StatCard label="Market Cap"   value={fmtLarge(coin.market_cap)} />
        <StatCard label="24h Volume"   value={fmtLarge(coin.total_volume)} />
        <StatCard label="24h High"     value={fmtUsd(coin.high_24h)} />
        <StatCard label="24h Low"      value={fmtUsd(coin.low_24h)} />
        <StatCard
          label="All-Time High"
          value={fmtUsd(coin.ath)}
          sub={`${coin.ath_change_percentage.toFixed(1)}% from ATH`}
          subColor={coin.ath_change_percentage >= 0 ? '#16a34a' : '#dc2626'}
        />
        <StatCard
          label="Circulating Supply"
          value={fmtSupply(coin.circulating_supply, coin.symbol)}
          sub={coin.max_supply ? `Max: ${fmtSupply(coin.max_supply, coin.symbol)}` : undefined}
        />
      </div>

      {/* Chart */}
      <div style={{
        background: "#ffffff",
        borderRadius: 12,
        border: "1px solid #e8e3db",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        padding: "1.25rem",
      }}>
        <RangePicker current={range} />
        <PriceChart labels={labels} prices={prices} range={range} />
      </div>
    </main>
  );
}
