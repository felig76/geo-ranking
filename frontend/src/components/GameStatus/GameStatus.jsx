import './GameStatus.css';
export default function GameStatus({ gameTitle, timeLeft, revealedCount, totalAnswers, gameOver, showHint, handleGiveUp, gaveUp }) {
	const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

	return (
		<div id="gameStatus">
			<h3>{gameTitle || "Loading..."}</h3>
			<h3
				id="timer"
				className={
					revealedCount === totalAnswers
						? "victory"
						: timeLeft === 0
						? "expired"
						: timeLeft <= 10
						? "warning"
						: gaveUp
						? "expired"
						: ""
				}
			>
				{formatTime(timeLeft)}
			</h3>
			<div id="gameStatusButtonContainer">
				<button className='gameStatusButton' id="giveUpButton" disabled={gameOver} onClick={handleGiveUp}>
					🏳️
				</button>
				<button className='gameStatusButton' id="hintButton" disabled={gameOver} onClick={showHint}>
					💡
				</button>
			</div>
			
		</div>
	);
}