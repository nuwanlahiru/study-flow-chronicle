
import React, { createContext, useState, useContext } from "react";
import { Subject, Session, StudySummary } from "@/types";
import { useAuth } from "./AuthContext";
import { useSubjects } from "@/hooks/useSubjects";
import { useSessions } from "@/hooks/useSessions";
import { useStreak } from "@/hooks/useStreak";
import { useSummary } from "@/hooks/useSummary";

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
  const userId = user?.id;
  
  // Use our custom hooks to manage subjects and sessions
  const [subjectsState, setSubjectsState] = useState<Subject[]>([]);
  const { subjects, addSubject, updateSubject, deleteSubject, loading: subjectsLoading } = useSubjects(userId);
  const { sessions, addSession, updateSessionStatus, deleteSession, loading: sessionsLoading } = useSessions(userId, subjects, setSubjectsState);
  const { streak, longestStreak, loading: streakLoading } = useStreak(userId);
  const { summary } = useSummary(subjects, sessions, streak, longestStreak);

  // Combine loading states
  const loading = subjectsLoading || sessionsLoading || streakLoading;

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
