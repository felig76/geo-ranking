import './FlagGame.css';
import { useState, useEffect } from 'react';
import { calculateScore, getMaxScore, getPointsPerItem } from '../../services/scoreService.js';

export default function FlagGame({ correctAnswers, countriesList, onClose, onSubmit, initialProgress }) {
  const [countryFlags, setCountryFlags] = useState({});
  const [draggedFromCountry, setDraggedFromCountry] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // Initialize game: pair flags randomly with countries
  useEffect(() => {
    const gameCountries = correctAnswers.map((answer) => {
      const countryData = countriesList.find(c => c.iso2 === answer.iso2);
      return {
        id: answer.iso2,
        countryName: answer.country,
        flagUrl: countryData?.flagUrl || null,
        iso2: answer.iso2,
      };
    });

    // Create shuffled flags
    const shuffledFlags = [...gameCountries].sort(() => Math.random() - 0.5);

    // Initialize country-flag pairs (use saved progress if available)
    if (initialProgress && initialProgress.flags && Object.keys(initialProgress.flags).length > 0) {
      setCountryFlags(initialProgress.flags);
      if (initialProgress.completed) {
        setShowResults(true);
        setScore(initialProgress.score || 0);
        setAlreadyCompleted(true);
      }
    } else {
      const initialPairs = {};
      gameCountries.forEach((country, index) => {
        initialPairs[country.id] = shuffledFlags[index]?.id || null;
      });
      setCountryFlags(initialPairs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctAnswers, countriesList]);

  const handleDragStart = (e, fromCountryId) => {
    setDraggedFromCountry(fromCountryId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, toCountryId) => {
    e.preventDefault();
    if (!draggedFromCountry || draggedFromCountry === toCountryId) return;

    // Swap flags between countries
    setCountryFlags(prev => {
      const fromFlag = prev[draggedFromCountry];
      const toFlag = prev[toCountryId];
      
      return {
        ...prev,
        [draggedFromCountry]: toFlag,
        [toCountryId]: fromFlag
      };
    });
    setDraggedFromCountry(null);
  };

  const handleDragEnd = () => {
    setDraggedFromCountry(null);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    correctAnswers.forEach((answer) => {
      if (countryFlags[answer.iso2] === answer.iso2) {
        correctCount++;
      }
    });
    
    // Calculate score using score service
    const calculatedScore = calculateScore('flag_game', correctCount);
    setScore(calculatedScore);
    setShowResults(true);
    setAlreadyCompleted(true);
    // Save both score and progress so it persists when navigating away and back
    onSubmit(calculatedScore, { flags: countryFlags, score: calculatedScore, completed: true });
  };

  const handleBack = () => {
    // Save full state (progress + completion status) before going back
    const savedState = {
      flags: countryFlags,
      score: alreadyCompleted ? score : null,
      completed: alreadyCompleted,
    };
    onSubmit(alreadyCompleted ? score : null, savedState);
    onClose();
  };

  const getFlagById = (flagId) => {
    const countryData = countriesList.find(c => c.iso2 === flagId);
    return countryData ? {
      id: flagId,
      countryName: countryData.countryName,
      flagUrl: countryData.flagUrl,
      iso2: flagId
    } : null;
  };

  return (
    <div className="flag-game">
      <div className="flag-game-header">
        <h3>🏁 Match the Flags</h3>
        <button className={`flag-game-back ${alreadyCompleted ? 'completed' : ''}`} onClick={handleBack}>
          ← Back{alreadyCompleted ? ' (done)' : ''}
        </button>
      </div>
      {!alreadyCompleted && (
        <p className="flag-game-instructions">
          Drag the flags to swap them between countries
        </p>
      )}
      {alreadyCompleted && !showResults && (
        <p className="flag-game-instructions already-submitted">
          ✅ Already submitted — drag to review, or go back
        </p>
      )}
      <div className="flag-game-list">
        {correctAnswers.map((answer, index) => {
          const pairedFlagId = countryFlags[answer.iso2];
          const pairedFlag = getFlagById(pairedFlagId);
          const isCorrect = pairedFlag?.iso2 === answer.iso2;
          
          return (
            <div
              key={answer.iso2}
              className={`flag-game-item ${showResults ? (isCorrect ? 'revealed' : 'revealedLost') : ''}`}
            >
              <div className="flag-country-name">{answer.country}</div>
              <div 
                className={`flag-drop-zone ${draggedFromCountry ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, answer.iso2)}
              >
                {pairedFlag ? (
                  <div
                    className="flag-item"
                    draggable={!showResults}
                    onDragStart={(e) => !showResults && handleDragStart(e, answer.iso2)}
                    onDragEnd={handleDragEnd}
                  >
                    {pairedFlag.flagUrl ? (
                      <img 
                        src={pairedFlag.flagUrl} 
                        alt={`Flag of ${pairedFlag.countryName}`}
                        className="flag-item-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flag-item-placeholder">🏳️</div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {!showResults && (
        <div className="flag-game-actions">
          <button className="flag-game-submit" onClick={handleSubmit}>
            Submit Answers
          </button>
        </div>
      )}
      {showResults && (
        <div className="flag-game-score-display">
          <div className="flag-game-score-text">
            Score: <span className="flag-game-score-value">{score}</span> / {getMaxScore('flag_game')}
          </div>
          <div className="flag-game-score-details">
            {score / getPointsPerItem('flag_game')} / {correctAnswers.length} flags matched
          </div>
        </div>
      )}
    </div>
  );
}
