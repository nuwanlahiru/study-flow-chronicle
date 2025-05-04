
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, Brain, Sparkles, Lock, ChevronRight, Mail, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Signup = () => {
  const { user, login } = useAuth();
  const [hoverButton, setHoverButton] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            // Additional user metadata can be added here
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account created successfully! You can now sign in.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
      
      // If user already exists
      if (error.message?.includes("already registered")) {
        toast("Already have an account? Please sign in", {
          action: {
            label: "Sign In",
            onClick: () => window.location.href = "/login",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-studypurple-50 to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-studypurple-400/10"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`
            }}
          />
        ))}
      </div>
      
      {/* Signup card */}
      <div className="relative w-full max-w-md mx-4">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 h-24 w-24 bg-blue-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 bg-studypurple-400/20 rounded-full blur-2xl" />
        
        {/* Main card */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-500">
          {/* Card header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-studypurple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">CupCake's StudyFlow</h2>
                  <p className="text-sm text-white/80">Your study companion</p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm animate-float">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-white/80">Join us and boost your productivity</p>
          </div>
          
          {/* Signup options */}
          <div className="p-6 space-y-5">
            {!showEmailForm ? (
              <>
                {/* Social signup buttons */}
                <div 
                  className={`relative overflow-hidden group rounded-xl transition-all duration-300 ${
                    hoverButton === 'google' ? 'ring-2 ring-red-400 shadow-lg' : 'border border-gray-200'
                  }`}
                  onMouseEnter={() => setHoverButton('google')}
                  onMouseLeave={() => setHoverButton(null)}
                >
                  <Button 
                    onClick={() => login("google")} 
                    className="w-full bg-[#DB4437] hover:bg-[#C53929] text-white flex items-center justify-center py-6 transition-all duration-300"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-red-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    <div className="relative flex items-center">
                      <div className="h-5 w-5 mr-3 bg-white rounded-sm flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path fill="#DB4437" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      <span className="font-medium">Sign up with Google</span>
                      <ChevronRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${hoverButton === 'google' ? 'translate-x-1' : ''}`} />
                    </div>
                  </Button>
                </div>
                
                <div 
                  className={`relative overflow-hidden group rounded-xl transition-all duration-300 ${
                    hoverButton === 'facebook' ? 'ring-2 ring-blue-500 shadow-lg' : 'border border-gray-200'
                  }`}
                  onMouseEnter={() => setHoverButton('facebook')}
                  onMouseLeave={() => setHoverButton(null)}
                >
                  <Button 
                    onClick={() => login("facebook")} 
                    className="w-full bg-[#4267B2] hover:bg-[#3b5998] text-white flex items-center justify-center py-6 transition-all duration-300"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-blue-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    <div className="relative flex items-center">
                      <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" 
                        alt="Facebook logo" 
                        className="h-5 w-5 mr-3" 
                      />
                      <span className="font-medium">Sign up with Facebook</span>
                      <ChevronRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${hoverButton === 'facebook' ? 'translate-x-1' : ''}`} />
                    </div>
                  </Button>
                </div>
                
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-sm text-gray-500">or sign up with email</span>
                  </div>
                </div>
                
                {/* Email option */}
                <div 
                  className={`relative overflow-hidden group rounded-xl transition-all duration-300 ${
                    hoverButton === 'email' ? 'ring-2 ring-studypurple-400 shadow-lg' : 'border border-gray-200'
                  }`}
                  onMouseEnter={() => setHoverButton('email')}
                  onMouseLeave={() => setHoverButton(null)}
                >
                  <Button 
                    onClick={() => setShowEmailForm(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-studypurple-500 hover:from-blue-600 hover:to-studypurple-600 text-white flex items-center justify-center py-6 transition-all duration-300"
                    size="lg"
                  >
                    <div className="relative flex items-center">
                      <Mail className="h-5 w-5 mr-3" />
                      <span className="font-medium">Sign up with Email</span>
                      <ChevronRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${hoverButton === 'email' ? 'translate-x-1' : ''}`} />
                    </div>
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-studypurple-500 hover:from-blue-600 hover:to-studypurple-600"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEmailForm(false)}
                  >
                    Back to Options
                  </Button>
                </div>
              </form>
            )}
            
            {/* Info text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account? <Link to="/login" className="text-studypurple-600 font-medium hover:text-studypurple-700 transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our <a href="#" className="text-studypurple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-studypurple-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
          
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-blue-400/20 to-studypurple-400/20 rounded-bl-3xl" />
          <div className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-tr from-blue-400/20 to-studypurple-400/20 rounded-tr-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
