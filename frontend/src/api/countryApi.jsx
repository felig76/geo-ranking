import axios from 'axios';
const API_URL = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");
export const fetchCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/countries`);
    const data = response.data?.data || [];
    // Provide display name (common) and the official WB name for matching
    return data.map((c) => ({
      countryName: c.commonName || c.name, // display in suggestions
      wbName: c.name, // official name used by WB ranking and matching
      iso2: c.iso2,
    }));
  } catch (error) {
    console.error("Error fetching countries list:", error);
    return [];
  }
};