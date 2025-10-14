import axios from "axios";
const API_URL = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");

export const registerUser = async ({ username, email, password }) => {
  const { data } = await axios.post(
    `${API_URL}/api/auth/register`,
    { username, email, password },
    { withCredentials: true }
  );
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axios.post(
    `${API_URL}/api/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return data;
};

export const logoutUser = async () => {
  const { data } = await axios.post(
    `${API_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return data;
};
