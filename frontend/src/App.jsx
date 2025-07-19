import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Header from "./components/Header.jsx";

function App() {
  const [gameTitle, setGameTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [data, setData] = useState([]); // List of countries in the ranking
  const [countriesList, setCountriesList] = useState([]); // Complete list of countries
  const [filteredCountries, setFilteredCountries] = useState([]); // Filtered suggestions
  const [revealedCountries, setRevealedCountries] = useState([]); // Indices of revealed countries
  const [revealedLost, setRevealedLost] = useState([]); // Indices of revealed countries
  const [guess, setGuess] = useState(""); // Country entered by the user
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/games")
      .then((response) => {
        setGameTitle(response.data.gameTitle);
        setUnit(response.data.unit);
        setData(response.data.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
    axios.get("http://localhost:3000/countries")
      .then((response) => setCountriesList(response.data))
      .catch((error) => console.error("Error fetching countries list:", error));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    if (timeLeft > 0 && revealedCountries.length < data.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      setRevealedLost(
        data
          .map((_, index) => (revealedCountries.includes(index) ? null : index))
          .filter((index) => index !== null)
      );
    }
  }, [timeLeft, revealedCountries, data]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setGuess(value);

    if (value.length > 0) {
      setFilteredCountries(
        countriesList.filter((country) =>
          country.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5)
      );
    } else {
      setFilteredCountries([]);
    }
  };

  const handleSelectSuggestion = (country) => {
    setGuess(country);
    document.getElementById("countryInput").focus();
    setFilteredCountries([]);
  };

  const handleGuess = (event) => {
    event.preventDefault();

    const guessedIndex = data.findIndex((item) =>
      item.country.toLowerCase() === guess.toLowerCase()
    );

    if (guessedIndex !== -1 && !revealedCountries.includes(guessedIndex)) {
      setRevealedCountries([...revealedCountries, guessedIndex]);
      setGuess("");
      setFilteredCountries([]);
      setError(false);
    } else {
      setGuess("");
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
      <Header />
      <div id="game">
        <div id="gameStatus">
          <h3>{gameTitle || "Loading..."}</h3>
          <h3
            id="timer"
            className={
              revealedCountries.length === data.length
                ? "victory"
                : timeLeft === 0
                ? "expired"
                : timeLeft <= 10
                ? "warning"
                : ""
            }
          >
            {formatTime(timeLeft)}
          </h3>
        </div>
        <ul className="list">
          {data.map((item, index) => (
            <li
              key={index}
              className={`list-item 
                ${revealedCountries.includes(index) ? "revealed" : ""}
                ${revealedLost.includes(index) ? "revealedLost" : ""}
                ${!revealedCountries.includes(index) && !revealedLost.includes(index) ? "hidden" : ""}
              `}
            >
              {revealedCountries.includes(index) || revealedLost.includes(index) ? `Top ${index + 1} - ${item.country}: ${item.value.toLocaleString()} ${unit}` : ""}
            </li>
          ))}
        </ul>
        {gameOver && (
          <h3
            className={`game-over-message ${revealedCountries.length === data.length ? "victory" : "lost"}`}
          >
            {revealedCountries.length === data.length
              ? "You guessed all the countries!"
              : "Time's up! You couldn't guess all the countries."}
          </h3>
        )}
        <form id="guessInput" onSubmit={handleGuess} className={error ? "shake" : ""}>
          <input
            id="countryInput"
            type="text"
            value={guess}
            onChange={handleInputChange}
            placeholder="Enter a country..."
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