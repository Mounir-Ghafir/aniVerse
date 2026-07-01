import { useParams, Link } from "react-router-dom"
import { getCharacterById } from "../services/jikanApi"
import useFetch from "../hooks/useFetch"

function CharacterProfile() {
  const { id } = useParams()
  const { data, loading, error } = useFetch(() => getCharacterById(id), [id])

  const character = data?.data

  if (loading) {
    return (
      <div className="section">
        <div className="char-profile-hero">
          <div className="skeleton" style={{ aspectRatio: "3/4", borderRadius: "var(--radius-lg)" }} />
          <div>
            <div className="skeleton" style={{ height: 26, width: "50%", borderRadius: 6, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 13, width: "30%", borderRadius: 4, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 80, borderRadius: 6 }} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="section">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: "var(--rose)" }}>⚠</div>
            <div className="empty-state-title">Something went wrong</div>
            <div className="empty-state-desc">{error ?? "Could not load character details."}</div>
            <Link to="/characters" className="btn btn-secondary btn-sm" style={{ marginTop: 16, display: "inline-flex" }}>Back to characters</Link>
          </div>
        </div>
      </div>
    )
  }

  const mainAnime = character.anime?.[0]

  return (
    <>
      <div className="char-profile-hero">
        <div className="char-profile-img">
          <img src={character.images.jpg.image_url} alt={character.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <div className="char-profile-name">{character.name}</div>
          {character.name_kanji && <div className="char-profile-jp">{character.name_kanji}</div>}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {mainAnime && <span className="badge badge-accent">{mainAnime.role}</span>}
            {mainAnime && <span className="badge badge-muted">{mainAnime.anime.title}</span>}
          </div>
          <p className="char-desc">{character.about ?? "No description available."}</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="sidebar-block-title" style={{ marginBottom: 12 }}>Appears in</div>
        {character.anime?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {character.anime.map((entry) => (
              <Link
                key={entry.anime.mal_id}
                to={`/anime/${entry.anime.mal_id}`}
                style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-elevated)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", textDecoration: "none" }}
              >
                <div style={{ width: 36, height: 50, background: "var(--bg-card)", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                  <img src={entry.anime.images.jpg.image_url} alt={entry.anime.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{entry.anime.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {entry.anime.type ?? "Anime"}
                    {entry.anime.episodes ? ` · ${entry.anime.episodes} episodes` : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>No anime appearances recorded.</div>
        )}
      </div>
    </>
  )
}

export default CharacterProfile
