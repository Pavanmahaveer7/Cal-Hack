import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, token: authToken } = await authService.login({
        email,
        password,
      });

      setUser(loggedInUser);
      setToken(authToken);

      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
    } catch (error) {
      throw error;
    }
  };

  const signup = async (signupData: any) => {
    try {
      const { user: newUser, token: authToken } = await authService.signup(signupData);

      setUser(newUser);
      setToken(authToken);

      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      setUser(null);
      setToken(null);

      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
