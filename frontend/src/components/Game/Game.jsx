import './Game.css';
import { useState, useEffect } from 'react';
import { useAuth } from "../../hooks/useAuth.jsx";
import { useGame } from "../../hooks/useGame.jsx";
import { useCountryInput } from "../../hooks/useCountryInput.jsx";
import GameStatus from "../GameStatus/GameStatus.jsx";
import TopList from "../TopList/TopList.jsx";
import CountryInput from "../CountryInput/CountryInput.jsx";
import ResultsModal from "../ResultsModal/ResultsModal.jsx";
import Loading from "../Loading/Loading.jsx";

function Game() {
  const { user, loading } = useAuth();
  const [showResults, setShowResults] = useState(false);
  
  const {
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
  } = useGame(user);

  // hooks del input
  const {
    guess,
    filteredCountries,
    selectedIndex,
    wrongAnswer,
    handleInputChange,
    handleKeyDown,
    handleSelectSuggestion,
    triggerWrongAnswer,
    clearInput,
  } = useCountryInput(countriesList);

  const handleGuess = (event) => {
    event.preventDefault();
    if (guess.length > 0){
      const guessedIndex = correctAnswers.findIndex(
        (item) => item.country.toLowerCase() === guess.toLowerCase()
      );

      if (guessedIndex >= 0 && !revealedCountries.includes(guessedIndex)) {
        setRevealedCountries([...revealedCountries, guessedIndex]);
        clearInput();
      } else {
        triggerWrongAnswer();
        clearInput();
      }
    }
  };

  useEffect(() => {
    if (gameOver) {
      setShowResults(true);
    }
  }, [gameOver]);

  if (loading || gameLoading) return <Loading />;

  return (
    <div id="game">
      <GameStatus
        gameTitle={gameTitle}
        timeLeft={timeLeft}
        revealedCount={revealedCountries.length}
        totalAnswers={correctAnswers.length}
        gameOver={gameOver}
        handleGiveUp={handleGiveUp}
        gaveUp={gaveUp}
        handleHint={handleHint}
        hint={hint}
        hintUsed={hintUsed}
      />
      <TopList
        correctAnswers={correctAnswers}
        revealedCountries={revealedCountries}
        revealedLost={revealedLost}
        unit={unit}
      />
      {gameOver && (
        <h3 className={`game-over-message ${revealedCountries.length === correctAnswers.length ? "victory" : "lost"}`}>
          {revealedCountries.length === correctAnswers.length
            ? "You guessed all the countries!"
            : gameOverMessage}
        </h3>
      )}
      {gameOver && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <button onClick={() => setShowResults(true)}>View results</button>
        </div>
      )}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        totalItems={correctAnswers.length}
        revealedIndices={revealedCountries}
        user={user}
        unit={unit}
      />
      <CountryInput
        guess={guess}
        filteredCountries={filteredCountries}
        selectedIndex={selectedIndex}
        wrongAnswer={wrongAnswer}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        handleSelectSuggestion={handleSelectSuggestion}
        handleGuess={handleGuess}
        gameOver={gameOver}
      />
    </div>
  );
}

export default Game;