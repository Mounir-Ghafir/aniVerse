import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTrending, getSeasonal } from "../services/jikanApi"
import AnimeCard from "../components/anime/AnimeCard"

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
        <svg className="hero-wave" viewBox="0 0 1200 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,90 C150,40 250,130 400,80 C550,30 650,120 800,70 C950,20 1050,110 1200,60 L1200,140 L0,140 Z" fill="#12233F"/>
          <path d="M0,110 C180,70 300,140 450,100 C600,60 700,130 850,90 C1000,50 1100,120 1200,90 L1200,140 L0,140 Z" fill="#1D3557"/>
        </svg>
        <div className="hero-content">
          <h1 className="hero-title">AniVerse</h1>
          <div className="hero-actions">
            <Link to="/anime" className="btn btn-primary">Explore Anime →</Link>
            <Link to="/my-library" className="btn btn-outline">My Library</Link>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Trending now</div>
          <Link to="/anime" className="btn btn-outline btn-sm">View all →</Link>
        </div>
        {loading ? (
          <div style={{ color: "var(--c-washi-dark)", textAlign: "center", padding: 40 }}>Loading...</div>
        ) : (
          <div className="anime-grid">
            {trending.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
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
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Landing
