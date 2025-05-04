
import { useState, useEffect } from "react";
import { Subject, Session, StudySummary } from "@/types";

export const useSummary = (
  subjects: Subject[],
  sessions: Session[],
  streak: number,
  longestStreak: number
) => {
  const [summary, setSummary] = useState<StudySummary>({
    totalSubjects: 0,
    totalSessions: 0,
    completedSessions: 0,
    skippedSessions: 0,
    pendingSessions: 0,
    studyTimeCompleted: 0,
    streak: 0,
    longestStreak: 0,
  });

  // Update summary whenever subjects, sessions, streak or longestStreak change
  useEffect(() => {
    if (subjects.length === 0 && sessions.length === 0) {
      setSummary(prev => ({
        ...prev,
        totalSubjects: 0,
        totalSessions: 0,
        completedSessions: 0,
        skippedSessions: 0,
        pendingSessions: 0,
        studyTimeCompleted: 0,
        streak,
        longestStreak
      }));
      return;
    }

    const completedSessions = sessions.filter(session => session.status === "completed");
    const skippedSessions = sessions.filter(session => session.status === "skipped");
    const pendingSessions = sessions.filter(session => session.status === "pending");
    
    // Calculate study time from completed sessions
    const studyTimeCompleted = completedSessions.reduce((total, session) => total + session.duration, 0);
    
    setSummary({
      totalSubjects: subjects.length,
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      skippedSessions: skippedSessions.length,
      pendingSessions: pendingSessions.length,
      studyTimeCompleted,
      streak,
      longestStreak
    });
  }, [subjects, sessions, streak, longestStreak]);

  return { summary };
};
