import axios from 'axios';

export const fetchGames = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/games");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

export const getTodayGame = (games, dayOverride = null) => {
  if (!games.length) return null;

  const today = new Date();
  const dayOfYear = dayOverride !== null
    ? dayOverride
    : Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

  const index = dayOfYear % games.length;
  return games[index];
};