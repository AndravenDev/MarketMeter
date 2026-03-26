interface NewsItem {
  article_id: string
  title: string
  link: string
  source_name: string
  pubDate: string
  description: string | null
  keywords: string[] | null
  image_url: string | null
  category: string[] | null
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
    <section style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Market Analysis
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item) => (
          <li key={item.article_id}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt=""
                  style={{ display: 'block', width: '200px', flexShrink: 0, objectFit: 'cover', alignSelf: 'stretch' }}
                />
              ) : (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '200px',
                  flexShrink: 0,
                  background: '#f0ebe4',
                  borderRight: '1.5px solid #e8e3db',
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c4bfb8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                </span>
              )}
              <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem 1.25rem', gap: '0.35rem', flex: 1, minWidth: 0 }}>
                {item.category && item.category.length > 0 && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f59e0b' }}>
                    {item.category[0]}
                  </span>
                )}
                <span style={{ display: 'block', color: '#292524', fontWeight: 700, lineHeight: 1.4, fontSize: '1rem' }}>
                  {item.title}
                </span>
                {item.description && (
                  <span style={{ display: 'block', fontSize: '0.83rem', color: '#a8a29e', lineHeight: 1.55 }}>
                    {item.description.slice(0, 140)}{item.description.length > 140 ? '…' : ''}
                  </span>
                )}
                <span style={{ display: 'flex', marginTop: '0.4rem', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: '#c4bfb8' }}>
                  <span style={{ fontWeight: 600, color: '#a8a29e' }}>{item.source_name}</span>
                  <span>·</span>
                  <span>{new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
                <span style={{ marginTop: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b' }}>
                  Read Full Report →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        .news-card {
          display: flex;
          border-radius: 10px;
          border: 1.5px solid #e8e3db;
          background: #ffffff;
          text-decoration: none;
          overflow: hidden;
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
