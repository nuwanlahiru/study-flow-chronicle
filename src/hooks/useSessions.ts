
import { useState, useEffect, useCallback } from "react";
import { Session, Subject } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const useSessions = (
  userId: string | undefined,
  subjects: Subject[],
  setSubjectsState: React.Dispatch<React.SetStateAction<Subject[]>>
) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    if (!userId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (sessionsError) throw sessionsError;
      
      // Map Supabase data to our app types with proper type casting
      const mappedSessions: Session[] = sessionsData.map((session) => ({
        id: session.id,
        title: session.title,
        description: session.description || "",
        duration: session.duration,
        date: session.date,
        subjectId: session.subject_id,
        status: session.status as "pending" | "completed" | "skipped", // Explicit type cast
        userId: session.user_id
      }));
      
      setSessions(mappedSessions);
    } catch (error: any) {
      console.error("Error loading sessions:", error);
      toast.error(error.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Load initial sessions
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const updateSubjectSessionCounts = useCallback(async (subjectId: string) => {
    // Get sessions for this subject
    const subjectSessions = sessions.filter(session => session.subjectId === subjectId);
    const completedCount = subjectSessions.filter(session => session.status === "completed").length;
    const skippedCount = subjectSessions.filter(session => session.status === "skipped").length;
    
    // Update subject in Supabase
    try {
      const { error } = await supabase
        .from('subjects')
        .update({
          total_sessions: subjectSessions.length,
          completed_sessions: completedCount,
          skipped_sessions: skippedCount
        })
        .eq('id', subjectId);
      
      if (error) throw error;
      
      // Also update the local subjects state
      const updatedSubject = subjects.find(subject => subject.id === subjectId);
      if (updatedSubject) {
        const updatedSubject = {
          ...subjects.find(subject => subject.id === subjectId)!,
          totalSessions: subjectSessions.length,
          completedSessions: completedCount,
          skippedSessions: skippedCount
        };
        
        // Update the subject in the local state
        const updatedSubjects = subjects.map(subject => 
          subject.id === subjectId ? updatedSubject : subject
        );
        
        setSubjectsState(updatedSubjects);
      }
    } catch (error: any) {
      console.error("Error updating subject session counts:", error);
    }
  }, [sessions, subjects, setSubjectsState]);

  // Add a session
  const addSession = async (session: Omit<Session, "id">) => {
    try {
      // Convert app type to Supabase format
      const supabaseSession = {
        title: session.title,
        description: session.description,
        duration: session.duration,
        date: session.date,
        subject_id: session.subjectId,
        status: session.status,
        user_id: userId
      };
      
      const { data, error } = await supabase
        .from('sessions')
        .insert(supabaseSession)
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert Supabase response to our app type
      const newSession: Session = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        duration: data.duration,
        date: data.date,
        subjectId: data.subject_id,
        status: data.status as "pending" | "completed" | "skipped", // Explicit type cast
        userId: data.user_id
      };
      
      // Update local state - add to beginning of the array
      setSessions(prev => [newSession, ...prev]);
      
      // Update the subject's session counts
      await updateSubjectSessionCounts(session.subjectId);
      
      toast.success("Session added");
    } catch (error: any) {
      console.error("Error adding session:", error);
      toast.error(error.message || "Failed to add session");
    }
  };

  // Update session status
  const updateSessionStatus = async (id: string, status: "pending" | "completed" | "skipped") => {
    try {
      // Find the session to update
      const sessionToUpdate = sessions.find(session => session.id === id);
      if (!sessionToUpdate) {
        throw new Error("Session not found");
      }
      
      // Update in Supabase
      const { error } = await supabase
        .from('sessions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const updatedSessions = sessions.map(session =>
        session.id === id ? { ...session, status } : session
      );
      
      setSessions(updatedSessions);
      
      // Update the subject's session counts
      await updateSubjectSessionCounts(sessionToUpdate.subjectId);
      
      toast.success(`Session marked as ${status}`);
    } catch (error: any) {
      console.error("Error updating session status:", error);
      toast.error(error.message || "Failed to update session");
    }
  };

  // Delete a session
  const deleteSession = async (id: string) => {
    try {
      // Find the session to delete to get its subjectId
      const sessionToDelete = sessions.find(session => session.id === id);
      if (!sessionToDelete) {
        throw new Error("Session not found");
      }
      
      // Delete from Supabase
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSessions(prev => prev.filter(session => session.id !== id));
      
      // Update the subject's session counts
      await updateSubjectSessionCounts(sessionToDelete.subjectId);
      
      toast.success("Session deleted");
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast.error(error.message || "Failed to delete session");
    }
  };
  
  const refreshSessions = useCallback(async () => {
    await loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    addSession,
    updateSessionStatus,
    deleteSession,
    loading,
    refreshSessions
  };
};
