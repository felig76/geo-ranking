import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from "./pages/GamePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;