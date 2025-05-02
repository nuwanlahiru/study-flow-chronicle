
import React, { createContext, useState, useEffect, useContext } from "react";
import { Subject, Session, StudySummary } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

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

  // Load data from Supabase
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          setLoading(true);
          await fetchSubjects();
          await fetchSessions();
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

  // Fetch subjects from Supabase
  const fetchSubjects = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
      return;
    }
    
    if (!data) {
      console.error("No data returned from subjects query");
      return;
    }
    
    // Transform the data to match the Subject type
    const transformedSubjects: Subject[] = data.map(subject => ({
      id: subject.id,
      name: subject.name,
      color: subject.color,
      totalSessions: 0, // We'll update this with session counts later
      completedSessions: 0,
      skippedSessions: 0,
      userId: subject.user_id
    }));
    
    setSubjects(transformedSubjects);
  };

  // Fetch sessions from Supabase
  const fetchSessions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
      return;
    }
    
    if (!data) {
      console.error("No data returned from sessions query");
      return;
    }
    
    // Transform the data to match the Session type
    const transformedSessions: Session[] = data.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description || "",
      duration: session.duration,
      status: session.status as "pending" | "completed" | "skipped",
      date: session.date,
      subjectId: session.subject_id
    }));
    
    setSessions(transformedSessions);
  };

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

    // Update subject statistics based on sessions
    const updatedSubjects = subjects.map(subject => {
      const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
      const completedSessions = subjectSessions.filter(session => session.status === "completed").length;
      const skippedSessions = subjectSessions.filter(session => session.status === "skipped").length;
      
      return {
        ...subject,
        totalSessions: subjectSessions.length,
        completedSessions,
        skippedSessions
      };
    });
    
    setSubjects(updatedSubjects);

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

  const addSubject = async (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => {
    if (!user) {
      toast.error("You must be logged in to add a subject");
      return;
    }
    
    try {
      // Define the type for the insert data
      type SubjectInsert = Database['public']['Tables']['subjects']['Insert'];
      
      const insertData: SubjectInsert = {
        name: subject.name,
        color: subject.color,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('subjects')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error("No data returned after insert");
      }
      
      const newSubject: Subject = {
        id: data.id,
        name: data.name,
        color: data.color,
        userId: data.user_id,
        totalSessions: 0,
        completedSessions: 0,
        skippedSessions: 0
      };
      
      setSubjects(prev => [...prev, newSubject]);
      toast.success(`Added new subject: ${subject.name}`);
    } catch (error: any) {
      console.error("Error adding subject:", error);
      toast.error(`Failed to add subject: ${error.message}`);
    }
  };

  const updateSubject = async (id: string, subjectUpdate: Partial<Subject>) => {
    try {
      // Define type for the update data
      type SubjectUpdate = Database['public']['Tables']['subjects']['Update'];
      const updateData: SubjectUpdate = {};
      
      if (subjectUpdate.name) updateData.name = subjectUpdate.name;
      if (subjectUpdate.color) updateData.color = subjectUpdate.color;
      
      const { error } = await supabase
        .from('subjects')
        .update(updateData)
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
      toast.error(`Failed to update subject: ${error.message}`);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      // Delete the subject (cascade will handle sessions)
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      setSessions(prev => prev.filter(session => session.subjectId !== id));
      
      toast.success("Subject and its sessions deleted");
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      toast.error(`Failed to delete subject: ${error.message}`);
    }
  };

  const addSession = async (session: Omit<Session, "id">) => {
    if (!user) {
      toast.error("You must be logged in to add a session");
      return;
    }
    
    try {
      // Define the type for the insert data
      type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
      
      const insertData: SessionInsert = {
        title: session.title,
        description: session.description,
        duration: session.duration,
        date: session.date,
        status: session.status,
        subject_id: session.subjectId,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('sessions')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error("No data returned after insert");
      }
      
      const newSession: Session = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        duration: data.duration,
        status: data.status as "pending" | "completed" | "skipped",
        date: data.date,
        subjectId: data.subject_id
      };
      
      setSessions(prev => [...prev, newSession]);
      
      toast.success(`Added new session: ${session.title}`);
    } catch (error: any) {
      console.error("Error adding session:", error);
      toast.error(`Failed to add session: ${error.message}`);
    }
  };

  const updateSessionStatus = async (id: string, status: "pending" | "completed" | "skipped") => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the session in state
      setSessions(prev =>
        prev.map(session =>
          session.id === id ? { ...session, status } : session
        )
      );
      
      toast.success(`Session marked as ${status}`);
    } catch (error: any) {
      console.error("Error updating session status:", error);
      toast.error(`Failed to update session: ${error.message}`);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state
      setSessions(prev => prev.filter(session => session.id !== id));
      
      toast.success("Session deleted");
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast.error(`Failed to delete session: ${error.message}`);
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
