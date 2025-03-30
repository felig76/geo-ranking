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
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setGuess(value);

    if (value.length > 0) {
      setFilteredCountries(
        countriesList.filter(country =>
          country.toLowerCase().startsWith(value.toLowerCase())
        ).slice(0, 5)
      );
    } else {
      setFilteredCountries([]);
    }
  };

  const handleSelectSuggestion = (country) => {
    setGuess(country);
    setFilteredCountries([]); // Oculta las sugerencias
  };

  const handleGuess = (e) => {
    e.preventDefault();

    const guessedIndex = data.findIndex((item) => 
      item.country.toLowerCase() === guess.toLowerCase()
    );

    if (guessedIndex !== -1 && !revealed.includes(guessedIndex)) {
      setRevealed([...revealed, guessedIndex]); // Revela el país si es correcto
      setGuess(""); // Limpia el input
      setFilteredCountries([]); // Oculta sugerencias
    } else {
      // Si el guess es incorrecto, darle feedback visual
      document.getElementById("countryInput").classList.add("error");
      setTimeout(() => {
        document.getElementById("countryInput").classList.remove("error");
      }, 1000);
    }
  };

  return (
    <div>
      <header>
        <h2 id="title">Geo Ranking</h2>
      </header>
      <div id="game">
        <h3>{gameConfig?.title || "Cargando..."}</h3>
        <ul className="list">
          {data.map((item, index) => (
            <li key={index} className={`list-item ${revealed.includes(index) ? "revealed" : "hidden"}`}>
              {revealed.includes(index) ? `${item.country}: ${item.value.toLocaleString()} km²` : ""}
            </li>
          ))}
        </ul>
        <form id="guessInput" onSubmit={handleGuess}>
          <input 
            id="countryInput"
            type="text" 
            value={guess} 
            onChange={handleInputChange} 
            placeholder="Escribe un país..."
          />
          <ul className="suggestions">
            {filteredCountries.map((country, index) => (
              <li key={index} onClick={() => handleSelectSuggestion(country)}>
                {country}
              </li>
            ))}
          </ul>
          <button type="submit">Guess</button>
        </form>
      </div>
    </div>
  );
}

export default App;