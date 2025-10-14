import axios from 'axios';
const API_URL = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");
export const fetchCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/countries`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching countries list:", error);
    return [];
  }
};