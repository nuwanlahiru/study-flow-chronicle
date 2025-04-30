
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useStudy } from "@/contexts/StudyContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import SummaryStats from "@/components/summary/SummaryStats";

const Summary = () => {
  const { user } = useAuth();
  const { subjects, loading } = useStudy();
  
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Summary</h1>
        </div>
        
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-lg font-semibold">No Data to Summarize</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create subjects and sessions to see your study summary
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/subjects">
              <Button className="gradient-bg">
                <Plus className="mr-2 h-4 w-4" /> Add Subject
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Study Summary</h1>
        <Link to="/sessions/new">
          <Button className="gradient-bg">
            <Plus className="mr-2 h-4 w-4" /> Add Session
          </Button>
        </Link>
      </div>
      
      <SummaryStats />
    </div>
  );
};

export default Summary;
