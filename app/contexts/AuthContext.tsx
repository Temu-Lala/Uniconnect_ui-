"use client"

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { decodeJwt } from "jose";
import axios from 'axios';
import { toast } from "sonner";

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  user: { id: number, username: string, email: string } | null;
  setUser: (user: { id: number, username: string, email: string } | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: "",
  setToken: () => {},
  user: null,
  setUser: () => {},
  logout: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: number, username: string, email: string } | null>(null);
  const [token, setToken] = useState<string>(() => localStorage?.getItem("token") || "");

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API}/logout/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (true) { //setting to true cause the logout endpoint is currently not working so logging out from frontend
        setToken("");
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
        toast.message("Logged out successfully.");
        router.replace("/Login");
      } else {
        toast.message("Failed to logout.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const decodeToken = (token: string) => {
    try {
      const decoded = decodeJwt(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const fetchUserData = async (token: string, id: number) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API}/GustUser/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Gust user data : ", response.data)
        const data = response.data;
        setUser({ id: data.id, username: data.username, email: data.email });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.error("User not found:", error.response.data);
      } else {
        console.error("Error fetching user data:", error);
      }
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const decoded = decodeToken(token);
      if (decoded && typeof decoded.user_id === 'number') {
        fetchUserData(token, decoded.user_id);
        setIsLoggedIn(true);
      } else {
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        logout,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};