import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean | null;
  login: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  user: {
    email: string;
    name: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null,
  );

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const [loggedIn, email, name] = await AsyncStorage.multiGet([
          "isLoggedIn",
          "userEmail",
          "userName",
        ]);

        const isAuthenticated = loggedIn[1] === "true";
        setIsLoggedIn(isAuthenticated);

        if (isAuthenticated && email[1] && name[1]) {
          setUser({
            email: email[1],
            name: name[1],
          });
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, name: string) => {
    try {
      await AsyncStorage.multiSet([
        ["isLoggedIn", "true"],
        ["userEmail", email],
        ["userName", name],
      ]);

      setIsLoggedIn(true);
      setUser({ email, name });
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["isLoggedIn", "userEmail", "userName"]);
      setIsLoggedIn(false);
      setUser(null);
      router.replace("/auth");
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
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
