
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, login, loading } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full p-4 bg-studypurple-100">
              <BookOpen className="h-10 w-10 text-studypurple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to StudyFlow</CardTitle>
          <CardDescription>
            Log in to track your study sessions and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={login} 
            disabled={loading} 
            className="w-full gradient-bg"
            size="lg"
          >
            {loading ? "Logging in..." : "Login with Google"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Mock Login
              </span>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            This is a demo application. In the final version, this would connect to Firebase for Google authentication.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
