import Game from "../components/Game/Game.jsx";
import Header from "../components/Header/Header.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

function GamePage() {
  return (
    <AuthProvider>
      <Header />
      <Game />
    </AuthProvider>
  );
}

export default GamePage;