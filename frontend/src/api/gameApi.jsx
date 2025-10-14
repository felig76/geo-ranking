import axios from 'axios';
const API_URL = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");
export const fetchGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/games`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

export const getTodayGame = (games) => {
  if (!games.length) return null;

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % games.length;
  
  return games[index];
};