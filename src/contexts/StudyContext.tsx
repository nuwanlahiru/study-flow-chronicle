
import React, { createContext, useState, useEffect, useContext } from "react";
import { Subject, Session, StudySummary } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";

interface StudyContextType {
  subjects: Subject[];
  sessions: Session[];
  summary: StudySummary;
  addSubject: (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addSession: (session: Omit<Session, "id" | "status">) => void;
  updateSessionStatus: (id: string, status: "pending" | "completed" | "skipped") => void;
  deleteSession: (id: string) => void;
  loading: boolean;
}

const StudyContext = createContext<StudyContextType | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [summary, setSummary] = useState<StudySummary>({
    totalSubjects: 0,
    totalSessions: 0,
    completedSessions: 0,
    skippedSessions: 0,
    pendingSessions: 0,
    studyTimeCompleted: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load data from localStorage or eventually from Firebase
  useEffect(() => {
    if (user) {
      const loadData = () => {
        try {
          const storedSubjects = localStorage.getItem(`study-flow-subjects-${user.id}`);
          const storedSessions = localStorage.getItem(`study-flow-sessions-${user.id}`);
          
          if (storedSubjects) {
            setSubjects(JSON.parse(storedSubjects));
          }
          
          if (storedSessions) {
            setSessions(JSON.parse(storedSessions));
          }
        } catch (error) {
          console.error("Error loading data:", error);
          toast.error("Failed to load your study data");
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    } else {
      setSubjects([]);
      setSessions([]);
      setLoading(false);
    }
  }, [user]);

  // Update summary whenever subjects or sessions change
  useEffect(() => {
    if (subjects.length === 0 && sessions.length === 0) {
      setSummary({
        totalSubjects: 0,
        totalSessions: 0,
        completedSessions: 0,
        skippedSessions: 0,
        pendingSessions: 0,
        studyTimeCompleted: 0,
        streak: 0,
      });
      return;
    }

    const completedSessions = sessions.filter(session => session.status === "completed");
    const skippedSessions = sessions.filter(session => session.status === "skipped");
    const pendingSessions = sessions.filter(session => session.status === "pending");
    
    // Calculate study time from completed sessions
    const studyTimeCompleted = completedSessions.reduce((total, session) => total + session.duration, 0);
    
    // Calculate streak
    // This is simplified - a real streak calculation would be more complex
    const streak = calculateStreak(completedSessions);

    setSummary({
      totalSubjects: subjects.length,
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      skippedSessions: skippedSessions.length,
      pendingSessions: pendingSessions.length,
      studyTimeCompleted,
      streak,
    });
  }, [subjects, sessions]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`study-flow-subjects-${user.id}`, JSON.stringify(subjects));
    }
  }, [subjects, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`study-flow-sessions-${user.id}`, JSON.stringify(sessions));
    }
  }, [sessions, user]);

  // Helper function to calculate streak
  const calculateStreak = (completedSessions: Session[]) => {
    if (completedSessions.length === 0) return 0;
    
    // Sort sessions by date (most recent first)
    const sortedSessions = [...completedSessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Group sessions by date
    const sessionsByDate: Record<string, Session[]> = {};
    sortedSessions.forEach(session => {
      const dateStr = new Date(session.date).toISOString().split('T')[0];
      if (!sessionsByDate[dateStr]) {
        sessionsByDate[dateStr] = [];
      }
      sessionsByDate[dateStr].push(session);
    });
    
    // Convert to array of dates that have completed sessions
    const datesWithSessions = Object.keys(sessionsByDate).sort().reverse();
    
    if (datesWithSessions.length === 0) return 0;
    
    // Check if today has a completed session
    const today = new Date().toISOString().split('T')[0];
    
    if (datesWithSessions[0] !== today) return 0;
    
    let streak = 1;
    
    // Calculate consecutive days with completed sessions
    for (let i = 1; i < datesWithSessions.length; i++) {
      const currentDate = new Date(datesWithSessions[i-1]);
      const prevDate = new Date(datesWithSessions[i]);
      
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const addSubject = (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => {
    if (!user) {
      toast.error("You must be logged in to add a subject");
      return;
    }
    
    const newSubject: Subject = {
      id: `subject_${Date.now()}`,
      userId: user.id,
      totalSessions: 0,
      completedSessions: 0,
      skippedSessions: 0,
      ...subject,
    };
    
    setSubjects(prev => [...prev, newSubject]);
    toast.success(`Added new subject: ${subject.name}`);
  };

  const updateSubject = (id: string, subjectUpdate: Partial<Subject>) => {
    setSubjects(prev =>
      prev.map(subject =>
        subject.id === id ? { ...subject, ...subjectUpdate } : subject
      )
    );
    toast.success("Subject updated");
  };

  const deleteSubject = (id: string) => {
    // Delete the subject
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    
    // Also delete all sessions for this subject
    setSessions(prev => prev.filter(session => session.subjectId !== id));
    
    toast.success("Subject and its sessions deleted");
  };

  const addSession = (session: Omit<Session, "id" | "status">) => {
    if (!user) {
      toast.error("You must be logged in to add a session");
      return;
    }
    
    const newSession: Session = {
      id: `session_${Date.now()}`,
      status: "pending",
      ...session,
    };
    
    setSessions(prev => [...prev, newSession]);
    
    // Update the subject's total sessions count
    setSubjects(prev =>
      prev.map(subject =>
        subject.id === session.subjectId
          ? { ...subject, totalSessions: subject.totalSessions + 1 }
          : subject
      )
    );
    
    toast.success(`Added new session: ${session.title}`);
  };

  const updateSessionStatus = (id: string, status: "pending" | "completed" | "skipped") => {
    // Find the session to update
    const sessionToUpdate = sessions.find(session => session.id === id);
    if (!sessionToUpdate) {
      toast.error("Session not found");
      return;
    }
    
    // Get the old status to update subject counts correctly
    const oldStatus = sessionToUpdate.status;
    
    // Update the session
    setSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, status } : session
      )
    );
    
    // Update the subject's completed/skipped session counts
    if (oldStatus !== status) {
      setSubjects(prev =>
        prev.map(subject => {
          if (subject.id === sessionToUpdate.subjectId) {
            let completedSessions = subject.completedSessions;
            let skippedSessions = subject.skippedSessions;
            
            // Remove counts from old status
            if (oldStatus === "completed") completedSessions -= 1;
            if (oldStatus === "skipped") skippedSessions -= 1;
            
            // Add counts to new status
            if (status === "completed") completedSessions += 1;
            if (status === "skipped") skippedSessions += 1;
            
            return {
              ...subject,
              completedSessions,
              skippedSessions,
            };
          }
          return subject;
        })
      );
    }
    
    toast.success(`Session marked as ${status}`);
  };

  const deleteSession = (id: string) => {
    // Find the session to delete
    const sessionToDelete = sessions.find(session => session.id === id);
    if (!sessionToDelete) {
      toast.error("Session not found");
      return;
    }
    
    // Delete the session
    setSessions(prev => prev.filter(session => session.id !== id));
    
    // Update the subject's total sessions count and completed/skipped counts
    setSubjects(prev =>
      prev.map(subject => {
        if (subject.id === sessionToDelete.subjectId) {
          let completedSessions = subject.completedSessions;
          let skippedSessions = subject.skippedSessions;
          
          if (sessionToDelete.status === "completed") completedSessions -= 1;
          if (sessionToDelete.status === "skipped") skippedSessions -= 1;
          
          return {
            ...subject,
            totalSessions: subject.totalSessions - 1,
            completedSessions,
            skippedSessions,
          };
        }
        return subject;
      })
    );
    
    toast.success("Session deleted");
  };

  return (
    <StudyContext.Provider
      value={{
        subjects,
        sessions,
        summary,
        addSubject,
        updateSubject,
        deleteSubject,
        addSession,
        updateSessionStatus,
        deleteSession,
        loading,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => {
  const context = useContext(StudyContext);
  
  if (!context) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  
  return context;
};
