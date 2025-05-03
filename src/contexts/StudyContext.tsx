
import React, { createContext, useState, useEffect, useContext } from "react";
import { Subject, Session, StudySummary } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Tables } from "@/integrations/supabase/types";

interface StudyContextType {
  subjects: Subject[];
  sessions: Session[];
  summary: StudySummary;
  addSubject: (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addSession: (session: Omit<Session, "id">) => void;
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

  // Load data from Supabase when user changes
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setSubjects([]);
        setSessions([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (subjectsError) throw subjectsError;
        
        // Fetch sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .order('date', { ascending: false });
        
        if (sessionsError) throw sessionsError;
        
        // Map Supabase data to our app types
        const mappedSubjects: Subject[] = subjectsData.map((subject) => ({
          id: subject.id,
          name: subject.name,
          color: subject.color,
          totalSessions: subject.total_sessions,
          completedSessions: subject.completed_sessions,
          skippedSessions: subject.skipped_sessions,
          userId: subject.user_id
        }));

        const mappedSessions: Session[] = sessionsData.map((session) => ({
          id: session.id,
          title: session.title,
          description: session.description || undefined,
          duration: session.duration,
          status: session.status as "pending" | "completed" | "skipped",
          date: session.date,
          subjectId: session.subject_id,
          userId: session.user_id
        }));
        
        setSubjects(mappedSubjects);
        setSessions(mappedSessions);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load your study data");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
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

  // CRUD operations for subjects
  const addSubject = async (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => {
    if (!user) {
      toast.error("You must be logged in to add a subject");
      return;
    }
    
    try {
      const newSubject = {
        user_id: user.id,
        name: subject.name,
        color: subject.color,
        total_sessions: 0,
        completed_sessions: 0,
        skipped_sessions: 0
      };
      
      const { data, error } = await supabase
        .from('subjects')
        .insert(newSubject)
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert Supabase response to our app type
      const mappedSubject: Subject = {
        id: data.id,
        name: data.name,
        color: data.color,
        totalSessions: data.total_sessions,
        completedSessions: data.completed_sessions,
        skippedSessions: data.skipped_sessions,
        userId: data.user_id
      };
      
      setSubjects(prev => [mappedSubject, ...prev]);
      toast.success(`Added new subject: ${subject.name}`);
    } catch (error: any) {
      console.error("Error adding subject:", error);
      toast.error(error.message || "Failed to add subject");
    }
  };

  const updateSubject = async (id: string, subjectUpdate: Partial<Subject>) => {
    try {
      // Convert app type to Supabase format
      const supabaseUpdate = {
        ...(subjectUpdate.name !== undefined && { name: subjectUpdate.name }),
        ...(subjectUpdate.color !== undefined && { color: subjectUpdate.color }),
        ...(subjectUpdate.totalSessions !== undefined && { total_sessions: subjectUpdate.totalSessions }),
        ...(subjectUpdate.completedSessions !== undefined && { completed_sessions: subjectUpdate.completedSessions }),
        ...(subjectUpdate.skippedSessions !== undefined && { skipped_sessions: subjectUpdate.skippedSessions })
      };
      
      const { error } = await supabase
        .from('subjects')
        .update(supabaseUpdate)
        .eq('id', id);
      
      if (error) throw error;
      
      setSubjects(prev =>
        prev.map(subject =>
          subject.id === id ? { ...subject, ...subjectUpdate } : subject
        )
      );
      
      toast.success("Subject updated");
    } catch (error: any) {
      console.error("Error updating subject:", error);
      toast.error(error.message || "Failed to update subject");
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Sessions will be automatically deleted due to CASCADE constraint
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      setSessions(prev => prev.filter(session => session.subjectId !== id));
      
      toast.success("Subject and its sessions deleted");
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      toast.error(error.message || "Failed to delete subject");
    }
  };

  // CRUD operations for sessions
  const addSession = async (session: Omit<Session, "id">) => {
    if (!user) {
      toast.error("You must be logged in to add a session");
      return;
    }
    
    try {
      // Find the highest session number for this subject
      const subjectSessions = sessions.filter(s => s.subjectId === session.subjectId);
      
      // Determine the next session number
      let nextSessionNumber = 1;
      
      if (subjectSessions.length > 0) {
        // Extract session numbers from titles (S1, S2, etc.)
        const sessionNumbers = subjectSessions.map(s => {
          const match = s.title.match(/S(\d+)/i);
          return match ? parseInt(match[1], 10) : 0;
        });
        
        // Find the highest session number and increment by 1
        nextSessionNumber = Math.max(...sessionNumbers) + 1;
      }
      
      // Create the new session with the correct title
      const updatedSession = {
        ...session,
        title: `S${nextSessionNumber}`
      };
      
      const newSession = {
        user_id: user.id,
        subject_id: updatedSession.subjectId,
        title: updatedSession.title,
        description: updatedSession.description || null,
        duration: updatedSession.duration,
        date: updatedSession.date,
        status: updatedSession.status
      };
      
      const { data, error } = await supabase
        .from('sessions')
        .insert(newSession)
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert Supabase response to our app type
      const mappedSession: Session = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        duration: data.duration,
        status: data.status as "pending" | "completed" | "skipped",
        date: data.date,
        subjectId: data.subject_id,
        userId: data.user_id
      };
      
      setSessions(prev => [mappedSession, ...prev]);
      
      // Update the subject's total sessions count
      const subjectToUpdate = subjects.find(s => s.id === session.subjectId);
      if (subjectToUpdate) {
        const update = {
          total_sessions: subjectToUpdate.totalSessions + 1
        };
        
        if (session.status === 'completed') {
          update['completed_sessions'] = subjectToUpdate.completedSessions + 1;
        } else if (session.status === 'skipped') {
          update['skipped_sessions'] = subjectToUpdate.skippedSessions + 1;
        }
        
        await supabase
          .from('subjects')
          .update(update)
          .eq('id', session.subjectId);
          
        setSubjects(prev =>
          prev.map(subject =>
            subject.id === session.subjectId
              ? { 
                  ...subject, 
                  totalSessions: subject.totalSessions + 1,
                  ...(session.status === 'completed' ? { completedSessions: subject.completedSessions + 1 } : {}),
                  ...(session.status === 'skipped' ? { skippedSessions: subject.skippedSessions + 1 } : {})
                }
              : subject
          )
        );
      }
      
      toast.success(`Added new session: ${updatedSession.title}`);
    } catch (error: any) {
      console.error("Error adding session:", error);
      toast.error(error.message || "Failed to add session");
    }
  };

  const updateSessionStatus = async (id: string, status: "pending" | "completed" | "skipped") => {
    try {
      // Find the session to update
      const sessionToUpdate = sessions.find(session => session.id === id);
      if (!sessionToUpdate) {
        toast.error("Session not found");
        return;
      }
      
      // Get the old status to update subject counts correctly
      const oldStatus = sessionToUpdate.status;
      
      // Update the session in Supabase
      const { error } = await supabase
        .from('sessions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSessions(prev =>
        prev.map(session =>
          session.id === id ? { ...session, status } : session
        )
      );
      
      // Update the subject's completed/skipped session counts
      if (oldStatus !== status) {
        const subjectToUpdate = subjects.find(s => s.id === sessionToUpdate.subjectId);
        
        if (subjectToUpdate) {
          const update = {};
          
          // Remove counts from old status
          if (oldStatus === 'completed') update['completed_sessions'] = subjectToUpdate.completedSessions - 1;
          if (oldStatus === 'skipped') update['skipped_sessions'] = subjectToUpdate.skippedSessions - 1;
          
          // Add counts to new status
          if (status === 'completed') update['completed_sessions'] = (update['completed_sessions'] ?? subjectToUpdate.completedSessions) + 1;
          if (status === 'skipped') update['skipped_sessions'] = (update['skipped_sessions'] ?? subjectToUpdate.skippedSessions) + 1;
          
          await supabase
            .from('subjects')
            .update(update)
            .eq('id', sessionToUpdate.subjectId);
          
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
      }
      
      toast.success(`Session marked as ${status}`);
    } catch (error: any) {
      console.error("Error updating session status:", error);
      toast.error(error.message || "Failed to update session status");
    }
  };

  const deleteSession = async (id: string) => {
    try {
      // Find the session to delete
      const sessionToDelete = sessions.find(session => session.id === id);
      if (!sessionToDelete) {
        toast.error("Session not found");
        return;
      }
      
      // Delete the session in Supabase
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSessions(prev => prev.filter(session => session.id !== id));
      
      // Update the subject's total sessions count and completed/skipped counts
      const subjectToUpdate = subjects.find(s => s.id === sessionToDelete.subjectId);
      
      if (subjectToUpdate) {
        const update = {
          total_sessions: subjectToUpdate.totalSessions - 1
        };
        
        if (sessionToDelete.status === 'completed') {
          update['completed_sessions'] = subjectToUpdate.completedSessions - 1;
        } else if (sessionToDelete.status === 'skipped') {
          update['skipped_sessions'] = subjectToUpdate.skippedSessions - 1;
        }
        
        await supabase
          .from('subjects')
          .update(update)
          .eq('id', sessionToDelete.subjectId);
        
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
      }
      
      toast.success("Session deleted");
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast.error(error.message || "Failed to delete session");
    }
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
