import CoinPicker, { Coin } from "./CoinPicker";
import CoinSearch from "./CoinSearch";

export default async function Home() {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`,
  );
  const coins: Coin[] = await res.json();

  return (
    <main style={{ margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>MarketMeter</h1>
      <CoinSearch />
      <CoinPicker coins={coins} />
    </main>
  );
}
