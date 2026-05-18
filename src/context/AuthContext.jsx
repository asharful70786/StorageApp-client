import { createContext, useContext, useState, useEffect } from "react";
import { fetchUser } from "../api/userApi";
import { logoutUser as apiLogoutUser } from "../api/userApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await fetchUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await apiLogoutUser();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}