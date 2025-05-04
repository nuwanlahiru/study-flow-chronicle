
import { useState, useEffect } from "react";
import { Subject } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const useSubjects = (userId: string | undefined) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Load subjects from Supabase when userId changes
  useEffect(() => {
    async function loadSubjects() {
      if (!userId) {
        setSubjects([]);
        return;
      }
      
      try {
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (subjectsError) throw subjectsError;
        
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
        
        setSubjects(mappedSubjects);
      } catch (error: any) {
        console.error("Error loading subjects:", error);
        toast.error(error.message || "Failed to load subjects");
      } finally {
        setLoading(false);
      }
    }
    
    loadSubjects();
  }, [userId]);

  // CRUD operations for subjects
  const addSubject = async (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => {
    if (!userId) {
      toast.error("You must be logged in to add a subject");
      return;
    }
    
    try {
      const newSubject = {
        user_id: userId,
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
      
      // Update local state
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      
      toast.success("Subject and its sessions deleted");
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      toast.error(error.message || "Failed to delete subject");
    }
  };

  return {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    loading
  };
};
