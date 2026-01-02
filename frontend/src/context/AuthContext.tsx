import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AuthApi } from "@/api/auth";
import { type User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await AuthApi.getCurrentUser();
          setUser(userData);
        } catch {
          /**
           * TODO: When migrating to cookies, clear session cookie instead of localStorage.
           */
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { token: newToken, user: userData } = await AuthApi.login({
      email,
      password,
    });
    /**
     * TODO: Remove localStorage management when using cookies.
     */
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    const { token: newToken, user: userData } = await AuthApi.register({
      email,
      password,
    });
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    /**
     * TODO: When implementing cookies, trigger a logout API call to clear the cookie.
     */
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
