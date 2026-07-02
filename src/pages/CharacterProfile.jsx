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
          <div className="skeleton" style={{ aspectRatio: "3/4", borderRadius: "var(--radius)" }} />
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
        <div className="empty-state">
          <div className="empty-state-icon">⚠</div>
          <div className="empty-state-title">Something went wrong</div>
          <div className="empty-state-desc">{error ?? "Could not load character details."}</div>
          <Link to="/characters" className="btn btn-outline btn-sm" style={{ marginTop: 16, display: "inline-flex" }}>Back to characters</Link>
        </div>
      </div>
    )
  }

  const mainAnime = character.anime?.[0]

  return (
    <>
      <div className="char-profile-hero">
        <div className="char-profile-img">
          <img src={character.images.jpg.image_url} alt={character.name} />
        </div>
        <div>
          <div className="char-profile-name">{character.name}</div>
          {character.name_kanji && <div className="char-profile-jp">{character.name_kanji}</div>}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {mainAnime && <span className="badge badge-favorite">{mainAnime.role}</span>}
            {mainAnime && <span className="tag">{mainAnime.anime.title}</span>}
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
                className="char-appears-item"
              >
                <div className="char-appears-thumb">
                  <img src={entry.anime.images.jpg.image_url} alt={entry.anime.title} />
                </div>
                <div>
                  <div className="char-appears-title">{entry.anime.title}</div>
                  <div className="char-appears-meta">
                    {entry.anime.type ?? "Anime"}
                    {entry.anime.episodes ? ` · ${entry.anime.episodes} episodes` : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "var(--c-washi-dark)" }}>No anime appearances recorded.</div>
        )}
      </div>
    </>
  )
}

export default CharacterProfile
