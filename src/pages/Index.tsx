
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="container py-10">
      <motion.div 
        className="flex flex-col items-center text-center space-y-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight gradient-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          CupCake StudyFlow
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Track your study sessions, build habits, and reach your academic goals with our modern tracking system
        </motion.p>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div 
          className="backdrop-blur-md bg-white/70 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 rounded-xl"
          whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-studypurple-400 to-blue-400 flex items-center justify-center mb-4 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Session Tracking</h3>
          <p className="text-muted-foreground">
            Plan and track your study sessions across different subjects with our easy-to-use interface.
          </p>
        </motion.div>

        <motion.div 
          className="backdrop-blur-md bg-white/70 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 rounded-xl"
          whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-studypurple-400 to-blue-400 flex items-center justify-center mb-4 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Pomodoro Timer</h3>
          <p className="text-muted-foreground">
            Use our built-in Pomodoro timer to implement effective time management techniques.
          </p>
        </motion.div>

        <motion.div 
          className="backdrop-blur-md bg-white/70 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 rounded-xl"
          whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-studypurple-400 to-blue-400 flex items-center justify-center mb-4 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Progress Analysis</h3>
          <p className="text-muted-foreground">
            View detailed statistics and visualizations of your study progress over time.
          </p>
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="bg-gradient-to-r from-studypurple-50 to-blue-50 backdrop-blur-md border border-white/50 p-8 md:p-12 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Ready to Transform Your Study Habits?
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mb-6 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Get started today and unlock your full learning potential with our comprehensive study session tracking tools.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto text-base font-medium bg-gradient-to-r from-studypurple-500 to-blue-500 hover:from-studypurple-600 hover:to-blue-600 text-white border-0 shadow-md hover:shadow-lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-medium bg-white/80 backdrop-blur-sm border border-studypurple-200 text-studypurple-700 hover:bg-white shadow-md hover:shadow-lg">
              Log In
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Alex Johnson",
              role: "Computer Science Student",
              content: "This app completely changed my study routine. I'm able to stay on track and monitor my progress effortlessly.",
            },
            {
              name: "Sophia Williams",
              role: "Medical Student",
              content: "The Pomodoro timer feature helps me maintain focus during long study sessions. My productivity has improved tremendously.",
            },
            {
              name: "Marcus Lee",
              role: "High School Teacher",
              content: "I recommend CupCake StudyFlow to all my students. It's a fantastic tool for developing consistent study habits.",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-md bg-white/70 border border-white/50 p-6 rounded-xl shadow-md"
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + index * 0.2, duration: 0.5 }}
            >
              <p className="text-muted-foreground mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-studypurple-400 to-blue-400 flex items-center justify-center text-white font-medium">
                  {testimonial.name[0]}
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-semibold">{testimonial.name}</h5>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
