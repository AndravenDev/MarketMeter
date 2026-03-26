import CoinPicker, { Coin } from "./CoinPicker";
import NewsFeed from "./NewsFeed";

export default async function Home() {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`,
  );
  const coins: Coin[] = await res.json();

  return (
    <main>
      <CoinPicker coins={coins} />
      <NewsFeed />
    </main>
  );
}
