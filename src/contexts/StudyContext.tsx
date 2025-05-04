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
    longestStreak: 0,
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

        // Fetch user stats
        const { data: userStats, error: userStatsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        let streak = 0;
        let longestStreak = 0;
        let lastActiveDate = null;

        if (userStatsError && userStatsError.code !== 'PGRST116') {
          // PGRST116 means not found, which is expected if this is the user's first time
          console.error("Error fetching user stats:", userStatsError);
          toast.error("Failed to load user stats");
        } else if (userStats) {
          streak = userStats.current_streak;
          longestStreak = userStats.longest_streak;
          lastActiveDate = userStats.last_active_date;
        }

        // Check if user logged in today and update streak if needed
        const today = new Date().toISOString().split('T')[0];
        
        if (!lastActiveDate || lastActiveDate !== today) {
          // User logged in on a new day
          await updateUserStreak(user.id, today, streak, longestStreak);

          // Update local streak values after updating in DB
          const { data: updatedStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (updatedStats) {
            streak = updatedStats.current_streak;
            longestStreak = updatedStats.longest_streak;
          }
        }
        
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

        // Update summary with streak data
        const completedSessions = mappedSessions.filter(session => session.status === "completed");
        const skippedSessions = mappedSessions.filter(session => session.status === "skipped");
        const pendingSessions = mappedSessions.filter(session => session.status === "pending");
        const studyTimeCompleted = completedSessions.reduce((total, session) => total + session.duration, 0);

        setSummary({
          totalSubjects: mappedSubjects.length,
          totalSessions: mappedSessions.length,
          completedSessions: completedSessions.length,
          skippedSessions: skippedSessions.length,
          pendingSessions: pendingSessions.length,
          studyTimeCompleted,
          streak,
          longestStreak,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load your study data");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

  // Helper function to update user streak in the database
  const updateUserStreak = async (userId: string, today: string, currentStreak: number, currentLongestStreak: number) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const { data: userStats, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      let newStreak = 1; // Default to 1 for new day login
      let newLongestStreak = currentLongestStreak;
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking user stats:", error);
        return;
      }
      
      if (!userStats) {
        // Create new record for first-time user
        await supabase.from('user_stats').insert({
          user_id: userId,
          current_streak: newStreak,
          longest_streak: newStreak,
          last_active_date: today
        });
        return;
      }
      
      // User has stats already
      const lastActiveDate = userStats.last_active_date;
      
      if (lastActiveDate === yesterdayStr) {
        // User was active yesterday, increment streak
        newStreak = userStats.current_streak + 1;
      } else if (lastActiveDate === today) {
        // Already logged in today, keep current streak
        newStreak = userStats.current_streak;
      } else {
        // Streak broken, start new streak at 1
        newStreak = 1;
      }
      
      // Update longest streak if needed
      newLongestStreak = Math.max(newStreak, userStats.longest_streak);
      
      await supabase.from('user_stats').upsert({
        user_id: userId,
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_active_date: today
      });
      
    } catch (error) {
      console.error("Error updating user streak:", error);
    }
  };

  // Update summary whenever subjects or sessions change
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
      }));
      return;
    }

    const completedSessions = sessions.filter(session => session.status === "completed");
    const skippedSessions = sessions.filter(session => session.status === "skipped");
    const pendingSessions = sessions.filter(session => session.status === "pending");
    
    // Calculate study time from completed sessions
    const studyTimeCompleted = completedSessions.reduce((total, session) => total + session.duration, 0);
    
    setSummary(prev => ({
      ...prev,
      totalSubjects: subjects.length,
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      skippedSessions: skippedSessions.length,
      pendingSessions: pendingSessions.length,
      studyTimeCompleted,
    }));
  }, [subjects, sessions]);

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
      // Find the subject
      const subjectToUpdate = subjects.find(s => s.id === session.subjectId);
      if (!subjectToUpdate) {
        toast.error("Subject not found");
        return;
      }
      
      // Get existing sessions for this subject to determine the correct order
      const subjectSessions = sessions.filter(s => s.subjectId === session.subjectId);
      
      // Extract session numbers from titles (S1, S2, etc.)
      const sessionNumbers = subjectSessions.map(s => {
        const match = s.title.match(/S(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      });
      
      // Find the next session number (one more than the highest existing number)
      const nextSessionNumber = sessionNumbers.length > 0 ? Math.max(...sessionNumbers) + 1 : 1;
      
      // Create the new session with correct title
      const newSession = {
        user_id: user.id,
        subject_id: session.subjectId,
        title: `S${nextSessionNumber}`,
        description: session.description || null,
        duration: session.duration,
        date: session.date,
        status: session.status
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
      
      toast.success(`Added new session: ${data.title}`);
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
