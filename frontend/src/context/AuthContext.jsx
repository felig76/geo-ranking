import { createContext, useState, useEffect } from "react";
import { fetchUser } from "../api/userApi.jsx"; // función que hace GET a /user/me

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUser(); // retorna null si no hay token
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};