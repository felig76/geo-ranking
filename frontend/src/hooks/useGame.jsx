import { useState, useEffect } from "react";
import { fetchGames, getTodayGame } from "../api/gameApi.jsx";
import { fetchCountries } from "../api/countryApi.jsx";
import { submitDailyGame } from "../api/userApi.jsx";

export function useGame(user) {
  // parámetros del juego
  const [gameTitle, setGameTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [hint, setHint] = useState("");

  // estados generales
  const [countriesList, setCountriesList] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [gaveUp, setGaveUp] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  // revealed
  const [revealedCountries, setRevealedCountries] = useState([]);
  const [revealedLost, setRevealedLost] = useState([]);

  const todayKey = "lastPlay";

  // Cargar juego y países
  useEffect(() => {
    const loadGame = async () => {
      try {
        const todayGame = getTodayGame(await fetchGames());
        if (!todayGame) {
          console.error("No game for today");
          return;
        }

        setGameParameters(todayGame);

        // check if the user already played today
        let playedToday = false;

        if (user) {
          playedToday = user.stats.dailyPlays.some(
            play => new Date(play.date).toDateString() === new Date().toDateString()
          );
        } else {
          playedToday = localStorage.getItem(todayKey) === new Date().toDateString();
        }

        if (playedToday) {
          setGameOver(true);
          setIsTimerRunning(false);
          setGameOverMessage("You already played today");
        }

      } catch (error) {
        console.error("Error loading game:", error);
      }
    };

    const loadCountries = async () => {
      try {
        const countries = await fetchCountries();
        setCountriesList(countries);
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };

    loadGame();
    loadCountries();
  }, [user]);

  const setGameParameters = (game) => {
    setGameTitle(game.title);
    setUnit(game.unit);
    setCorrectAnswers(game.countries.map(({ countryName, value }) => ({
      country: countryName,
      value
    })));
    setHint(game.hint);
  };

  const endGame = async (score) => {
    setGameOver(true);
    setRevealedLost(
      correctAnswers
        .map((_, i) => (revealedCountries.includes(i) ? null : i))
        .filter(i => i !== null)
    );

    setIsTimerRunning(false);

    if (user) {
      try {
        await submitDailyGame(score); // actualizar stats en backend
      } catch (err) {
        console.error("Error saving match:", err);
      }
    } else {
      localStorage.setItem(todayKey, new Date().toDateString());
    }
  };

  const handleGiveUp = () => {
    setGaveUp(true);
    endGame(0);
  };

  const handleHint = () => {
    if (!hintUsed) setHintUsed(true);
  };

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (correctAnswers.length === 0) return;

    if (revealedCountries.length === correctAnswers.length) {
      endGame(revealedCountries.reduce((sum, i) => sum + correctAnswers[i].value, 0));
      setGameOverMessage("You guessed all the countries!");
    } else if (timeLeft === 0) {
      endGame(revealedCountries.reduce((sum, i) => sum + correctAnswers[i].value, 0));
      setGameOverMessage("Time's up! You didn't guess all the countries.");
    } else if (gaveUp) {
      endGame(revealedCountries.reduce((sum, i) => sum + correctAnswers[i].value, 0));
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
    gaveUp,
    handleHint,
    hint,
    hintUsed
  };
}
