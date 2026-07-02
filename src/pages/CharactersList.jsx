import { Link } from "react-router-dom"
import { getCharactersList } from "../services/jikanApi"
import useFetch from "../hooks/useFetch"
import { useState } from "react"

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (current > 3) pages.push("...")
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push("...")
  if (total > 1) pages.push(total)
  return pages
}

function CharactersList() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(() => getCharactersList(page), [page])

  const characters = data?.data ?? []
  const totalPages = data?.pagination?.last_visible_page ?? 1

  if (loading) {
    return (
      <div className="section">
        <div className="section-header">
          <div className="section-title">All characters</div>
        </div>
        <div className="anime-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="anime-card" key={i}>
              <div className="skeleton" style={{ aspectRatio: "2/3" }} />
              <div className="anime-card-body">
                <div className="skeleton" style={{ height: 12, borderRadius: 4 }} />
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
        <div className="empty-state">
          <div className="empty-state-icon">⚠</div>
          <div className="empty-state-title">Something went wrong</div>
          <div className="empty-state-desc">Could not load characters. Try again later.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">All characters</div>
      </div>

      {characters.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <div className="empty-state-title">No characters found</div>
          <div className="empty-state-desc">There are no characters to display right now.</div>
        </div>
      ) : (
        <>
          <div className="anime-grid">
            {characters.map((c) => (
              <Link to={`/characters/${c.mal_id}`} key={c.mal_id} className="anime-card">
                <div className="anime-card-image-frame">
                  <img src={c.images.jpg.image_url} alt={c.name} loading="lazy" />
                </div>
                <div className="anime-card-body">
                  <div className="anime-card-title">{c.name}</div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn arrow"
                disabled={page === 1}
                onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }) }}
              >‹</button>
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="page-btn" style={{ border: "none", cursor: "default" }}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? "active" : ""}`}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                  >{p}</button>
                )
              )}
              <button
                className="page-btn arrow"
                disabled={page === totalPages}
                onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }) }}
              >›</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CharactersList
