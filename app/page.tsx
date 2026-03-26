import PriceChart from "./PriceChart";
import RangePicker from "./RangePicker";

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
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange = 'day' } = await searchParams;
  const range: Range = rawRange in RANGE_CONFIG ? (rawRange as Range) : 'day';
  const { days, dateFormat } = RANGE_CONFIG[range];

  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`,
  );

  const data = await res.json();

  const labels = data.prices.map(([timestamp]: [number, number]) =>
    new Date(timestamp).toLocaleString("en-US", dateFormat as Intl.DateTimeFormatOptions),
  );
  const prices = data.prices.map(([, price]: [number, number]) => price);

  return (
    <main style={{ margin: "0 auto", padding: "2rem" }}>
      <RangePicker current={range} />
      <PriceChart labels={labels} prices={prices} range={range} />
    </main>
  );
}
