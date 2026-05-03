import './GameStatus.css';
import HintModal from './HintModal.jsx';

export default function GameStatus({ gameTitle, timeLeft, revealedCount, totalAnswers, gameOver, handleHint, handleGiveUp, gaveUp, hint, hintUsed }) {
	const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

	return (
		<div>
			<div id="gameStatusTop">
				<h3>{gameTitle || "Loading..."}</h3>
				<h3
					id="timer"
					className={
						revealedCount === totalAnswers
							? "victory"
							: gameOver
							? "expired"
							: timeLeft === 0
							? "expired"
							: gaveUp
							? "expired"
							: timeLeft <= 10
							? "warning"
							: ""
					}
				>
					{formatTime(timeLeft)}
				</h3>
				<div id="gameControlContainer" style={{ position: 'relative' }}>
					<button className='gameStatusButton' id="giveUpButton" disabled={gameOver} onClick={handleGiveUp} title="Give up">
						🏳️
					</button>
					<button className='gameStatusButton' id="hintButton" disabled={gameOver || hintUsed} onClick={handleHint} title="Hint">
						💡
					</button>
					<HintModal hint={hint} isVisible={hintUsed} />
				</div>
			</div>
		</div>
	);
}