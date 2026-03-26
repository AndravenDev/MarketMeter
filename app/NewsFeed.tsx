interface NewsItem {
  article_id: string
  title: string
  link: string
  source_name: string
  pubDate: string
  description: string | null
  keywords: string[] | null
}

export default async function NewsFeed() {
  const res = await fetch(
    `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_API_KEY}&q=crypto&language=en`,
    { next: { revalidate: 300 } },
  )

  if (!res.ok) {
    console.error('Newsdata error:', res.status, await res.text())
    return <p style={{ color: '#a8a29e' }}>News unavailable.</p>
  }

  const data = await res.json()
  const seen = new Set<string>()
  const items: NewsItem[] = (data.results ?? []).filter((item: NewsItem) => {
    if (seen.has(item.article_id)) return false
    seen.add(item.article_id)
    return true
  })

  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Latest Crypto News
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map((item) => (
          <li key={item.article_id}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
            >
              <span style={{ display: 'block', color: '#292524', fontWeight: 600, lineHeight: 1.45, fontSize: '0.95rem' }}>
                {item.title}
              </span>
              {item.description && (
                <span style={{ display: 'block', marginTop: '0.3rem', fontSize: '0.82rem', color: '#a8a29e', lineHeight: 1.5 }}>
                  {item.description.slice(0, 140)}{item.description.length > 140 ? '…' : ''}
                </span>
              )}
              <span style={{ display: 'flex', marginTop: '0.5rem', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: '#c4bfb8' }}>
                <span style={{ fontWeight: 600, color: '#a8a29e' }}>{item.source_name}</span>
                <span>·</span>
                <span>{new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        .news-card {
          display: block;
          padding: 0.9rem 1.1rem;
          border-radius: 10px;
          border: 1.5px solid #e8e3db;
          background: #ffffff;
          text-decoration: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .news-card:hover {
          border-color: #f59e0b;
          box-shadow: 0 2px 8px rgba(245,158,11,0.15);
        }
      `}</style>
    </section>
  )
}
