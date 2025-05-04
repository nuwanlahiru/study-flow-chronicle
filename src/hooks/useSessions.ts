
import { useState, useEffect } from "react";
import { Session, Subject } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const useSessions = (
  userId: string | undefined, 
  subjects: Subject[], 
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sessions from Supabase when userId changes
  useEffect(() => {
    async function loadSessions() {
      if (!userId) {
        setSessions([]);
        return;
      }
      
      try {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .order('date', { ascending: false });
        
        if (sessionsError) throw sessionsError;
        
        // Map Supabase data to our app types
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
        
        setSessions(mappedSessions);
      } catch (error: any) {
        console.error("Error loading sessions:", error);
        toast.error(error.message || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }
    
    loadSessions();
  }, [userId]);

  const addSession = async (session: Omit<Session, "id">) => {
    if (!userId) {
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
        user_id: userId,
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

  return {
    sessions,
    addSession,
    updateSessionStatus,
    deleteSession,
    loading: loading
  };
};
