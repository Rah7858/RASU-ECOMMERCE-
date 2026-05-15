import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem("rasu_user");
    const storedToken = localStorage.getItem("rasu_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        logout();
      }
    }

    // Listen to custom event (used in older components)
    const handleAuthChange = () => {
      const u = localStorage.getItem("rasu_user");
      const t = localStorage.getItem("rasu_token");
      if (u && t) {
        setUser(JSON.parse(u));
        setToken(t);
      } else {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener("rasu-auth-changed", handleAuthChange);
    return () => window.removeEventListener("rasu-auth-changed", handleAuthChange);
  }, []);

  const login = (userData: User, jwtToken: string) => {
    localStorage.setItem("rasu_user", JSON.stringify(userData));
    localStorage.setItem("rasu_token", jwtToken);
    setUser(userData);
    setToken(jwtToken);
    window.dispatchEvent(new Event("rasu-auth-changed"));
  };

  const logout = () => {
    localStorage.removeItem("rasu_user");
    localStorage.removeItem("rasu_token");
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event("rasu-auth-changed"));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
