
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useStudy } from "@/contexts/StudyContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Trophy, Award } from "lucide-react";
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
        <div className="text-center">
          <p className="text-lg font-medium">Loading summary data...</p>
        </div>
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
      className="flex flex-col items-center justify-center space-y-2 bg-white/70 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">Current Streak</span>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {current} {current === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
        
        {longest > 0 && longest !== current && (
          <>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Longest Streak</span>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-studypurple-400 to-blue-500">
                  {longest} {longest === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <HoverCard>
        <HoverCardTrigger>
          <div className="text-xs text-blue-600 cursor-help underline underline-offset-2">What is a streak?</div>
        </HoverCardTrigger>
        <HoverCardContent className="bg-white/90 backdrop-blur-md border border-white/50 shadow-lg w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Study Streaks</h4>
            <p className="text-sm text-gray-600">
              A streak counts the number of consecutive days you've been active on StudyFlow. Login daily to maintain your streak!
            </p>
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
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Study Summary</h1>
      </div>
      
      <StreakDisplay current={summary.streak} longest={summary.longestStreak} />
      
      <SummaryStats />
    </motion.div>
  );
};

export default Summary;
