import { Routes, Route } from "react-router-dom"
import Navbar from "./components/ui/Navbar"
import Landing from "./pages/Landing"
import AnimeList from "./pages/AnimeList"
import AnimeDetails from "./pages/AnimeDetails"
import AnimeCharacters from "./pages/AnimeCharacters"
import CharactersList from "./pages/CharactersList"
import CharacterProfile from "./pages/CharacterProfile"
import Favorites from "./pages/Favorites"
import MyRatings from "./pages/MyRatings"
import MyLibrary from "./pages/MyLibrary"
import Dashboard from "./pages/Dashboard"
import "./App.css"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/anime" element={<AnimeList />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/anime/:id/characters" element={<AnimeCharacters />} />
        <Route path="/characters" element={<CharactersList />} />
        <Route path="/characters/:id" element={<CharacterProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-ratings" element={<MyRatings />} />
        <Route path="/my-library" element={<MyLibrary />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
