# AniVerse — Connected React Application to APIs

A React application that allows users to explore an anime catalog via an external API, featuring multi-page navigation, search, filtering, personal library management, and user data persistence via JSON Server.

## Project Context

**AniVerse** is a web application that enables users to discover and organize their personal anime universe using an external API.

In a market where entertainment platforms offer thousands of titles, users want to easily explore available anime, access detailed information, and manage their own collections.

The objective of this project is to develop a React Single Page Application (SPA) capable of:

* Consuming an external API (Jikan API)
* Navigating between multiple pages (Routing)
* Displaying data dynamically
* Managing asynchronous states (loading, errors)
* Manipulating a local REST API via JSON Server
* Managing a personal library (favorites, ratings, watch tracking)

---

## Features

### 1. Landing Page (`/`)

Display a home page containing:

* **Hero Section:**
* Application title
* Short description
* "Explore Anime" button $\rightarrow$ `/anime`


* **Trending Anime:** Display 6 popular anime retrieved from the API showing:
* Image, title, and score
* *Interaction:* Clicking an anime $\rightarrow$ `/anime/{anime_id}`


* **Seasonal Anime:** Display 6 anime from the current season showing:
* Image, title, and score



### 2. Anime List (`/anime`)

Display anime as cards featuring: image, title, score, number of episodes, and release year.

* **Pagination:** Navigation between pages (`page=1,2,3...`)
* **Search:** Search by anime name.
* **Filters:** Filter by genre.
* *Interaction:* Clicking an anime $\rightarrow$ `/anime/{anime_id}`

### 3. Anime Details (`/anime/{anime_id}`)

Display complete information for a specific anime: title, image, synopsis, score, release date, genres, studios, number of episodes, and trailer (if available).

* *Interactions:* Add to favorites, add personal notes, assign a rating (1 to 10), or add to the personal library.
* *Navigation:* A "View Characters" button $\rightarrow$ `/anime/{anime_id}/characters`

### 4. Anime Characters (`/anime/{anime_id}/characters`)

Display characters associated with the anime: image, name, and role (Main, Supporting...).

* *Interaction:* Clicking a character $\rightarrow$ `/characters/{character_id}`

### 5. Characters List (`/characters`)

Display a list of characters featuring their image and name.

* *Interaction:* Clicking a character $\rightarrow$ `/characters/{character_id}`

### 6. Character Profile (`/characters/{character_id}`)

Display detailed character information: image, name, description, and associated anime (if available).

### 7. Favorites Management (`/favorites`)

Users can add an anime to favorites, remove it from favorites, and view their favorites list.

* **Persistence:** Data must be stored via JSON Server.

### 8. Personal Ratings and Reviews (`/my-ratings`)

Users can assign a rating between 1 and 10, add a personal note, edit an existing rating, or delete a rating.

* **Persistence:** Data must be stored via JSON Server.

### 9. Personal Library (`/my-library`)

Users can add an anime to their personal library. Each anime must have one of the following statuses: *Plan To Watch*, *Watching*, or *Completed*.

* **Features:** Add an anime, modify its status, delete an anime, and filter anime by status.
* **Persistence:** Data must be stored via JSON Server.

### 10. Dashboard (`/dashboard`)

Display statistics based on the user's personal data:

* Total number of favorites
* Number of completed anime
* Average rating given
* Most represented genre in favorites

### 11. Interface Organization

* **Navbar:** Home (`/`), Anime (`/anime`), Characters (`/characters`), Favorites (`/favorites`), My Library (`/my-library`), Dashboard (`/dashboard`).
* **Main Pages:** Landing Page, Anime List, Anime Details, Anime Characters, Character List, Character Profile, Favorites, Personal Ratings, Personal Library, Dashboard.

### 12. Asynchronous State Management

For every API call (both Jikan API and JSON Server):

* Display a loading state
* Handle errors
* Handle empty results/no-data use cases

---

## Pedagogical Terms & Evaluation

### Organization

* **Format:** Individual work.
* **Duration:** 5 days.
* **Project Launch:** June 29, 2026.
* **Submission Deadline:** To be determined (before 11:59 PM). Late submissions will not be accepted. Final push to GitHub must be done before the deadline.

### Evaluation Breakdown (40 Minutes Total)

* **10 mins:** Presentation (Planning + Application demo + Commit history log)
* **10 mins:** Code explanation
* **10 mins:** Live scenario/use-case testing
* **10 mins:** Web culture Q&A session

### Deliverables

* Trello planning link
* Presentation link
* GitHub repository link
* Figma design link

### Performance Criteria

* Ability to correctly consume an external API (Jikan)
* Ability to manipulate a local REST API (JSON Server)
* Understanding of routing with React Router
* Side effect management using `useEffect`
* Management of CRUD operations
* Dynamic data rendering (`map`, conditional rendering)
* Asynchronous state management (`loading`, `errors`)
* State management using Redux or the Context API
* Clear application structure
* Quality of UX and navigation

---

## Links

* **Jikan Documentation:** [https://jikan.moe/](https://jikan.moe/)
* **API Endpoint:** [https://api.jikan.moe/v4/](https://api.jikan.moe/v4/)
