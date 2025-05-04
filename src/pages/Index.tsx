
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, BarChart3, Calendar, Activity, Brain, Clock, Target, Zap, ArrowRight, ChevronRight, Laptop, MoonStar, Users, CheckCircle2, ListTodo } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-studypurple-50">
      {/* Hero Section */}
      <section className="py-6 md:py-12 lg:py-16 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-6 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 border border-studypurple-200 rounded-full bg-studypurple-50 text-studypurple-600 text-sm font-medium animate-fade-in">
                <Brain size={16} />
                <span>Smart Study Management</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">CupCake's StudyFlow</span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-[600px]">
                  The intelligent study companion that helps you organize, focus, and achieve your academic goals with scientific precision.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={user ? "/dashboard" : "/login"} className="group">
                  <Button size="lg" className="bg-gradient-to-r from-studypurple-500 to-blue-500 hover:from-studypurple-600 hover:to-blue-600 text-white w-full sm:w-auto transition-all shadow-lg hover:shadow-xl">
                    {user ? "Go to Dashboard" : "Start Your Journey"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {!user && (
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-studypurple-200 text-studypurple-600 hover:bg-studypurple-50 w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-studypurple-400" />
                  <span>Track Hours</span>
                </div>
                <div className="flex items-center">
                  <Target className="mr-1 h-4 w-4 text-studypurple-400" />
                  <span>Set Goals</span>
                </div>
                <div className="flex items-center">
                  <Zap className="mr-1 h-4 w-4 text-studypurple-400" />
                  <span>Boost Productivity</span>
                </div>
              </div>
            </div>

            <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-xl shadow-2xl">
              {/* Main productivity dashboard card */}
              <div className="absolute inset-0 bg-gradient-to-br from-studypurple-600 to-blue-600 p-6 flex flex-col">
                {/* Floating elements with animations */}
                <div className="absolute top-6 right-6 h-20 w-20 bg-white/10 backdrop-blur-sm rounded-lg animate-float flex items-center justify-center">
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <div className="absolute bottom-20 left-10 h-16 w-16 bg-white/10 backdrop-blur-sm rounded-lg animate-float-delay-1 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-32 left-12 h-14 w-14 bg-white/10 backdrop-blur-sm rounded-lg animate-float-delay-2 flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div className="absolute bottom-12 right-16 h-18 w-18 bg-white/10 backdrop-blur-sm rounded-lg animate-float-delay-3 flex items-center justify-center">
                  <Target className="h-9 w-9 text-white" />
                </div>
                
                {/* Dashboard content */}
                <div className="relative z-10 mt-4 mb-8">
                  <h3 className="text-white text-xl font-medium">StudyFlow Dashboard</h3>
                  <p className="text-white/80 text-sm">Monday, May 3, 2025</p>
                </div>
                
                {/* Main productivity card */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/20 transform transition-all duration-500 hover:scale-[1.02] hover:bg-white/20">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-300" />
                    Today's Focus Areas
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center bg-white/5 p-3 rounded-lg group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-studypurple-400/30 flex items-center justify-center mr-3">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-white font-medium">Advanced Mathematics</h5>
                        <div className="w-full bg-white/20 h-2 rounded-full mt-1">
                          <div className="bg-gradient-to-r from-studypurple-400 to-blue-400 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                      <span className="text-white/80 text-sm">65%</span>
                    </div>
                    
                    <div className="flex items-center bg-white/5 p-3 rounded-lg group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                        <Laptop className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-white font-medium">Programming Concepts</h5>
                        <div className="w-full bg-white/20 h-2 rounded-full mt-1">
                          <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                      </div>
                      <span className="text-white/80 text-sm">78%</span>
                    </div>
                    
                    <div className="flex items-center bg-white/5 p-3 rounded-lg group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-green-500/30 flex items-center justify-center mr-3">
                        <ListTodo className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-white font-medium">Research Methods</h5>
                        <div className="w-full bg-white/20 h-2 rounded-full mt-1">
                          <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{width: '42%'}}></div>
                        </div>
                      </div>
                      <span className="text-white/80 text-sm">42%</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform transition-all duration-500 hover:scale-[1.05] hover:bg-white/20">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-300 mr-2" />
                      <h5 className="text-white text-sm font-medium">Study Hours</h5>
                    </div>
                    <p className="text-white text-2xl font-bold">24.5</p>
                    <p className="text-green-300 text-xs flex items-center">
                      <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                      +12% this week
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform transition-all duration-500 hover:scale-[1.05] hover:bg-white/20">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-300 mr-2" />
                      <h5 className="text-white text-sm font-medium">Completed Tasks</h5>
                    </div>
                    <p className="text-white text-2xl font-bold">18/25</p>
                    <p className="text-green-300 text-xs flex items-center">
                      <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                      72% completion rate
                    </p>
                  </div>
                </div>
                
                {/* Animated particles in background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-white/10"
                      style={{
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float ${Math.random() * 10 + 10}s linear infinite`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
              <Zap className="mr-1 h-4 w-4" />
              <span>Powerful Features</span>
            </div>
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                Optimize Your Study Habits With Smart Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-[800px] mx-auto">
                Designed with cognitive science principles to help you study smarter, not just harder
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Feature Cards - Each with hover effect and modern styling */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-blue-500 to-studypurple-400 opacity-20 blur-2xl group-hover:opacity-30 transition-all duration-300"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-studypurple-500 to-studypurple-600 text-white shadow-md">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Smart Subject Management</h3>
              <p className="mb-6 text-gray-600">
                Create and organize subjects with intelligent scheduling based on your learning patterns and priorities.
              </p>
              <div className="flex items-center text-studypurple-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-blue-500 to-studypurple-400 opacity-20 blur-2xl group-hover:opacity-30 transition-all duration-300"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-studypurple-500 to-studypurple-600 text-white shadow-md">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Focus-Driven Sessions</h3>
              <p className="mb-6 text-gray-600">
                Plan distraction-free study blocks with built-in Pomodoro techniques and automated session tracking.
              </p>
              <div className="flex items-center text-studypurple-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-blue-500 to-studypurple-400 opacity-20 blur-2xl group-hover:opacity-30 transition-all duration-300"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-studypurple-500 to-studypurple-600 text-white shadow-md">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Analytics Dashboard</h3>
              <p className="mb-6 text-gray-600">
                Visualize your progress with interactive charts and AI-powered insights to optimize your study strategy.
              </p>
              <div className="flex items-center text-studypurple-600 font-medium">
                <span>Learn more</span>
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-studypurple-50 text-studypurple-600 text-sm font-medium">
              <Target className="mr-1 h-4 w-4" />
              <span>Study Flow Process</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              How Study Flow Works
            </h2>
            <p className="text-xl text-gray-600 max-w-[800px]">
              Our scientifically-backed approach to effective studying
            </p>
          </div>
          
          <div className="relative mt-12">
            {/* Process Steps */}
            <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-gradient-to-b from-studypurple-500 to-blue-500 hidden md:block"></div>
            
            <div className="space-y-12 relative">
              {/* Step 1 */}
              <div className="md:grid md:grid-cols-5 md:gap-8 md:space-y-0 items-center">
                <div className="md:col-span-2 md:text-right">
                  <h3 className="text-xl font-bold text-studypurple-600 mb-2">Plan Your Journey</h3>
                  <p className="text-gray-600">
                    Create your personalized study plan by adding subjects, setting goals, and establishing a study schedule that works for you.
                  </p>
                </div>
                
                <div className="flex items-center justify-center mx-auto md:col-span-1 my-4 md:my-0">
                  <div className="relative bg-white h-12 w-12 rounded-full border-4 border-studypurple-500 flex items-center justify-center z-10">
                    <span className="text-studypurple-600 font-bold">1</span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-100">
                    <Brain className="h-8 w-8 text-studypurple-500 mb-2" />
                    <p className="text-sm text-gray-600">
                      Our AI analyzes your schedule and suggests optimal study times based on your energy patterns.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="md:grid md:grid-cols-5 md:gap-8 md:space-y-0 items-center">
                <div className="md:col-span-2 order-1 md:order-3">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Track Your Focus</h3>
                  <p className="text-gray-600">
                    Use our distraction-free study timer with built-in techniques to maintain concentration and record your productive hours.
                  </p>
                </div>
                
                <div className="flex items-center justify-center mx-auto md:col-span-1 my-4 md:my-0 order-2">
                  <div className="relative bg-white h-12 w-12 rounded-full border-4 border-blue-500 flex items-center justify-center z-10">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                </div>
                
                <div className="md:col-span-2 order-3 md:order-1 md:text-right">
                  <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-100">
                    <Clock className="h-8 w-8 text-blue-500 mb-2 md:ml-auto" />
                    <p className="text-sm text-gray-600">
                      Pomodoro timers, ambient sounds, and focus metrics help maximize your concentration during each session.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="md:grid md:grid-cols-5 md:gap-8 md:space-y-0 items-center">
                <div className="md:col-span-2 md:text-right">
                  <h3 className="text-xl font-bold text-studypurple-600 mb-2">Analyze & Improve</h3>
                  <p className="text-gray-600">
                    Review detailed analytics about your study habits, identify patterns, and receive personalized recommendations.
                  </p>
                </div>
                
                <div className="flex items-center justify-center mx-auto md:col-span-1 my-4 md:my-0">
                  <div className="relative bg-white h-12 w-12 rounded-full border-4 border-studypurple-500 flex items-center justify-center z-10">
                    <span className="text-studypurple-600 font-bold">3</span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-100">
                    <Activity className="h-8 w-8 text-studypurple-500 mb-2" />
                    <p className="text-sm text-gray-600">
                      Smart algorithms detect your most productive times and suggest study session optimizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Modes Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                <MoonStar className="mr-1 h-4 w-4" />
                <span>Adaptive Study Environments</span>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Personalized Study Modes
              </h2>
              
              <p className="text-xl text-gray-600">
                Switch between different study environments designed for various learning contexts and cognitive states.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-studypurple-100 flex items-center justify-center mt-1">
                    <Target className="h-3 w-3 text-studypurple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Deep Focus Mode</h3>
                    <p className="text-gray-600">Distraction-free environment with focus-enhancing sounds and minimalist interface.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <Laptop className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Research Mode</h3>
                    <p className="text-gray-600">Split-screen capabilities with integrated note-taking and resource management.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-studypurple-100 flex items-center justify-center mt-1">
                    <Users className="h-3 w-3 text-studypurple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Collaboration Mode</h3>
                    <p className="text-gray-600">Tools for group study sessions with shared notes and progress tracking.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/features" className="inline-flex items-center text-studypurple-600 font-medium hover:text-studypurple-700 group">
                <span>Explore all study modes</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Placeholder for study mode preview image - in a real app this would be an actual screenshot */}
                <div className="aspect-video bg-gradient-to-br from-studypurple-500/90 to-blue-500/90 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-2">Deep Focus Mode</h3>
                    <p className="text-white/80">Interactive 3D preview would appear here</p>
                  </div>
                </div>
                
                {/* Control buttons for demonstration */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 bg-studypurple-50/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-studypurple-100 text-studypurple-600 text-sm font-medium">
              <Users className="mr-1 h-4 w-4" />
              <span>Student Success Stories</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              See How Others Achieved Their Goals
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Testimonial 1 */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all transform hover:scale-[1.02] duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-studypurple-500">James Smith</h4>
                  <p className="text-sm text-gray-600">Medical Student</p>
                </div>
              </div>
              <p className="text-gray-600">"StudyFlow transformed how I prepare for exams. The analytics helped me identify my peak productivity hours and optimize my schedule accordingly."</p>
              <div className="flex mt-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all transform hover:scale-[1.02] duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-studypurple-400 to-studypurple-600 flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-bold">ML</span>
                </div>
                <div>
                  <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">Maria Lee</h4>
                  <p className="text-sm text-gray-600">Computer Science Major</p>
                </div>
              </div>
              <p className="text-gray-600">"The focus timer and built-in Pomodoro technique helped me overcome procrastination. I'm now getting more done in less time with better retention."</p>
              <div className="flex mt-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all transform hover:scale-[1.02] duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-bold">DR</span>
                </div>
                <div>
                  <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-studypurple-500">David Rodriguez</h4>
                  <p className="text-sm text-gray-600">MBA Student</p>
                </div>
              </div>
              <p className="text-gray-600">"The collaboration features made group projects so much easier to manage. We could track contributions and progress in real-time, improving our team efficiency."</p>
              <div className="flex mt-4">
                <span className="text-yellow-400">★★★★☆</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-studypurple-600 to-blue-600 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" style={{backgroundSize: '32px 32px'}}></div>
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl mx-auto text-center text-white">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Study Habits?
                </h2>
                <p className="mt-4 md:text-xl text-white/90 max-w-xl mx-auto">
                  Join thousands of students who've improved their academic performance with StudyFlow's intelligent study management system.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Link to={user ? "/dashboard" : "/login"}>
                    <Button size="lg" className="bg-white text-studypurple-600 hover:bg-white/90 shadow-lg w-full sm:w-auto">
                      {user ? "Go to Dashboard" : "Start Free"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/features">
                    <Button size="lg" className="bg-white/90 backdrop-blur-md border border-white/50 text-studypurple-600 hover:bg-white shadow-lg w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
