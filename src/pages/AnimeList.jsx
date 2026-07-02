import { useEffect, useState, useCallback } from "react"
import { getAnimeList, searchAnime, getAnimeByGenre, getGenres } from "../services/jikanApi"
import AnimeCard from "../components/anime/AnimeCard"

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

function AnimeList() {
  const [anime, setAnime] = useState([])
  const [genres, setGenres] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const [selectedGenreId, setSelectedGenreId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getGenres()
      .then((res) => setGenres(res.data))
      .catch(() => {})
  }, [])

  const fetchAnime = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let res
      if (selectedGenreId) {
        res = await getAnimeByGenre(selectedGenreId, currentPage)
      } else if (activeSearch) {
        res = await searchAnime(activeSearch, currentPage)
      } else {
        res = await getAnimeList(currentPage)
      }
      setAnime(res.data)
      setTotalPages(res.pagination?.last_visible_page ?? 1)
    } catch {
      setError("Failed to load anime. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [currentPage, activeSearch, selectedGenreId])

  useEffect(() => {
    fetchAnime()
  }, [fetchAnime])

  function handleSearch(e) {
    e.preventDefault()
    setSelectedGenreId(null)
    setCurrentPage(1)
    setActiveSearch(searchQuery.trim())
  }

  function handleGenreClick(genreId) {
    setActiveSearch("")
    setSearchQuery("")
    setCurrentPage(1)
    setSelectedGenreId(genreId === selectedGenreId ? null : genreId)
  }

  function handlePageClick(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">Anime list</div>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <span style={{ color: "var(--text-muted)", fontSize: 16 }}>⌕</span>
        <input
          type="text"
          placeholder="Search anime by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>

      <div className="filter-row">
        <button
          className={`filter-pill ${!selectedGenreId && !activeSearch ? "active" : ""}`}
          onClick={() => { handleGenreClick(null); setActiveSearch(""); setSearchQuery(""); setCurrentPage(1) }}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g.mal_id}
            className={`filter-pill ${selectedGenreId === g.mal_id ? "active" : ""}`}
            onClick={() => handleGenreClick(g.mal_id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="anime-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="anime-card" key={i}>
              <div className="skeleton" style={{ aspectRatio: "2/3" }} />
              <div className="anime-card-body">
                <div className="skeleton" style={{ height: 12, borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 10, borderRadius: 4, width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠</div>
          <div className="empty-state-title">Something went wrong</div>
          <div className="empty-state-desc">{error}</div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }} onClick={fetchAnime}>
            Try again
          </button>
        </div>
      ) : anime.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <div className="empty-state-title">No anime found</div>
          <div className="empty-state-desc">Try adjusting your search or filters to find what you&apos;re looking for.</div>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: 16 }}
            onClick={() => { setActiveSearch(""); setSearchQuery(""); setSelectedGenreId(null); setCurrentPage(1) }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="anime-grid">
            {anime.map((a) => (
              <AnimeCard key={a.mal_id} anime={a} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn arrow"
                disabled={currentPage === 1}
                onClick={() => handlePageClick(currentPage - 1)}
              >
                ‹
              </button>
              {getPageNumbers(currentPage, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="page-btn" style={{ border: "none", cursor: "default" }}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${p === currentPage ? "active" : ""}`}
                    onClick={() => handlePageClick(p)}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                className="page-btn arrow"
                disabled={currentPage === totalPages}
                onClick={() => handlePageClick(currentPage + 1)}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AnimeList
