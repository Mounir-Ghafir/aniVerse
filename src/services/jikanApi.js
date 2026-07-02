import { JIKAN_BASE } from "../utils/constants"

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`)
  return res.json()
}

export function getTrending() {
  return fetchJson(`${JIKAN_BASE}/top/anime?filter=bypopularity`)

}

export function getSeasonal() {
  return fetchJson(`${JIKAN_BASE}/seasons/now`)
}

export function getAnimeList(page = 1) {
  return fetchJson(`${JIKAN_BASE}/anime?page=${page}&limit=24`)
}

export function searchAnime(query, page = 1) {
  return fetchJson(`${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=24`)
}

export function getAnimeByGenre(genreId, page = 1) {
  return fetchJson(`${JIKAN_BASE}/anime?genres=${genreId}&page=${page}&limit=24`)
}

export function getAnimeById(id) {
  return fetchJson(`${JIKAN_BASE}/anime/${id}`)
}

export function getAnimeCharacters(id) {
  return fetchJson(`${JIKAN_BASE}/anime/${id}/characters`)
}

export function getCharactersList(page = 1) {
  return fetchJson(`${JIKAN_BASE}/characters?order_by=favorites&sort=desc&page=${page}&limit=24`)
}

export function getCharacterById(id) {
  return fetchJson(`${JIKAN_BASE}/characters/${id}`)
}

export function getGenres() {
  return fetchJson(`${JIKAN_BASE}/genres/anime`)
}
