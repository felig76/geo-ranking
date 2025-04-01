import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [gameConfig, setGameConfig] = useState(null);
  const [data, setData] = useState([]); // Lista de países del ranking
  const [countriesList, setCountriesList] = useState([]); // Lista completa de países
  const [filteredCountries, setFilteredCountries] = useState([]); // Sugerencias filtradas
  const [revealed, setRevealed] = useState([]); // Índices de países adivinados
  const [guess, setGuess] = useState(""); // País ingresado por el usuario
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  

  useEffect(() => {
    axios.get("http://localhost:3001/game")
      .then(response => setGameConfig(response.data))
      .catch(error => console.error("Error al obtener la configuración del juego:", error));
  
    axios.get("http://localhost:3001/data")
      .then(response => setData(response.data))
      .catch(error => console.error("Error al obtener los datos:", error));
  
    axios.get("http://localhost:3001/countries")
      .then(response => setCountriesList(response.data))
      .catch(error => console.error("Error al obtener la lista de países:", error));
  }, []); // Solo se ejecuta una vez al montar el componente
  
  // Manejo del temporizador
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]); // Se ejecuta cada vez que `timeLeft` cambia
  
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
      setError(true); // Activar el error
      console.log("Inicio del error");
    
      setTimeout(() => {
        setError(false); // Desactivar el error después de 1 segundo
        console.log("Fin del error");
      }, 1000);
    }
    document.getElementById("countryInput").blur();
    setTimeout(() => {
      document.getElementById("countryInput").focus();
    }, 500);
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
          <h3>{gameConfig?.title || "Cargando..."}</h3>
          <h3 id="timer" className={timeLeft === 0 ? "expired" : timeLeft <= 10 ? "warning" : ""}>{formatTime(timeLeft)}</h3>
        </div>
        <ul className="list">
          {data.map((item, index) => (
            <li key={index} className={`list-item ${revealed.includes(index) ? "revealed" : "hidden"}`}>
              {revealed.includes(index) ? `Top ${index+1} - ${item.country}: ${item.value.toLocaleString()} km²` : ""}
            </li>
          ))}
        </ul>
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