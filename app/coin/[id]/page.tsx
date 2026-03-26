import PriceChart from "../../PriceChart";
import RangePicker from "../../RangePicker";
import { Coin } from "../../CoinPicker";

const RANGE_CONFIG = {
  day:   { days: 1,   dateFormat: { hour: '2-digit', minute: '2-digit' } },
  week:  { days: 7,   dateFormat: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } },
  month: { days: 30,  dateFormat: { month: 'short', day: 'numeric', hour: '2-digit' } },
  year:  { days: 365, dateFormat: { month: 'short', day: 'numeric', year: 'numeric' } },
} as const;

type Range = keyof typeof RANGE_CONFIG;

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

  const [chartData, [coin]]: [{ prices: [number, number][] }, Coin[]] = await Promise.all([
    chartRes.json(),
    coinRes.json(),
  ]);

  const labels = chartData.prices.map(([timestamp]) =>
    new Date(timestamp).toLocaleString("en-US", dateFormat as Intl.DateTimeFormatOptions),
  );
  const prices = chartData.prices.map(([, price]) => price);

  return (
    <main style={{ margin: "0 auto", padding: "2rem" }}>
      <a href="/" style={{ fontSize: "0.9rem", color: "#f7931a", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
        ← Back
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <img src={coin.image} alt={coin.name} width={36} height={36} />
        <h2 style={{ margin: 0 }}>{coin.name}</h2>
        <span style={{ color: "#888", textTransform: "uppercase", fontSize: "0.9rem" }}>{coin.symbol}</span>
      </div>
      <RangePicker current={range} />
      <PriceChart labels={labels} prices={prices} range={range} />
    </main>
  );
}
