import './FlagGameButton.css';

export default function FlagGameButton({ onClick, isVisible, isCompleted, score }) {
  if (!isVisible) return null;

  return (
    <button
      className={`flag-game-button ${isCompleted ? 'flag-game-button--completed' : ''}`}
      onClick={onClick}
    >
      <span className="flag-game-icon">{isCompleted ? '✅' : '🏁'}</span>
      <span className="flag-game-text">
        {isCompleted
          ? `Bonus Done · ${score ?? 0} pts — Review`
          : 'Bonus Round'}
      </span>
    </button>
  );
}
