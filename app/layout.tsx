import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./Sidebar";
import CoinSearch from "./CoinSearch";

export const metadata: Metadata = {
  title: "MarketMeter",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <header style={{
              height: 56,
              borderBottom: '1px solid #e8e3db',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '0 2rem',
              flexShrink: 0,
            }}>
              <CoinSearch />
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
