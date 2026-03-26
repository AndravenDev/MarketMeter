import PriceChart from "./PriceChart";
import RangePicker from "./RangePicker";
import CoinPicker, { Coin } from "./CoinPicker";
import CoinSearch from "./CoinSearch";

const RANGE_CONFIG = {
  day:   { days: 1,   dateFormat: { hour: '2-digit', minute: '2-digit' } },
  week:  { days: 7,   dateFormat: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } },
  month: { days: 30,  dateFormat: { month: 'short', day: 'numeric', hour: '2-digit' } },
  year:  { days: 365, dateFormat: { month: 'short', day: 'numeric', year: 'numeric' } },
} as const;

type Range = keyof typeof RANGE_CONFIG;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; coin?: string }>;
}) {
  const { range: rawRange = 'day', coin = 'bitcoin' } = await searchParams;
  const range: Range = rawRange in RANGE_CONFIG ? (rawRange as Range) : 'day';
  const { days, dateFormat } = RANGE_CONFIG[range];

  const apiKey = process.env.COINGECKO_API_KEY;

  const [chartRes, marketsRes] = await Promise.all([
    fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${apiKey}`),
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${apiKey}`),
  ]);

  const [chartData, coins]: [{ prices: [number, number][] }, Coin[]] = await Promise.all([
    chartRes.json(),
    marketsRes.json(),
  ]);

  const selectedCoin = coins.find((c) => c.id === coin) ?? coins[0];

  const labels = chartData.prices.map(([timestamp]) =>
    new Date(timestamp).toLocaleString("en-US", dateFormat as Intl.DateTimeFormatOptions),
  );
  const prices = chartData.prices.map(([, price]) => price);

  return (
    <main style={{ margin: "0 auto", padding: "2rem" }}>
      <CoinSearch />
      <CoinPicker coins={coins} current={selectedCoin.id} />
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <img src={selectedCoin.image} alt={selectedCoin.name} width={32} height={32} />
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{selectedCoin.name}</h2>
      </div>
      <RangePicker current={range} />
      <PriceChart labels={labels} prices={prices} range={range} />
    </main>
  );
}
