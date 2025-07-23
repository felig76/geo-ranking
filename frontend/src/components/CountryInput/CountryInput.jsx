import './CountryInput.css'

function CountryInput({ guess, filteredCountries, selectedIndex, wrongAnswer, handleInputChange, handleKeyDown, handleSelectSuggestion, handleGuess, gameOver }) {
	return (
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
	);
}

export default CountryInput