import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, BarChart3, Calendar, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const Index = () => {
  const {
    user
  } = useAuth();
  return <div className="flex flex-col min-h-[calc(100vh-16rem)]">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-[33px]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl my-0 lg:text-7xl">
                  Track Your Study Progress with <span className="gradient-text">CupCake's StudyFlow</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl py-[12px]">
                  Organize your subjects, plan study sessions, and visualize your progress with our comprehensive study tracking system.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to={user ? "/dashboard" : "/login"}>
                  <Button size="lg" className="gradient-bg">
                    {user ? "Go to Dashboard" : "Get Started"}
                  </Button>
                </Link>
                {!user && <Link to="/login">
                    <Button size="lg" variant="outline" className="px-[31px] mx-[17px]">
                      Log In
                    </Button>
                  </Link>}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-studypurple-100/50 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-40 w-40 text-studypurple-400" />
                </div>
                <div className="absolute top-10 right-10">
                  <div className="h-16 w-16 rounded-full bg-studypurple-200 flex items-center justify-center animate-bounce">
                    <Calendar className="h-8 w-8 text-studypurple-500" />
                  </div>
                </div>
                <div className="absolute bottom-20 left-10">
                  <div className="h-16 w-16 rounded-full bg-studypurple-200 flex items-center justify-center animate-bounce" style={{
                  animationDelay: '0.2s'
                }}>
                    <BarChart3 className="h-8 w-8 text-studypurple-500" />
                  </div>
                </div>
                <div className="absolute bottom-10 right-20">
                  <div className="h-16 w-16 rounded-full bg-studypurple-200 flex items-center justify-center animate-bounce" style={{
                  animationDelay: '0.4s'
                }}>
                    <Activity className="h-8 w-8 text-studypurple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-studypurple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Key Features
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl">
                Everything you need to optimize your study habits and track your progress
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
              <div className="p-3 rounded-full bg-studypurple-100">
                <BookOpen className="h-6 w-6 text-studypurple-400" />
              </div>
              <h3 className="text-xl font-bold">Organize Subjects</h3>
              <p className="text-gray-500 text-center">
                Create and organize your study subjects with customizable color coding
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
              <div className="p-3 rounded-full bg-studypurple-100">
                <Calendar className="h-6 w-6 text-studypurple-400" />
              </div>
              <h3 className="text-xl font-bold">Track Sessions</h3>
              <p className="text-gray-500 text-center">
                Plan, track, and mark sessions as completed or skipped
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
              <div className="p-3 rounded-full bg-studypurple-100">
                <BarChart3 className="h-6 w-6 text-studypurple-400" />
              </div>
              <h3 className="text-xl font-bold">Visualize Progress</h3>
              <p className="text-gray-500 text-center">
                See your progress with beautiful charts and detailed statistics
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;