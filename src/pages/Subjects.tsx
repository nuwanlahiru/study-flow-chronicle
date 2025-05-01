
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Plus, Trash, Pencil } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import SubjectCard from "@/components/subjects/SubjectCard";
import SubjectForm from "@/components/subjects/SubjectForm";
import { Subject } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Subjects = () => {
  const { user } = useAuth();
  const { subjects, addSubject, updateSubject, deleteSubject, loading } = useStudy();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | undefined>(undefined);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-medium">Loading subjects...</p>
        </div>
      </div>
    );
  }

  const handleAddSubject = () => {
    setCurrentSubject(undefined);
    setIsFormOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsFormOpen(true);
  };

  const handleSaveSubject = (subjectData: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => {
    if (currentSubject) {
      updateSubject(currentSubject.id, subjectData);
    } else {
      addSubject(subjectData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = (id: string) => {
    setSubjectToDelete(id);
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete);
      setSubjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <Button onClick={handleAddSubject} className="gradient-bg">
          <Plus className="mr-2 h-4 w-4" /> Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-lg font-semibold">No Subjects Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first subject to start tracking your study sessions
          </p>
          <Button onClick={handleAddSubject} className="mt-4 gradient-bg">
            <Plus className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map(subject => (
            <div key={subject.id} className="border rounded-lg p-6 shadow-sm bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: subject.color }}></div>
                  <h3 className="font-semibold">{subject.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditSubject(subject)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteConfirm(subject.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {subject.completedSessions}/{subject.totalSessions} sessions
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-studypurple-500 rounded-full" 
                    style={{ 
                      width: subject.totalSessions > 0 
                        ? `${(subject.completedSessions / subject.totalSessions) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-studypurple-50 rounded-lg">
                  <p className="font-semibold text-studypurple-700">{subject.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-700">{subject.completedSessions}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <p className="font-semibold text-destructive">{subject.skippedSessions}</p>
                  <p className="text-xs text-muted-foreground">Skipped</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SubjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSubject}
        editSubject={currentSubject}
      />

      <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the subject and all associated sessions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subjects;
