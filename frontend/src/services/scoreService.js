/**
 * Score Service - Scalable scoring system for multiple game types
 * 
 * Game Types:
 * - 'top10': Main ranking game (max 100 points)
 * - 'flag_game': Flag matching game (max 100 points, 10 per flag)
 * - 'bonus_round': Future bonus rounds (configurable)
 */

const SCORE_CONFIGS = {
  top10: {
    maxScore: 100,
    pointsPerItem: 10,
    totalItems: 10,
  },
  flag_game: {
    maxScore: 100,
    pointsPerItem: 10,
    totalItems: 10,
  },
  bonus_round: {
    maxScore: 50,
    pointsPerItem: 5,
    totalItems: 10,
  },
};

/**
 * Calculate score for a game type
 * @param {string} gameType - Type of game ('top10', 'flag_game', 'bonus_round')
 * @param {number} correctCount - Number of correct answers/items
 * @returns {number} Calculated score
 */
export function calculateScore(gameType, correctCount) {
  const config = SCORE_CONFIGS[gameType];
  if (!config) {
    console.warn(`Unknown game type: ${gameType}, using default calculation`);
    return correctCount * 10;
  }

  const score = correctCount * config.pointsPerItem;
  return Math.min(score, config.maxScore);
}

/**
 * Get maximum possible score for a game type
 * @param {string} gameType - Type of game
 * @returns {number} Maximum score
 */
export function getMaxScore(gameType) {
  const config = SCORE_CONFIGS[gameType];
  return config ? config.maxScore : 100;
}

/**
 * Get points per item for a game type
 * @param {string} gameType - Type of game
 * @returns {number} Points per item
 */
export function getPointsPerItem(gameType) {
  const config = SCORE_CONFIGS[gameType];
  return config ? config.pointsPerItem : 10;
}

/**
 * Calculate total score across multiple games
 * @param {Array} gameScores - Array of { gameType, score } objects
 * @returns {number} Total score
 */
export function calculateTotalScore(gameScores) {
  return gameScores.reduce((total, { score }) => total + score, 0);
}

/**
 * Get score percentage for a game
 * @param {string} gameType - Type of game
 * @param {number} score - Current score
 * @returns {number} Percentage (0-100)
 */
export function getScorePercentage(gameType, score) {
  const maxScore = getMaxScore(gameType);
  return (score / maxScore) * 100;
}

/**
 * Validate if a score is within valid range for a game type
 * @param {string} gameType - Type of game
 * @param {number} score - Score to validate
 * @returns {boolean} True if valid
 */
export function isValidScore(gameType, score) {
  const maxScore = getMaxScore(gameType);
  return score >= 0 && score <= maxScore;
}

export default {
  calculateScore,
  getMaxScore,
  getPointsPerItem,
  calculateTotalScore,
  getScorePercentage,
  isValidScore,
  SCORE_CONFIGS,
};
