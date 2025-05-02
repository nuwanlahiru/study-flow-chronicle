
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
import { Book, Clock, Calendar, CalendarCheck, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const { summary, subjects, sessions, loading } = useStudy();
  
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {subjects.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-studypurple-100">
            <Book className="h-6 w-6 text-studypurple-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Get Started with CupCake's StudyFlow</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first subject to begin tracking your study sessions
          </p>
          <div className="mt-6">
            <Link to="/subjects">
              <Button className="gradient-bg">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Subject
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <SummaryCard
              title="Total Study Time"
              value={formatStudyTime(summary.studyTimeCompleted)}
              icon={<Clock className="h-4 w-4" />}
            />
            <SummaryCard
              title="Current Streak"
              value={`${summary.streak} ${summary.streak === 1 ? 'day' : 'days'}`}
              icon={<CalendarCheck className="h-4 w-4" />}
            />
            <SummaryCard
              title="Total Subjects"
              value={summary.totalSubjects}
              icon={<Book className="h-4 w-4" />}
            />
            <SummaryCard
              title="Total Sessions"
              value={summary.totalSessions}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>

          {/* Subject Session Chart - Moved to top position for visibility */}
          <SubjectSessionChart />

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="md:col-span-1">
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
            
            <div className="md:col-span-3">
              <PomodoroTimer />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <RecentSessions />
            <ProgressChart />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
