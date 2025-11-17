import axios from 'axios';
const API_URL = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");
export const fetchCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/countries`);
    const data = response.data?.data || [];
    // Adapt to legacy frontend expectation: { countryName } for suggestions
    return data.map((c) => ({ countryName: c.name, iso2: c.iso2 }));
  } catch (error) {
    console.error("Error fetching countries list:", error);
    return [];
  }
};