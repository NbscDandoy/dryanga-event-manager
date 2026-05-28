// src/app/context/AuthContext.tsx
import { 
  createContext, 
  useContext,
  useState, 
  ReactNode } 
  from "react";

interface User {
  fullName: string;
  studentId: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User | null>;
  logout: () => void;
  register: (fullName: string, studentId: string, email: string, password: string, rememberMe?: boolean) => Promise<User | null>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check both localStorage AND sessionStorage so refresh doesn't break active states
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<User | null> => {
    try {
      if (email.endsWith("@dyci.edu.ph") && password.length >= 6) {
        const emailPrefix = email.split("@")[0];
        const nameParts = emailPrefix.split(".").filter(p => isNaN(Number(p)));
        const formattedName = nameParts
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const loggedUser: User = {
          fullName: formattedName || "DYCI Student",
          studentId: "STU" + Math.floor(100000 + Math.random() * 900000),
          email,
        };

        setUser(loggedUser);
        
        // Clear all states first to avoid cross-contamination
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(loggedUser));
        } else {
          // If rememberMe is false, back it up to sessionStorage so page refreshes don't break it
          sessionStorage.setItem("user", JSON.stringify(loggedUser));
        }
        return loggedUser;
      }
      return null;
    } catch (err) {
      console.error("Login error:", err);
      return null;
    }
  };

  const register = async (
    fullName: string,
    studentId: string,
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<User | null> => {
    try {
      const newUser: User = { fullName, studentId, email };
      setUser(newUser);
      
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        // Fallback save to sessionStorage so a browser refresh keeps you logged in
        sessionStorage.setItem("user", JSON.stringify(newUser));
      }
      return newUser;
    } catch (err) {
      console.error("Register error:", err);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      console.log("Sending reset link to:", email);
      return true;
    } catch (err) {
      console.error("Reset password error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, resetPassword }}>
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