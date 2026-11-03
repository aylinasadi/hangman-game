import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import GameOver from "./pages/GameOver";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/game-over" element={<GameOver />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}