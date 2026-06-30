import { JSON_SERVER_BASE } from "../utils/constants"

export async function getFavorites() {
  const res = await fetch(`${JSON_SERVER_BASE}/favorites`)
  if (!res.ok) throw new Error(`Failed to fetch favorites: ${res.status}`)
  return res.json()
}

export async function addFavorite(item) {
  const res = await fetch(`${JSON_SERVER_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to add favorite: ${res.status}`)
  return res.json()
}

export async function removeFavorite(id) {
  const res = await fetch(`${JSON_SERVER_BASE}/favorites/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error(`Failed to remove favorite: ${res.status}`)
  return res.json()
}

export async function getRatings() {
  const res = await fetch(`${JSON_SERVER_BASE}/rating`)
  if (!res.ok) throw new Error(`Failed to fetch ratings: ${res.status}`)
  return res.json()
}

export async function addRating(item) {
  const res = await fetch(`${JSON_SERVER_BASE}/rating`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to add rating: ${res.status}`)
  return res.json()
}

export async function updateRating(id, item) {
  const res = await fetch(`${JSON_SERVER_BASE}/rating/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to update rating: ${res.status}`)
  return res.json()
}

export async function removeRating(id) {
  const res = await fetch(`${JSON_SERVER_BASE}/rating/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error(`Failed to remove rating: ${res.status}`)
  return res.json()
}

export async function getLibrary() {
  const res = await fetch(`${JSON_SERVER_BASE}/library`)
  if (!res.ok) throw new Error(`Failed to fetch library: ${res.status}`)
  return res.json()
}

export async function addToLibrary(item) {
  const res = await fetch(`${JSON_SERVER_BASE}/library`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to add to library: ${res.status}`)
  return res.json()
}

export async function updateLibraryItem(id, item) {
  const res = await fetch(`${JSON_SERVER_BASE}/library/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to update library item: ${res.status}`)
  return res.json()
}

export async function removeFromLibrary(id) {
  const res = await fetch(`${JSON_SERVER_BASE}/library/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error(`Failed to remove from library: ${res.status}`)
  return res.json()
}
