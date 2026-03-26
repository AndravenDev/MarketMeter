import PriceChart from "./PriceChart";

export default async function Home() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&x_cg_demo_api_key=" +
      process.env.COINGECKO_API_KEY,
  );

  const data = await res.json();

  const labels = data.prices.map(([timestamp]: [number, number]) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const prices = data.prices.map(([, price]: [number, number]) => price);

  return (
    <main style={{ margin: "0 auto", padding: "2rem" }}>
      <PriceChart labels={labels} prices={prices} />
    </main>
  );
}
