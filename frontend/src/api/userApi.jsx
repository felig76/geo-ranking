import axios from "axios";

const API_URL = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");

// obtener usuario logueado
export const fetchUser = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/user/me`, {
      withCredentials: true,
    });

    // si hay éxito, retornamos los datos
    return data.success ? data.data : null;
  } catch (err) {
    // si es 401, simplemente retornamos null sin loggear
    if (err.response && err.response.status === 401) {
      return null;
    }

    // para cualquier otro error sí podemos loggear
    console.error("Error fetching user:", err);
    return null;
  }
};

// actualizar usuario
export const updateUser = async (updates) => {
  try {
    const { data } = await axios.patch(`${API_URL}/api/user/me`, updates, { withCredentials: true });
    return data.success ? data.data : null;
  } catch (err) {
    console.error("Error updating user:", err);
    return null;
  }
};

// enviar partida diaria
export const submitDailyGame = async (score) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/user/play`, { score }, { withCredentials: true });
    return data.success ? data.data : null;
  } catch (err) {
    console.error("Error submitting daily game:", err);
    return null;
  }
};