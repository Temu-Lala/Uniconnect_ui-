// contexts/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (formData: LoginForm) => Promise<void>; // Adjust the type according to your form data structure
  register: (formData: RegisterForm) => Promise<void>; // Adjust the type according to your form data structure
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  // Define the structure of the register form data
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => {},
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = async (formData: LoginForm) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Update user state
        localStorage.setItem("token", data.token);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  

  const register = async (formData: RegisterForm) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Handle successful registration
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
