
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, Calendar, BookOpen } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { motion } from "framer-motion";

const SummaryStats = () => {
  const { summary } = useStudy();
  
  // Calculate completion rate
  const completionRate = summary.totalSessions > 0
    ? (summary.completedSessions / summary.totalSessions) * 100
    : 0;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SummaryCard
        title="Current Streak"
        value={`${summary.currentStreak} days`}
        icon={<Flame className="h-4 w-4" />}
        helpText="A streak is counting consecutive days with completed study sessions. Keep studying daily to build your streak!"
      />
      
      <SummaryCard
        title="Longest Streak"
        value={`${summary.longestStreak} days`}
        description={summary.longestStreak > summary.currentStreak ? "Keep going to beat it!" : "This is your best record!"}
        icon={<Trophy className="h-4 w-4" />}
        helpText="The longest consecutive days you've maintained your study habit. Can you break your record?"
      />
      
      <SummaryCard
        title="Session Status"
        value={`${summary.completedSessions}/${summary.totalSessions}`}
        description={`${summary.skippedSessions} skipped`}
        progress={completionRate}
        icon={<Calendar className="h-4 w-4" />}
        helpText="Shows how many study sessions you've completed out of the total planned sessions."
      />
      
      <SummaryCard
        title="Subject Progress"
        value={summary.subjects}
        description={`${summary.completedSubjects} fully completed`}
        icon={<BookOpen className="h-4 w-4" />}
        helpText="The number of subjects you're currently studying and how many are fully completed."
      />
    </motion.div>
  );
};

export default SummaryStats;
