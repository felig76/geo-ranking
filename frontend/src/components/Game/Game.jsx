import './Game.css';
import { useGame } from "../../hooks/useGame.jsx";
import { useCountryInput } from "../../hooks/useCountryInput.jsx";
import GameStatus from "../GameStatus/GameStatus.jsx";
import TopList from "../TopList/TopList.jsx";
import CountryInput from "../CountryInput/CountryInput.jsx";

function Game() {
  // hooks del juego
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
    showHint,
  } = useGame();
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
  };

  return (
    <div id="game">
      <GameStatus
        gameTitle={gameTitle}
        timeLeft={timeLeft}
        revealedCount={revealedCountries.length}
        totalAnswers={correctAnswers.length}
        gameOver={gameOver}
        showHint={showHint}
        handleGiveUp={handleGiveUp}
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
  )
}

export default Game