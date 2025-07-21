import { useState, useEffect } from "react";
import { fetchGames, getTodayGame } from "../api/gameApi.js";
import { fetchCountries } from "../api/countryApi.js";

export function useGame() {
  // parametros del juego
  const [gameTitle, setGameTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  // estados generales del juego
  const [countriesList, setCountriesList] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  // revealed
  const [revealedCountries, setRevealedCountries] = useState([]);
  const [revealedLost, setRevealedLost] = useState([]);

  const setGameParameters = (game) => {
    setGameTitle(game.title);
    setUnit(game.unit);
    setCorrectAnswers(game.countries.map(({ countryName, value }) => ({
      country: countryName,
      value
    })));
  };

  useEffect(() => {
    const loadGame = async () => {
      try {
        const todayGame = getTodayGame(await fetchGames(), dayOverride);
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
  }, [dayOverride]);

  useEffect(() => {
    if (correctAnswers.length === 0) return;

    if (timeLeft > 0 && revealedCountries.length < correctAnswers.length) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setRevealedLost(
        correctAnswers
          .map((_, index) =>
            revealedCountries.includes(index) ? null : index
          )
          .filter((index) => index !== null)
      );
    }
  }, [timeLeft, revealedCountries, correctAnswers]);

  const resetGame = () => {
    setTimeLeft(120);
    setGameOver(false);
    setRevealedCountries([]);
    setRevealedLost([]);
  };

  return {
    gameTitle,
    unit,
    correctAnswers,
    countriesList,
    timeLeft,
    gameOver,
    revealedCountries,
    revealedLost,
    setRevealedCountries,
    setTimeLeft,
    setGameOver,
    resetGame,
  };
}