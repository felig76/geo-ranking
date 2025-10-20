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
  const [gameId, setGameId] = useState(null);

  // estados generales
  const [countriesList, setCountriesList] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [gaveUp, setGaveUp] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);

  // revealed
  const [revealedCountries, setRevealedCountries] = useState([]);
  const [revealedLost, setRevealedLost] = useState([]);
  const START_TIME = 120;

  // Cargar juego y países
  useEffect(() => {
    const loadGame = async () => {
      try {
        const games = await fetchGames();
        const todayGame = getTodayGame(games);
        if (!todayGame) {
          console.error("No game for today");
          return;
        }

        setGameParameters(todayGame);
        setGameId(todayGame._id || null);

        // check if the user already played today
        const today = new Date();
        today.setHours(0,0,0,0);
        const dateISO = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);

        if (user) {
          const existing = (user.stats?.dailyPlays || []).find(play => {
            const d = new Date(play.date); d.setHours(0,0,0,0);
            const sameDay = d.getTime() === today.getTime();
            const sameGame = todayGame._id && play.gameId ? String(play.gameId) === String(todayGame._id) : true;
            return sameDay && sameGame;
          });
          if (existing) {
            setGameOver(true);
            setIsTimerRunning(false);
            setHintUsed(Boolean(existing.hintUsed));
            const savedGuesses = Array.isArray(existing.guesses) ? existing.guesses : [];
            setRevealedCountries(savedGuesses);
            const savedMissed = Array.isArray(existing.missed) ? existing.missed : [];
            setRevealedLost(savedMissed);
            if (typeof existing.timeTaken === 'number') {
              const remaining = Math.max(0, START_TIME - existing.timeTaken);
              setTimeLeft(remaining);
            }
            if (existing.outcome === 'win') setGameOverMessage("You guessed all the countries!");
            else if (existing.outcome === 'timeout') setGameOverMessage("Time's up! You didn't guess all the countries.");
            else if (existing.outcome === 'gaveup') { setGameOverMessage("You gave up! You didn't guess all the countries."); setGaveUp(true); }
            else setGameOverMessage("You already played today");
          }
        } else {
          const key = `dailyPlay:${dateISO}:${todayGame._id || 'nogame'}`;
          const saved = localStorage.getItem(key);
          if (saved) {
            const parsed = JSON.parse(saved);
            setGameOver(true);
            setIsTimerRunning(false);
            setHintUsed(Boolean(parsed.hintUsed));
            setRevealedCountries(Array.isArray(parsed.guesses) ? parsed.guesses : []);
            setRevealedLost(Array.isArray(parsed.missed) ? parsed.missed : []);
            if (typeof parsed.timeTaken === 'number') {
              const remaining = Math.max(0, START_TIME - parsed.timeTaken);
              setTimeLeft(remaining);
            }
            if (parsed.outcome === 'win') setGameOverMessage("You guessed all the countries!");
            else if (parsed.outcome === 'timeout') setGameOverMessage("Time's up! You didn't guess all the countries.");
            else if (parsed.outcome === 'gaveup') { setGameOverMessage("You gave up! You didn't guess all the countries."); setGaveUp(true); }
            else setGameOverMessage("You already played today");
          }
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

    (async () => {
      try {
        await Promise.all([loadGame(), loadCountries()]);
      } finally {
        setGameLoading(false);
      }
    })();
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

  const endGame = async (score, outcome) => {
    setGameOver(true);
    setRevealedLost(
      correctAnswers
        .map((_, i) => (revealedCountries.includes(i) ? null : i))
        .filter(i => i !== null)
    );

    setIsTimerRunning(false);

    if (user) {
      try {
        const today = new Date();
        today.setHours(0,0,0,0);
        const dateISO = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
        const payload = {
          score,
          gameId,
          outcome,
          timeTaken: START_TIME - timeLeft,
          hintUsed,
          guesses: revealedCountries,
          missed: correctAnswers
            .map((_, i) => (revealedCountries.includes(i) ? null : i))
            .filter(i => i !== null),
          date: dateISO
        };
        await submitDailyGame(payload); // actualizar stats en backend
      } catch (err) {
        console.error("Error saving match:", err);
      }
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);
      const dateISO = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
      const key = `dailyPlay:${dateISO}:${gameId || 'nogame'}`;
      const payload = {
        score,
        gameId,
        outcome,
        timeTaken: START_TIME - timeLeft,
        hintUsed,
        guesses: revealedCountries,
        missed: correctAnswers
          .map((_, i) => (revealedCountries.includes(i) ? null : i))
          .filter(i => i !== null),
        date: dateISO
      };
      localStorage.setItem(key, JSON.stringify(payload));
    }
  };

  const handleGiveUp = () => {
    setGaveUp(true);
    endGame(0, 'gaveup');
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
      endGame(revealedCountries.reduce((sum, i) => sum + correctAnswers[i].value, 0), 'win');
      setGameOverMessage("You guessed all the countries!");
    } else if (timeLeft === 0) {
      endGame(revealedCountries.reduce((sum, i) => sum + correctAnswers[i].value, 0), 'timeout');
      setGameOverMessage("Time's up! You didn't guess all the countries.");
    } else if (gaveUp) {
      endGame(revealedCountries.reduce((sum, i) => sum + correctAnswers[i].value, 0), 'gaveup');
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
    hintUsed,
    gameLoading
  };
}
