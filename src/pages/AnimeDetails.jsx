import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getAnimeById } from "../services/jikanApi"
import {
  getFavorites, addFavorite, removeFavorite,
  getRatings, addRating, updateRating, removeRating,
  getLibrary, addToLibrary, updateLibraryItem, removeFromLibrary,
} from "../services/jsonServerApi"
import useFetch from "../hooks/useFetch"

function AnimeDetails() {
  const { id } = useParams()
  const { data: animeData, loading, error } = useFetch(() => getAnimeById(id), [id])
  const anime = animeData?.data

  const [favorites, setFavorites] = useState([])
  const [ratings, setRatings] = useState([])
  const [library, setLibrary] = useState([])
  const [ratingScore, setRatingScore] = useState(0)
  const [ratingNote, setRatingNote] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("plan_to_watch")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Promise.all([getFavorites(), getRatings(), getLibrary()])
      .then(([favs, rats, lib]) => {
        setFavorites(favs)
        setRatings(rats)
        setLibrary(lib)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!anime) return
    const existing = ratings.find((r) => r.anime_id === anime.mal_id)
    if (existing) {
      setRatingScore(existing.score)
      setRatingNote(existing.note ?? "")
    } else {
      setRatingScore(0)
      setRatingNote("")
    }
    const libItem = library.find((l) => l.anime_id === anime.mal_id)
    if (libItem) setSelectedStatus(libItem.status)
  }, [anime, ratings, library])

  const isFavorited = favorites.some((f) => f.anime_id === anime?.mal_id)
  const existingRating = ratings.find((r) => r.anime_id === anime?.mal_id)
  const existingLibrary = library.find((l) => l.anime_id === anime?.mal_id)

  async function handleToggleFavorite() {
    if (!anime || busy) return
    setBusy(true)
    try {
      if (isFavorited) {
        const fav = favorites.find((f) => f.anime_id === anime.mal_id)
        if (fav?.id) await removeFavorite(fav.id)
        setFavorites((prev) => prev.filter((f) => f.anime_id !== anime.mal_id))
      } else {
        const item = { anime_id: anime.mal_id, title: anime.title, image: anime.images.jpg.image_url, score: anime.score, addedAt: new Date().toISOString() }
        const saved = await addFavorite(item)
        setFavorites((prev) => [...prev, saved])
      }
    } catch { /* ignore */ } finally { setBusy(false) }
  }

  async function handleSaveRating() {
    if (!anime || busy || ratingScore === 0) return
    setBusy(true)
    try {
      const item = { anime_id: anime.mal_id, title: anime.title, image: anime.images.jpg.image_url, score: ratingScore, note: ratingNote }
      if (existingRating) {
        const updated = await updateRating(existingRating.id, { ...item, createdAt: existingRating.createdAt, updatedAt: new Date().toISOString() })
        setRatings((prev) => prev.map((r) => r.anime_id === anime.mal_id ? { ...r, ...updated } : r))
      } else {
        const saved = await addRating({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
        setRatings((prev) => [...prev, saved])
      }
    } catch { /* ignore */ } finally { setBusy(false) }
  }

  async function handleDeleteRating() {
    if (!anime || busy || !existingRating) return
    setBusy(true)
    try {
      await removeRating(existingRating.id)
      setRatings((prev) => prev.filter((r) => r.anime_id !== anime.mal_id))
      setRatingScore(0)
      setRatingNote("")
    } catch { /* ignore */ } finally { setBusy(false) }
  }

  async function handleLibraryAction() {
    if (!anime || busy) return
    setBusy(true)
    try {
      const item = { anime_id: anime.mal_id, title: anime.title, image: anime.images.jpg.image_url, score: anime.score, episodes: anime.episodes, status: selectedStatus, addedAt: new Date().toISOString() }
      if (existingLibrary) {
        const updated = await updateLibraryItem(existingLibrary.id, item)
        setLibrary((prev) => prev.map((l) => l.anime_id === anime.mal_id ? { ...l, ...updated } : l))
      } else {
        const saved = await addToLibrary(item)
        setLibrary((prev) => [...prev, saved])
      }
    } catch { /* ignore */ } finally { setBusy(false) }
  }

  async function handleRemoveFromLibrary() {
    if (!anime || busy || !existingLibrary) return
    setBusy(true)
    try {
      await removeFromLibrary(existingLibrary.id)
      setLibrary((prev) => prev.filter((l) => l.anime_id !== anime.mal_id))
      setSelectedStatus("plan_to_watch")
    } catch { /* ignore */ } finally { setBusy(false) }
  }

  if (loading) {
    return (
      <div className="section">
        <div className="details-hero">
          <div className="skeleton" style={{ aspectRatio: "3/4", borderRadius: "var(--radius-lg)" }} />
          <div>
            <div className="skeleton" style={{ height: 28, width: "60%", borderRadius: 6, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, width: "40%", borderRadius: 4, marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 80, borderRadius: 6 }} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="section">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: "var(--rose)" }}>⚠</div>
            <div className="empty-state-title">Something went wrong</div>
            <div className="empty-state-desc">{error ?? "Could not load anime details."}</div>
            <Link to="/anime" className="btn btn-secondary btn-sm" style={{ marginTop: 16, display: "inline-flex" }}>Back to anime list</Link>
          </div>
        </div>
      </div>
    )
  }

  const year = anime.year ?? (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : "—")

  return (
    <>
      <div className="details-hero">
        <div className="details-poster">
          <img src={anime.images.jpg.large_image_url ?? anime.images.jpg.image_url} alt={anime.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="details-info">
          <div style={{ marginBottom: 8 }}>
            <span className="badge badge-accent">{anime.type ?? "TV"}</span>
            &nbsp;
            <span className={`badge ${anime.status === "Finished Airing" ? "badge-teal" : "badge-amber"}`}>{anime.status}</span>
          </div>
          <div className="details-title">{anime.title}</div>
          {anime.title_japanese && <div className="details-title-jp">{anime.title_japanese}</div>}
          <div className="details-tags">
            {anime.genres?.map((g) => (
              <span key={g.mal_id} className="badge badge-muted">{g.name}</span>
            ))}
          </div>
          <div className="details-stats">
            <div className="stat">
              <div className="stat-value amber">{anime.score ?? "—"}</div>
              <div className="stat-label">Score</div>
            </div>
            <div className="stat">
              <div className="stat-value">{anime.episodes ?? "?"}</div>
              <div className="stat-label">Episodes</div>
            </div>
            <div className="stat">
              <div className="stat-value teal">{year}</div>
              <div className="stat-label">Year</div>
            </div>
            {anime.rank && (
              <div className="stat">
                <div className="stat-value">#{anime.rank}</div>
                <div className="stat-label">Rank</div>
              </div>
            )}
          </div>
          <p className="synopsis">{anime.synopsis ?? "No synopsis available."}</p>
          <div className="details-actions">
            <button className={`btn ${isFavorited ? "btn-ghost" : "btn-primary"}`} onClick={handleToggleFavorite} disabled={busy}>
              {isFavorited ? "♥ Remove from favorites" : "♡ Add to favorites"}
            </button>
            <button className="btn btn-teal" onClick={handleLibraryAction} disabled={busy}>
              {existingLibrary ? "+ Update library" : "+ Add to library"}
            </button>
            <Link to={`/anime/${anime.mal_id}/characters`} className="btn btn-secondary">View characters →</Link>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {anime.trailer?.embed_url && (
            <div style={{ marginBottom: 24 }}>
              <div className="section-title" style={{ fontSize: 15, marginBottom: 14 }}>Trailer</div>
              <div className="trailer-block" style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe
                  src={anime.trailer.embed_url}
                  title="Trailer"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: "var(--radius-lg)" }}
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="rating-widget">
            <div className="rating-label">Your rating</div>
            <div className="rating-stars">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < ratingScore ? "" : "empty"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setRatingScore(i + 1)}
                >
                  ★
                </span>
              ))}
              <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 700, color: "var(--amber)" }}>
                {ratingScore || "—"} / 10
              </span>
            </div>
            <div className="rating-note">
              <div className="rating-label">Personal note</div>
              <textarea
                placeholder="Write your thoughts about this anime..."
                value={ratingNote}
                onChange={(e) => setRatingNote(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={handleSaveRating} disabled={busy || ratingScore === 0}>
                {existingRating ? "Update rating" : "Save rating"}
              </button>
              {existingRating && (
                <button className="btn btn-ghost btn-sm" onClick={handleDeleteRating} disabled={busy}>Delete</button>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-block">
            <div className="sidebar-block-title">Information</div>
            {anime.studios?.length > 0 && (
              <div className="info-row">
                <span className="info-key">Studio</span>
                <span className="info-val">{anime.studios.map((s) => s.name).join(", ")}</span>
              </div>
            )}
            {anime.aired?.string && (
              <div className="info-row">
                <span className="info-key">Aired</span>
                <span className="info-val">{anime.aired.string}</span>
              </div>
            )}
            {anime.source && (
              <div className="info-row">
                <span className="info-key">Source</span>
                <span className="info-val">{anime.source}</span>
              </div>
            )}
            {anime.duration && (
              <div className="info-row">
                <span className="info-key">Duration</span>
                <span className="info-val">{anime.duration}</span>
              </div>
            )}
            {anime.rating && (
              <div className="info-row">
                <span className="info-key">Rating</span>
                <span className="info-val">{anime.rating}</span>
              </div>
            )}
          </div>

          <div className="sidebar-block">
            <div className="sidebar-block-title">Your library status</div>
            <select
              className="status-select"
              style={{ width: "100%", marginBottom: 8 }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="plan_to_watch">Plan to watch</option>
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={handleLibraryAction} disabled={busy}>
              {existingLibrary ? "Update status" : "Add to library"}
            </button>
            {existingLibrary && (
              <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 6, color: "var(--rose)" }} onClick={handleRemoveFromLibrary} disabled={busy}>
                Remove from library
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AnimeDetails
