import './ResultsModal.css'
import React from 'react'

function ResultsModal({ isOpen, onClose, totalItems, revealedIndices, user, unit }) {
  if (!isOpen) return null

  const pointsPerCorrect = 1
  const items = Array.from({ length: totalItems }, (_, i) => i)
  const isCorrect = (i) => revealedIndices.includes(i)
  const totalPoints = revealedIndices.length * pointsPerCorrect

  const title = revealedIndices.length === totalItems
    ? 'Congratulations, you guessed all the countries!'
    : 'Thanks for playing!'

  const authMessage = user
    ? 'Your score has been saved to your profile.'
    : 'Log in or register to save your results and see stats.'

  return (
    <div className="results-modal-overlay" role="dialog" aria-modal="true">
      <div className="results-modal">
        <div className="results-modal-header">
          <h3>{title}</h3>
        </div>

        <div className="results-grid" aria-label="Results summary graph">
          {items.map((i) => (
            <div key={i} className="results-row">
              <div className={`row-bar ${isCorrect(i) ? 'correct' : 'missed'}`} />
              <div className={`row-points ${isCorrect(i) ? 'gain' : 'zero'}`}>
                {isCorrect(i) ? `+${pointsPerCorrect}` : '+0'}
              </div>
            </div>
          ))}
        </div>

        <div className="results-summary">
          <p><strong>Total points:</strong> {totalPoints}</p>
          <p><strong>Correct:</strong> {revealedIndices.length} / {totalItems}</p>
        </div>

        <div className="results-auth-note">
          <p>{authMessage}</p>
        </div>

        <div className="results-actions">
          <button className="results-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ResultsModal
