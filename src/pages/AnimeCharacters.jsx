import { useParams, Link } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import { getAnimeCharacters, getAnimeById } from "../services/jikanApi"

function roleBadge(role) {
  if (role === "Main") return "badge-accent"
  if (role === "Supporting") return "badge-muted"
  return "badge-rose"
}

function AnimeCharacters() {
  const { id } = useParams()
  const { data: animeData } = useFetch(() => getAnimeById(id), [id])
  const { data: charData, loading, error } = useFetch(() => getAnimeCharacters(id), [id])

  const characters = charData?.data ?? []
  const anime = animeData?.data

  if (loading) {
    return (
      <div className="section">
        <div className="section-header">
          <div className="skeleton" style={{ height: 18, width: 300, borderRadius: 6 }} />
        </div>
        <div className="char-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="char-card" key={i}>
              <div className="skeleton" style={{ width: 64, height: 80, flexShrink: 0 }} />
              <div className="char-info">
                <div className="skeleton" style={{ height: 12, width: "60%", borderRadius: 4, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 10, width: "30%", borderRadius: 4 }} />
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
            <div className="empty-state-desc">Could not load characters. Try again later.</div>
            <Link to={`/anime/${id}`} className="btn btn-secondary btn-sm" style={{ marginTop: 16, display: "inline-flex" }}>← Back to anime</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">Characters{anime ? ` — ${anime.title}` : ""}</div>
        <Link to={`/anime/${id}`} className="btn btn-ghost btn-sm">← Back to anime</Link>
      </div>

      {characters.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <div className="empty-state-title">No characters found</div>
            <div className="empty-state-desc">No character data is available for this anime.</div>
          </div>
        </div>
      ) : (
        <div className="char-grid">
          {characters.map((entry) => (
            <Link to={`/characters/${entry.character.mal_id}`} key={entry.character.mal_id} className="char-card" style={{ textDecoration: "none" }}>
              <div className="char-avatar">
                <img src={entry.character.images.jpg.image_url} alt={entry.character.name} loading="lazy" />
              </div>
              <div className="char-info">
                <div className="char-name">{entry.character.name}</div>
                <div className="char-role"><span className={`badge ${roleBadge(entry.role)}`}>{entry.role}</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimeCharacters
