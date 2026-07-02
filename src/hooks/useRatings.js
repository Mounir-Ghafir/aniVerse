import { useEffect, useState, useCallback } from "react"
import { getRatings, addRating, updateRating, removeRating } from "../services/jsonServerApi"

function useRatings() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getRatings()
      .then(setRatings)
      .catch(() => setError("Failed to load ratings."))
      .finally(() => setLoading(false))
  }, [])

  const add = useCallback(async (ratingData) => {
    try {
      const result = await addRating(ratingData)
      setRatings((prev) => [...prev, result])
      return result
    } catch (err) {
      throw err
    }
  }, [])

  const update = useCallback(async (id, ratingData) => {
    try {
      const result = await updateRating(id, ratingData)
      setRatings((prev) => prev.map((r) => (r.id === id ? result : r)))
      return result
    } catch (err) {
      throw err
    }
  }, [])

  const remove = useCallback(async (id) => {
    try {
      await removeRating(id)
      setRatings((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      throw err
    }
  }, [])

  return { ratings, loading, error, add, update, remove }
}

export default useRatings
