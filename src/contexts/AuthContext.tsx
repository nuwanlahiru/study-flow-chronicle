
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session as SupabaseSession } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  session: SupabaseSession | null;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          const userData: User = {
            id: currentSession.user.id,
            name: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.name || 'User',
            email: currentSession.user.email || '',
            photoURL: currentSession.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentSession.user.id}`
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const userData: User = {
          id: currentSession.user.id,
          name: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.name || 'User',
          email: currentSession.user.email || '',
          photoURL: currentSession.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentSession.user.id}`
        };
        setUser(userData);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: "demo@example.com",
        password: "password"
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Failed to login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(`Failed to login with Google: ${error.message}`);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      toast.info("You have been logged out");
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(`Failed to logout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, session, login, loginWithGoogle, logout }}>
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
