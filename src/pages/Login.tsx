import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
const Login = () => {
  const {
    user,
    login,
    loginWithGoogle,
    loading
  } = useAuth();
  const [searchParams] = useSearchParams();

  // Check for error in URL params
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    if (error) {
      console.error("Auth error:", error, errorDescription);
      toast.error(errorDescription || "Authentication error occurred");
    }
  }, [searchParams]);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full p-4 bg-studypurple-100">
              <BookOpen className="h-10 w-10 text-studypurple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to  StudyFlow</CardTitle>
          <CardDescription>
            Log in to track your study sessions and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={loginWithGoogle} disabled={loading} size="lg" className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 py-0">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="h-5 w-5 mr-2" />
            {loading ? "Logging in..." : "Login with Google"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          <Button onClick={login} disabled={loading} className="w-full gradient-bg" size="lg">
            {loading ? "Logging in..." : "Use Demo Account"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">* DEMO ACCOUNT TEMPORARY NOT WORKING
The demo account allows you to try the application without creating an account.</p>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>;
};
export default Login;