"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getSessionAPI } from "@/services/auth.service";
import { Role } from "@/types/auth.type";

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  userType: Role;
  image?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 앱이 처음 로드될 때 세션 정보 가져오기
    const initAuth = async () => {
      try {
        const response = await getSessionAPI();

        const userData = response.data?.data?.user;

        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch session", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 내에서 사용해야 합니다.");
  return context;
};
