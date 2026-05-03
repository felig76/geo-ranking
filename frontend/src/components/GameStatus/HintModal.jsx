import './HintModal.css';

export default function HintModal({ hint, isVisible }) {
  if (!isVisible || !hint) return null;

  return (
    <div className="hint-modal">
      <div className="hint-modal-content">
        <div className="hint-modal-icon">💡</div>
        <div className="hint-modal-text">{hint}</div>
      </div>
    </div>
  );
}
