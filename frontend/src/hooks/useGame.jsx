import { useState, useEffect } from "react";
import { fetchGames, getTodayGame } from "../api/gameApi.jsx";
import { fetchCountries } from "../api/countryApi.jsx";

export function useGame() {
  // parametros del juego
  const [gameTitle, setGameTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  // estados generales del juego
  const [countriesList, setCountriesList] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [gaveUp, setGaveUp] = useState(false);
  // revealed
  const [revealedCountries, setRevealedCountries] = useState([]);
  const [revealedLost, setRevealedLost] = useState([]);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const todayGame = getTodayGame(await fetchGames());
        if (todayGame) {
          setGameParameters(todayGame);
        } else {
          console.error("No hay juegos para hoy");
        }
      } catch (error) {
        console.error("Error al cargar el juego:", error);
      }
    };
    const loadCountries = async () => {
      try {
        const countries = await fetchCountries();
        setCountriesList(countries);
      } catch (error) {
        console.error("Error al cargar países:", error);
      }
    };

    loadGame();
    loadCountries();
  }, []);
  
  const setGameParameters = (game) => {
    setGameTitle(game.title);
    setUnit(game.unit);
    setCorrectAnswers(game.countries.map(({ countryName, value }) => ({
      country: countryName,
      value
    })));
  };

  const endGame = () => {
    setGameOver(true);
    setRevealedLost(
      correctAnswers
        .map((_, index) =>
          revealedCountries.includes(index) ? null : index
        )
        .filter((index) => index !== null)
    );
  };

  const handleGiveUp = () => {
    setIsTimerRunning(false);
    setGaveUp(true);
  };

  const showHint = () => {
    alert(`Hint: ${correctAnswers[revealedCountries.length].country}`);
  };

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (correctAnswers.length === 0) return;

    if (revealedCountries.length === correctAnswers.length) {
      endGame();
      setGameOverMessage("You guessed all the countries!");
    } else if (timeLeft === 0) {
      endGame();
      setGameOverMessage("Time's up! You didn't guess all the countries.");
    } else if (gaveUp) {
      endGame();
      setGameOverMessage("You gave up! You didn't guess all the countries.");
    }
  }, [timeLeft, revealedCountries, correctAnswers, gaveUp]);

  return {
    gameTitle,
    unit,
    correctAnswers,
    countriesList,
    timeLeft,
    gameOver,
    gameOverMessage,
    revealedCountries,
    revealedLost,
    setRevealedCountries,
    handleGiveUp,
    showHint,
    gaveUp
  };
}