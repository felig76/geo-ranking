import { useState, useRef } from 'react';
import './GameStatus.css';
import HintModal from './HintModal.jsx';

export default function GameStatus({ gameTitle, timeLeft, revealedCount, totalAnswers, gameOver, handleHint, handleGiveUp, gaveUp, hint, hintUsed }) {
  const [hintVisible, setHintVisible] = useState(false);
  const [hintClosing, setHintClosing] = useState(false);
  const closeTimer = useRef(null);

  const handleHintToggle = () => {
    if (!hintUsed) handleHint(); // primera vez: marcar como usada
    if (hintVisible) {
      // iniciar animación de salida
      setHintClosing(true);
      closeTimer.current = setTimeout(() => {
        setHintVisible(false);
        setHintClosing(false);
      }, 280);
    } else {
      clearTimeout(closeTimer.current);
      setHintClosing(false);
      setHintVisible(true);
    }
  };
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
					<button
					  className='gameStatusButton'
					  id="hintButton"
					  disabled={gameOver}
					  onClick={handleHintToggle}
					  title={hintVisible ? "Ocultar pista" : "Ver pista"}
					>
						{hintVisible ? '🙈' : '💡'}
					</button>
					<HintModal hint={hint} isVisible={hintVisible} closing={hintClosing} />
				</div>
			</div>
		</div>
	);
}