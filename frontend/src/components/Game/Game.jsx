import './Game.css';
import { useGame } from "../../hooks/useGame.jsx";
import { useCountryInput } from "../../hooks/useCountryInput.jsx";
import GameStatus from "../GameStatus/GameStatus.jsx";
import TopList from "../TopList/TopList.jsx";
function Game() {
  // hooks del juego
  const {
    gameTitle,
    unit,
    correctAnswers,
    countriesList,
    timeLeft,
    gameOver,
    revealedCountries,
    revealedLost,
    setRevealedCountries,
    resetGame,
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

    if (guessedIndex !== -1 && !revealedCountries.includes(guessedIndex)) {
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
            : "Time's up! You couldn't guess all the countries."}
        </h3>
      )}
      <form id="guessInput" onSubmit={handleGuess} className={wrongAnswer ? "shake" : ""}>
        <input
          id="countryInput"
          type="text"
          value={guess}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter a country..."
          disabled={gameOver}
          className={wrongAnswer ? "wrongAnswer" : ""}
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
  )
}

export default Game