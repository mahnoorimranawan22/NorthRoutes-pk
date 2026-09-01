import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nr_token");
    const savedUser = localStorage.getItem("nr_user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("nr_token");
        localStorage.removeItem("nr_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    // Backend response: { success, data: { user, token, refreshToken } }
    const { token, user: userData } = res.data.data;
    localStorage.setItem("nr_token", token);
    localStorage.setItem("nr_user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await authAPI.register(data);
    const { token, user: userData } = res.data.data;
    localStorage.setItem("nr_token", token);
    localStorage.setItem("nr_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("nr_token");
    localStorage.removeItem("nr_user");
    setUser(null);
    const base = window.location.pathname.startsWith("/NorthRoutes-pk") ? "/NorthRoutes-pk" : "";
    window.location.href = base + "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" || user?.role === "super_admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
