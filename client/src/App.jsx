import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [gameTitle, setGameTitle] = useState("Cargando...");
  const [unit, setUnit] = useState("");
  const [data, setData] = useState([]); // Lista de países del ranking
  const [countriesList, setCountriesList] = useState([]); // Lista completa de países
  const [filteredCountries, setFilteredCountries] = useState([]); // Sugerencias filtradas
  const [revealed, setRevealed] = useState([]); // Índices de países adivinados
  const [revealedLost, setRevealedLost] = useState([]); // Índices de países adivinados
  const [guess, setGuess] = useState(""); // País ingresado por el usuario
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  

  useEffect(() => {
    axios.get("http://localhost:3001/data")
      .then(response => {
        setGameTitle(response.data.gameTitle);
        setUnit(response.data.unit);
        setData(response.data.data);
      })
      .catch(error => console.error("Error al obtener los datos:", error));
    axios.get("http://localhost:3001/countries")
      .then(response => setCountriesList(response.data))
      .catch(error => console.error("Error al obtener la lista de países:", error));
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (data.length === 0) return;
  
    if (timeLeft > 0 && revealed.length < data.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      setRevealedLost(data
        .map((_, index) => (revealed.includes(index) ? null : index))
        .filter(index => index !== null)
      );
    }
  }, [timeLeft, revealed, data]); 
  
  // Manejo del error visual en el input
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]); 
  

  //si cambia el valor de input se sugieren nuevos países
  const handleInputChange = (e) => {
    const value = e.target.value;
    setGuess(value);

    if (value.length > 0) {
      setFilteredCountries(
        countriesList.filter(country =>
          country.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5)
      );
    } else {
      setFilteredCountries([]);
    }
  };

  //si se presiona uno de los li del autocompletado se setea el guess
  const handleSelectSuggestion = (country) => {
    setGuess(country);
    document.getElementById("countryInput").focus();
    setFilteredCountries([]); // Oculta las sugerencias
  };

  //manejo del intento
  const handleGuess = (e) => {
    e.preventDefault();
  
    const guessedIndex = data.findIndex((item) => 
      item.country.toLowerCase() === guess.toLowerCase()
    );
  
    if (guessedIndex !== -1 && !revealed.includes(guessedIndex)) {
      setRevealed([...revealed, guessedIndex]); // Revela el país si es correcto
      setGuess(""); // Limpia el input
      setFilteredCountries([]); // Oculta sugerencias
      setError(false);
    } else {
      setGuess("");  // Limpiar el input
      setError(true);
      document.getElementById("countryInput").blur();
      setTimeout(() => {
        setError(false);
        document.getElementById("countryInput").focus();
      }, 1000);
    }
  };


  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };  

  return (
    <div>
      <header>
        <h2 id="title">Geo Ranking</h2>
        <div id="configButtons"></div>
          <div className="headeConfigButton" id="languageSelect">
            <button>🇪🇸</button>
          </div>
          <button className="headeConfigButton" id="colorSchemeSelect">🌙</button>
      </header>
      <div id="game">
        <div id="gameStatus">
          <h3>{gameTitle || "Cargando..."}</h3>
          <h3 id="timer" className={
            revealed.length === data.length ? "victory" : 
            timeLeft === 0 ? "expired" : 
            timeLeft <= 10 ? "warning" : ""
          }>
            {formatTime(timeLeft)}
          </h3>
        </div>
        <ul className="list">
          {data.map((item, index) => (
            <li key={index} className={`list-item 
              ${revealed.includes(index) ? "revealed" : ""}
              ${revealedLost.includes(index) ? "revealedLost" : ""}
              ${!revealed.includes(index) && !revealedLost.includes(index) ? "hidden" : ""}
            `}>
              {revealed.includes(index) || revealedLost.includes(index) ? `Top ${index + 1} - ${item.country}: ${item.value.toLocaleString()} ${unit}` : ""}
            </li>
          ))}
        </ul>
        {gameOver && (
          <h3 className={`game-over-message ${revealed.length === data.length ? "victory" : "lost"}`}>
            {revealed.length === data.length ? "Adivinaste todos los países." : "¡Tiempo agotado! No pudiste adivinar todos los países."}
          </h3>
        )}
        <form id="guessInput" onSubmit={handleGuess} className={error ? "shake" : ""}>
          <input 
            id="countryInput"
            type="text" 
            value={guess} 
            onChange={handleInputChange} 
            placeholder="Escribe un país..."
            disabled={gameOver}
            className={error ? "error" : ""}
          />
          <ul className="suggestions">
            {filteredCountries.map((country, index) => (
              <li key={index} onClick={() => handleSelectSuggestion(country)}>
                {country}
              </li>
            ))}
          </ul>
          <button type="submit" disabled={gameOver}>Guess</button>
        </form>
      </div>
    </div>
  );
}

export default App;