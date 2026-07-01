import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getFavorites, removeFavorite } from "../services/jsonServerApi"

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => setError("Failed to load favorites."))
      .finally(() => setLoading(false))
  }, [])

  async function handleRemove(item) {
    if (busy) return
    setBusy(true)
    try {
      await removeFavorite(item.id)
      setFavorites((prev) => prev.filter((f) => f.id !== item.id))
    } catch { /* ignore */ } finally { setBusy(false) }
  }

  if (loading) {
    return (
      <div className="section">
        <div className="section-header">
          <div className="skeleton" style={{ height: 18, width: 200, borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="fav-card" key={i}>
              <div className="skeleton" style={{ width: 48, height: 68, borderRadius: "var(--radius-sm)", flexShrink: 0 }} />
              <div className="fav-info">
                <div className="skeleton" style={{ height: 14, width: "60%", borderRadius: 4, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 12, width: "40%", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: "var(--rose)" }}>⚠</div>
            <div className="empty-state-title">Something went wrong</div>
            <div className="empty-state-desc">{error}</div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>Try again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">
          Your favorites
          <span style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 400 }}>
            {favorites.length > 0 ? `${favorites.length} anime` : ""}
          </span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">♥</div>
            <div className="empty-state-title">No favorites yet</div>
            <div className="empty-state-desc">Browse anime and add some to your favorites to see them here.</div>
            <Link to="/anime" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: "inline-flex" }}>Explore anime</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {favorites.map((item) => (
            <div className="fav-card" key={item.id}>
              <div className="fav-thumb">
                {item.image && <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div className="fav-info">
                <div className="fav-title">{item.title}</div>
                <div className="fav-meta">
                  {item.score && <span className="score">★ {item.score}</span>}
                  {item.addedAt && <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="fav-actions">
                <Link to={`/anime/${item.anime_id}`} className="btn btn-ghost btn-sm">View</Link>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--rose)" }} onClick={() => handleRemove(item)} disabled={busy}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
