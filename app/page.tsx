import CoinPicker, { Coin } from "./CoinPicker";
import CoinSearch from "./CoinSearch";
import NewsFeed from "./NewsFeed";

export default async function Home() {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`,
  );
  const coins: Coin[] = await res.json();

  return (
    <main>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#292524", margin: "0 0 0.25rem" }}>
          MarketMeter
        </h1>
        <p style={{ margin: 0, color: "#78716c", fontSize: "0.95rem" }}>
          Track prices and news for top cryptocurrencies
        </p>
      </div>

      <CoinSearch />
      <CoinPicker coins={coins} />
      <NewsFeed />
    </main>
  );
}
