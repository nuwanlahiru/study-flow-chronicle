

export type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
};

export type Session = {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  status: "pending" | "completed" | "skipped";
  date: string;
  subjectId: string;
  userId?: string;
};

export type Subject = {
  id: string;
  name: string;
  color: string;
  totalSessions: number;
  completedSessions: number;
  skippedSessions: number;
  userId: string;
};

export type StudySummary = {
  totalSubjects: number;
  totalSessions: number;
  completedSessions: number;
  skippedSessions: number;
  pendingSessions: number;
  studyTimeCompleted: number; // in minutes
  streak: number; // consecutive days with at least one completed session
  longestStreak: number; // longest streak ever achieved
};

export type UserStats = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  created_at?: string;
  updated_at?: string;
};

