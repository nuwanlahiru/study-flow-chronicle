
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (type?: "google" | "demo") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("study-flow-user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (type: "google" | "demo" = "demo") => {
    try {
      setLoading(true);
      
      // Different user data based on login type
      let mockUser: User;
      
      if (type === "google") {
        // In a real app, this would be replaced with actual Google Auth
        // For now, we'll simulate a Google user login
        mockUser = {
          id: "google-user-123",
          name: "Google User",
          email: "google@example.com",
          photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=google"
        };
        
        // Simulate Google login popup
        // In a real implementation, we'd use something like Firebase Auth or Supabase Auth
        const confirmLogin = window.confirm("This would open a Google login popup in a real app. Proceed with mock Google login?");
        
        if (!confirmLogin) {
          setLoading(false);
          return;
        }
        
        toast.success("Successfully logged in with Google!");
      } else {
        // Demo user
        mockUser = {
          id: "demo-user-123",
          name: "Demo User",
          email: "demo@example.com",
          photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
        };
        toast.success("Demo login successful!");
      }
      
      setUser(mockUser);
      localStorage.setItem("study-flow-user", JSON.stringify(mockUser));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      localStorage.removeItem("study-flow-user");
      toast.info("You have been logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
