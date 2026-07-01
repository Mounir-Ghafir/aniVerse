import { Link } from "react-router-dom"

function AnimeCard({ anime }) {
  const year = anime.year ?? (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : "—")

  return (
    <Link to={`/anime/${anime.mal_id}`} className="card" style={{ textDecoration: "none" }}>
      <div className="card-img">
        <img src={anime.images.jpg.image_url} alt={anime.title} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-title">{anime.title}</div>
        <div className="card-meta">
          <span className="score">★ {anime.score ?? "—"}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          {anime.episodes && <span className="badge badge-muted">{anime.episodes} eps</span>}
          <span className="badge badge-muted">{year}</span>
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard
