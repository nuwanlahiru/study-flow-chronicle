
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useStudy } from "@/contexts/StudyContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Trophy, Award, Info } from "lucide-react";
import SummaryStats from "@/components/summary/SummaryStats";
import { motion } from "framer-motion";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const Summary = () => {
  const { user } = useAuth();
  const { subjects, loading, summary } = useStudy();
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div 
          className="text-center p-8 rounded-xl backdrop-blur-md bg-white/70 border border-white/50 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-medium gradient-text">Loading summary data...</p>
        </motion.div>
      </div>
    );
  }

  // If no subjects, prompt to create one
  if (subjects.length === 0) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Summary</h1>
        </div>
        
        <motion.div 
          className="border rounded-lg p-8 text-center backdrop-blur-md bg-white/70 border-white/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            translateY: -5
          }}
        >
          <h2 className="text-lg font-semibold gradient-text">No Data to Summarize</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create subjects and sessions to see your study summary
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/subjects">
                <Button className="gradient-bg">
                  <Plus className="mr-2 h-4 w-4" /> Add Subject
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const StreakDisplay = ({ current, longest }: { current: number, longest: number }) => (
    <motion.div 
      className="flex flex-col items-center justify-center space-y-2 bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">Current Streak</span>
          <motion.div 
            className="flex items-center space-x-2"
            animate={{ 
              scale: [1, 1.05, 1],
              transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {current} {current === 1 ? 'day' : 'days'}
            </span>
          </motion.div>
        </div>
        
        {longest > 0 && (
          <>
            <div className="hidden md:block h-16 w-px bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Longest Streak</span>
              <motion.div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-purple-500" />
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-studypurple-400 to-blue-500">
                  {longest} {longest === 1 ? 'day' : 'days'}
                </span>
              </motion.div>
            </div>
          </>
        )}
      </div>
      
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.button
            className="text-xs text-blue-600 flex items-center cursor-help mt-2"
            whileHover={{ scale: 1.05 }}
          >
            <Info size={12} className="mr-1" /> What is a streak?
          </motion.button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 backdrop-blur-md bg-white/90 border border-white/50 shadow-xl">
          <div className="space-y-2">
            <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">
              Study Streaks Explained
            </h4>
            <p className="text-sm text-gray-600">
              A streak counts the consecutive days you've been active on StudyFlow. 
              Simply logging in each day maintains your streak!
            </p>
            <p className="text-sm text-gray-600">
              Your <span className="font-medium text-yellow-600">Current Streak</span> shows your ongoing daily activity, 
              while your <span className="font-medium text-studypurple-600">Longest Streak</span> is your personal best.
            </p>
            <div className="text-xs text-gray-500 mt-1">
              Stay consistent to build your streak and watch your progress grow!
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </motion.div>
  );

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-3xl font-bold tracking-tight gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Study Summary
        </motion.h1>
      </div>
      
      <StreakDisplay current={summary.streak} longest={summary.longestStreak} />
      
      <SummaryStats />
    </motion.div>
  );
};

export default Summary;
