import { createContext, FC, ReactNode, useContext, useState } from "react";
import { login, logout } from "../api/api";

export interface AuthContextValue {
  userId?: string;
  onLogin: (data: { username: string; password: string }) => void;
  onLogout: () => void;
  loading: boolean;
  error: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (data: { username: string; password: string }) => {
    setLoading(true);
    login(data)
      .then(({ User }) => {
        setLoading(false);
        setCurrentUser(User.userId);
      })
      .catch((e) => {
        setLoading(false);
        setError(e.toString());
      });
  };

  const handleLogout = () => {
    logout().finally(() => {
      setCurrentUser(null);
      // navigate("/login")
    });
  };

  const value: AuthContextValue = {
    userId: currentUser,
    loading,
    error,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
