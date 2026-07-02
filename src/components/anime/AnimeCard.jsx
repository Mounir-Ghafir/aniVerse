import { Link } from "react-router-dom"

function AnimeCard({ anime }) {
  const year = anime.year ?? (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : "—")

  return (
    <Link to={`/anime/${anime.mal_id}`} className="anime-card">
      <div className="anime-card-image-frame">
        <img src={anime.images.jpg.image_url} alt={anime.title} loading="lazy" />
        <div className="anime-card-score">{anime.score ?? "—"}</div>
      </div>
      <div className="anime-card-body">
        <div className="anime-card-title">{anime.title}</div>
        <div className="anime-card-meta">
          <span>{anime.type ?? "TV"}</span>
          <span>·</span>
          <span>{anime.episodes ? `${anime.episodes} ep` : "—"}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          <span className="tag">{year}</span>
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard
