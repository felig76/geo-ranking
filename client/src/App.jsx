import { useState, useEffect } from "react";
import "./App.css"
import axios from "axios";

function App() {
  const [gameConfig, setGameConfig] = useState(null);
  const [data, setData] = useState([]);
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/game")
      .then(response => setGameConfig(response.data))
      .catch(error => console.error("Error al obtener la configuración del juego:", error));

    axios.get("http://localhost:3001/data")
      .then(response => setData(response.data))
      .catch(error => console.error("Error al obtener los datos:", error));
  }, []);

  const revealNext = () => {
    e.preventDefault();
    if (revealed.length < data.length) {
      setRevealed([...revealed, revealed.length]);
    }
  };

  return (
    <div>
      <h1 id="title">Geo Ranking</h1>
      <div id="game">
        <h3>{gameConfig?.title || "Cargando..."}</h3>
        <ul className="list">
          {data.map((item, index) => (
            <li key={index} className={`list-item ${revealed.includes(index) ? "revealed" : "hidden"}`}>
              {revealed.includes(index) ? `${item.country}: ${item.value.toLocaleString()} km²` : ""}
            </li>
          ))}
        </ul>
        <form id="guessInput">
          <input id="countryInput" type="text" />
          <button type="submit" onClick={revealNext} disabled={revealed.length >= data.length}>
            Guess
          </button>
        </form>
      </div>
    </div>
    
  );
}

export default App;
