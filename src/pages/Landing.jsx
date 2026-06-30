import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTrending, getSeasonal } from "../services/jikanApi"

function Landing() {
  const [trending, setTrending] = useState([])
  const [seasonal, setSeasonal] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTrending(), getSeasonal()])
      .then(([trendRes, seasonRes]) => {
        setTrending(trendRes.data.slice(0, 6))
        setSeasonal(seasonRes.data.slice(0, 6))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="hero">
        <div className="hero-text">
          <div className="hero-eyebrow">Your anime universe</div>
          <h1 className="hero-title">Discover &amp; track<br />every <span>anime</span></h1>
          <p className="hero-desc">
            Explore thousands of anime titles, manage your personal library, rate what you watch, and follow your favorites — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/anime" className="btn btn-primary">Explore anime &rarr;</Link>
            <Link to="/my-library" className="btn btn-secondary">My library</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card" style={{ borderColor: "rgba(43,116,224,0.3)", fontSize: 11, color: "var(--accent)" }}>
            Featured anime
          </div>
          <div className="hero-card" />
          <div className="hero-card" />
          <div className="hero-card" />
          <div className="hero-card" />
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Trending now</div>
          <Link to="/anime" className="btn btn-ghost btn-sm">View all &rarr;</Link>
        </div>
        {loading ? (
          <div style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>Loading...</div>
        ) : (
          <div className="anime-grid">
            {trending.map((anime) => (
              <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="card" style={{ textDecoration: "none" }}>
                <div className="card-img">
                  <img src={anime.images.jpg.image_url} alt={anime.title} />
                </div>
                <div className="card-body">
                  <div className="card-title">{anime.title}</div>
                  <div className="card-meta">
                    <span className="score">&starf; {anime.score}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="section-title">This season</div>
        </div>
        {loading ? null : (
          <div className="anime-grid">
            {seasonal.map((anime) => (
              <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="card" style={{ textDecoration: "none" }}>
                <div className="card-img">
                  <img src={anime.images.jpg.image_url} alt={anime.title} />
                </div>
                <div className="card-body">
                  <div className="card-title">{anime.title}</div>
                  <div className="card-meta">
                    <span className="score">&starf; {anime.score}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Landing
