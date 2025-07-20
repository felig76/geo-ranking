import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { fetchGames, getTodayGame } from "./api/gameApi.js";
import { fetchCountries } from "./api/countryApi.js";

function App() {
  const [gameTitle, setGameTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [revealedCountries, setRevealedCountries] = useState([]);
  const [revealedLost, setRevealedLost] = useState([]);
  const [guess, setGuess] = useState("");
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const loadGame = async () => {
      const todayGame = getTodayGame(await fetchGames(), 2);

      if (todayGame) {
        setGameParameters(todayGame);
      } else {
        console.error("No hay juegos para hoy");
      }
    };
    loadGame();

    const countries = fetchCountries();
    countries.then((data) => {
      setCountriesList(data);
    });
  }, []);

  useEffect(() => {
    if (correctAnswers.length === 0) return;

    if (timeLeft > 0 && revealedCountries.length < correctAnswers.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      setRevealedLost(
        correctAnswers
          .map((_, index) => (revealedCountries.includes(index) ? null : index))
          .filter((index) => index !== null)
      );
    }
  }, [timeLeft, revealedCountries, correctAnswers]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const setGameParameters = (game) => {
    setGameTitle(game.title);
    setUnit(game.unit);
    setCorrectAnswers(game.countries.map(({ countryName, value }) => ({
      country: countryName,
      value
    })));
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setGuess(value);
    setSelectedIndex(-1);

    if (value.length > 0) {
      setFilteredCountries(
        countriesList
          .filter((country) =>
            country.countryName.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 5)
      );
    } else {
      setFilteredCountries([]);
    }
  };

  const handleKeyDown = (event) => {
    if (filteredCountries.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => prev < filteredCountries.length - 1 ? prev + 1 : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => prev > 0 ? prev - 1 : filteredCountries.length - 1);
    } else if (event.key === "Enter") {
      if (selectedIndex >= 0) {
        event.preventDefault();
        handleSelectSuggestion(filteredCountries[selectedIndex]);
      }
    }
  };

  const handleSelectSuggestion = (country) => {
    setGuess(country.countryName);
    setFilteredCountries([]);
    setSelectedIndex(-1);
    document.getElementById("countryInput").focus();
  };

  const handleGuess = (event) => {
    event.preventDefault();

    const guessedIndex = correctAnswers.findIndex((item) =>
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
      <header>
        <h2 id="title">Geo Ranking</h2>
        <div id="configButtons">
          <div className="headeConfigButton" id="languageSelect">
            <button>🇪🇸</button>
          </div>
          <button className="headeConfigButton" id="colorSchemeSelect">🌙</button>
        </div>
      </header>
      <div id="game">
        <div id="gameStatus">
          <h3>{gameTitle || "Loading..."}</h3>
          <h3
            id="timer"
            className={
              revealedCountries.length === correctAnswers.length
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
          {correctAnswers.map((item, index) => (
            <li
              key={index}
              className={`list-item ${revealedCountries.includes(index) ? "revealed" : ""} ${revealedLost.includes(index) ? "revealedLost" : ""} ${!revealedCountries.includes(index) && !revealedLost.includes(index) ? "hidden" : ""}`}
            >
              {revealedCountries.includes(index) || revealedLost.includes(index) ? (
                `Top ${index + 1} - ${item.country}: ${item.value.toLocaleString()} ${unit}`
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
        {gameOver && (
          <h3 className={`game-over-message ${revealedCountries.length === correctAnswers.length ? "victory" : "lost"}`}>
            {revealedCountries.length === correctAnswers.length
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
            onKeyDown={handleKeyDown}
            placeholder="Enter a country..."
            disabled={gameOver}
            className={error ? "error" : ""}
          />
          <ul className="suggestions">
            {filteredCountries.map((country, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(country)}
                className={index === selectedIndex ? "selected" : ""}
              >
                {country.countryName}
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