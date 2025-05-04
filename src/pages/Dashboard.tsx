
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import SummaryCard from "@/components/dashboard/SummaryCard";
import RecentSessions from "@/components/dashboard/RecentSessions";
import ProgressChart from "@/components/dashboard/ProgressChart";
import SubjectSessionChart from "@/components/dashboard/SubjectSessionChart";
import PomodoroTimer from "@/components/dashboard/PomodoroTimer";
import SubjectMiniSummary from "@/components/dashboard/SubjectMiniSummary";
import { useStudy } from "@/contexts/StudyContext";
import { Book, Clock, Calendar, CalendarCheck, Plus, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const { summary, subjects, sessions, loading } = useStudy();
  
  // Cursor effect state
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-medium">Loading your study data...</p>
        </div>
      </div>
    );
  }

  // Format time for display
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    
    return `${minutes}m`;
  };

  return (
    <motion.div 
      className="space-y-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glassmorphism cursor follower */}
      <div 
        className="pointer-events-none fixed hidden md:block h-32 w-32 rounded-full bg-studypurple-400/10 blur-3xl"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease-out, opacity 0.3s ease-out',
          zIndex: -1,
        }}
      />

      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-3xl font-bold tracking-tight gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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

      {subjects.length === 0 ? (
        <motion.div 
          className="border rounded-lg p-8 text-center backdrop-blur-md bg-white/70 border-white/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-studypurple-100">
            <Book className="h-6 w-6 text-studypurple-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold gradient-text">Get Started with CupCake's StudyFlow</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first subject to begin tracking your study sessions
          </p>
          <div className="mt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/subjects">
                <Button className="gradient-bg">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Subject
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div 
            className="grid gap-4 grid-cols-2 md:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <SummaryCard
                title="Total Study Time"
                value={formatStudyTime(summary.studyTimeCompleted)}
                icon={<Clock className="h-4 w-4" />}
              />
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <SummaryCard
                title="Streak"
                value={`${summary.streak} ${summary.streak === 1 ? 'day' : 'days'}`}
                description={summary.longestStreak > summary.streak ? `Longest: ${summary.longestStreak} days` : ''}
                icon={<Award className="h-4 w-4" />}
              />
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <SummaryCard
                title="Total Subjects"
                value={summary.totalSubjects}
                icon={<Book className="h-4 w-4" />}
              />
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <SummaryCard
                title="Completion Rate"
                value={`${Math.round((summary.completedSessions / summary.totalSessions) * 100) || 0}%`}
                progress={(summary.completedSessions / summary.totalSessions) * 100 || 0}
                icon={<Calendar className="h-4 w-4" />}
              />
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid gap-4 md:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div 
              className="md:col-span-1"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="backdrop-blur-md bg-white/70 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Subjects at a Glance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subjects.map(subject => (
                      <SubjectMiniSummary key={subject.id} subject={subject} sessions={sessions} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              className="md:col-span-3"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <PomodoroTimer />
            </motion.div>
          </motion.div>

          <SubjectSessionChart />

          <motion.div 
            className="grid gap-4 grid-cols-1 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div 
              className="md:col-span-2"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <RecentSessions />
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ProgressChart />
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;
