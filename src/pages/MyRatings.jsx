import { useState } from "react"
import { Link } from "react-router-dom"
import useRatings from "../hooks/useRatings"
import "../styles/ratings.css"

function MyRatings() {
  const { ratings, loading, error, add, update, remove } = useRatings()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ anime_id: "", title: "", image: "", rating: 5, note: "" })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  function handleOpenForm() {
    setEditingId(null)
    setFormData({ anime_id: "", title: "", image: "", rating: 5, note: "" })
    setFormError(null)
    setShowForm(true)
  }

  function handleEditRating(rating) {
    setEditingId(rating.id)
    setFormData({
      anime_id: rating.anime_id,
      title: rating.title,
      image: rating.image,
      rating: rating.rating,
      note: rating.note || "",
    })
    setFormError(null)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return

    if (!formData.title || formData.title.trim() === "") {
      setFormError("Anime title is required")
      return
    }
    if (formData.rating < 1 || formData.rating > 10) {
      setFormError("Rating must be between 1 and 10")
      return
    }

    setSubmitting(true)
    try {
      if (editingId) {
        await update(editingId, {
          anime_id: formData.anime_id,
          title: formData.title,
          image: formData.image,
          rating: formData.rating,
          note: formData.note,
          updatedAt: new Date().toISOString(),
        })
      } else {
        await add({
          anime_id: formData.anime_id,
          title: formData.title,
          image: formData.image,
          rating: formData.rating,
          note: formData.note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
      handleCloseForm()
    } catch (err) {
      setFormError(err.message || "Failed to save rating")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (submitting) return
    if (!confirm("Are you sure you want to delete this rating?")) return

    setSubmitting(true)
    try {
      await remove(id)
    } catch (err) {
      alert(err.message || "Failed to delete rating")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="section">
        <div className="section-header">
          <div className="section-title">My Ratings & Reviews</div>
        </div>
        <div className="rating-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="rating-card" key={i}>
              <div className="skeleton" style={{ width: 56, height: 80, borderRadius: "var(--radius)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 16, width: "50%", borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "30%", borderRadius: 4, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 12, width: "80%", borderRadius: 4 }} />
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
          <div className="empty-state-desc">{error}</div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>Try again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">
          My Ratings & Reviews
          <span style={{ fontSize: 14, color: "var(--c-washi-dark)", fontFamily: "var(--font-body)", fontWeight: 400 }}>
            {ratings.length > 0 ? `${ratings.length} rated` : ""}
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenForm}>Add Rating</button>
      </div>

      {ratings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">★</div>
          <div className="empty-state-title">No ratings yet</div>
          <div className="empty-state-desc">Start rating anime to see your reviews here.</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 16, display: "inline-flex" }} onClick={handleOpenForm}>Add your first rating</button>
        </div>
      ) : (
        <div className="rating-list">
          {ratings.map((item) => (
            <div className="rating-card" key={item.id}>
              <div className="rating-thumb">
                {item.image && <img src={item.image} alt={item.title} />}
              </div>
              <div className="rating-info">
                <div className="rating-title">{item.title}</div>
                <div className="rating-score">★ {item.rating} / 10</div>
                {item.note && <div className="rating-note">"{item.note}"</div>}
                <div className="rating-meta">
                  {item.createdAt && <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>}
                  {item.updatedAt && item.updatedAt !== item.createdAt && (
                    <span>• Edited {new Date(item.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="rating-actions">
                {item.anime_id && <Link to={`/anime/${item.anime_id}`} className="btn btn-outline btn-sm">View</Link>}
                <button className="btn btn-outline btn-sm" onClick={() => handleEditRating(item)} disabled={submitting}>Edit</button>
                <button className="btn btn-outline btn-sm" style={{ color: "var(--c-beni)" }} onClick={() => handleDelete(item.id)} disabled={submitting}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="rating-modal" onClick={handleCloseForm}>
          <form className="rating-form-box" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <div className="rating-form-title">
              {editingId ? "Edit Rating" : "Add New Rating"}
            </div>

            {formError && (
              <div style={{ padding: "10px 12px", background: "rgba(190, 60, 60, 0.1)", border: "1px solid var(--c-beni)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--c-beni)", marginBottom: 16 }}>
                {formError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Anime Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter anime title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL (optional)</label>
              <input
                type="url"
                className="form-input"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <div className="rating-slider">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                />
                <div className="rating-value">{formData.rating}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Review Notes (optional)</label>
              <textarea
                className="form-textarea"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Share your thoughts about this anime..."
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCloseForm} disabled={submitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : editingId ? "Update Rating" : "Add Rating"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default MyRatings
