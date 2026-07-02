import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getLibrary, addToLibrary, updateLibraryItem, removeFromLibrary } from "../services/jsonServerApi"

const STATUS_OPTIONS = [
  { value: "plan_to_watch", label: "Plan To Watch" },
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
]

function MyLibrary() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    try {
      setLoading(true)
      const data = await getLibrary()
      setItems(data)
      setError(null)
    } catch {
      setError("Failed to load your library.")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(item, nextStatus) {
    if (!item?.id) return
    setBusyId(item.id)
    try {
      const updated = await updateLibraryItem(item.id, { ...item, status: nextStatus })
      setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, ...updated } : entry)))
    } catch {
      setError("Could not update the status.")
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(item) {
    if (!item?.id) return
    setBusyId(item.id)
    try {
      await removeFromLibrary(item.id)
      setItems((prev) => prev.filter((entry) => entry.id !== item.id))
    } catch {
      setError("Could not remove this anime.")
    } finally {
      setBusyId(null)
    }
  }

  async function handleAddSample() {
    const sample = {
      anime_id: Date.now(),
      title: "Sample Anime",
      image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      score: 8.5,
      episodes: 12,
      status: "plan_to_watch",
      addedAt: new Date().toISOString(),
    }

    setBusyId("new")
    try {
      const created = await addToLibrary(sample)
      setItems((prev) => [created, ...prev])
    } catch {
      setError("Could not add anime to your library.")
    } finally {
      setBusyId(null)
    }
  }

  const filteredItems = items.filter((item) => statusFilter === "all" || item.status === statusFilter)

  if (loading) {
    return (
      <div className="section">
        <div className="section-header">
          <div className="section-title">My Library</div>
        </div>
        <div className="library-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="library-card" key={index}>
              <div className="skeleton" style={{ width: 64, height: 88, borderRadius: "var(--radius)" }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 14, width: "55%", borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: "35%", borderRadius: 4 }} />
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
        <div className="section-header">
          <div className="section-title">My Library</div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⚠</div>
          <div className="empty-state-title">Something went wrong</div>
          <div className="empty-state-desc">{error}</div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }} onClick={loadItems}>Try again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">
          My Library
          <span style={{ fontSize: 14, color: "var(--c-washi-dark)", fontFamily: "var(--font-body)", fontWeight: 400 }}>
            {items.length > 0 ? `${items.length} anime` : ""}
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleAddSample}>Add sample</button>
      </div>

      <div className="filter-row" style={{ marginBottom: 14 }}>
        <button className={`filter-pill ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>All</button>
        {STATUS_OPTIONS.map((option) => (
          <button key={option.value} className={`filter-pill ${statusFilter === option.value ? "active" : ""}`} onClick={() => setStatusFilter(option.value)}>
            {option.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <div className="empty-state-title">No library entries yet</div>
          <div className="empty-state-desc">Add anime from the details page or use the sample button to test the flow.</div>
        </div>
      ) : (
        <div className="library-grid">
          {filteredItems.map((item) => (
            <div className="library-card" key={item.id}>
              <div className="library-thumb">
                {item.image && <img src={item.image} alt={item.title} />}
              </div>
              <div className="library-info">
                <div className="library-title">{item.title}</div>
                <div className="library-meta">
                  {item.score ? <span className="score">★ {item.score}</span> : null}
                  {item.episodes ? <span>{item.episodes} episodes</span> : null}
                  {item.addedAt ? <span>Added {new Date(item.addedAt).toLocaleDateString()}</span> : null}
                </div>
                <div className="library-status">
                  <span className={`badge ${item.status === "completed" ? "badge-completed" : item.status === "watching" ? "badge-watching" : "badge-plan"}`}>
                    {STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? "Plan To Watch"}
                  </span>
                  <select
                    value={item.status ?? "plan_to_watch"}
                    onChange={(event) => handleStatusChange(item, event.target.value)}
                    disabled={busyId === item.id}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="library-actions">
                {item.anime_id ? <Link to={`/anime/${item.anime_id}`} className="btn btn-outline btn-sm">View</Link> : null}
                <button className="btn btn-outline btn-sm" style={{ color: "var(--c-beni)" }} onClick={() => handleDelete(item)} disabled={busyId === item.id}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyLibrary
