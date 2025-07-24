import axios from 'axios';

export const fetchCountries = async () => {
  try {
    const response = await axios.get("https://geo-ranking.onrender.com//api/countries");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching countries list:", error);
    return [];
  }
};