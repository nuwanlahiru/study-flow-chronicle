
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import SubjectCard from "@/components/subjects/SubjectCard";
import SubjectSessionChart from "@/components/dashboard/SubjectSessionChart";
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
import { motion } from "framer-motion";

const Subjects = () => {
  const { user } = useAuth();
  const { subjects, addSubject, updateSubject, deleteSubject, loading, refreshSubjects } = useStudy();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | undefined>(undefined);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <p className="text-lg font-medium">Loading subjects...</p>
        </div>
      </motion.div>
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
    
    // Force refresh data to ensure everything is updated
    setTimeout(() => {
      refreshSubjects();
    }, 500);
  };

  const handleDeleteConfirm = (id: string) => {
    setSubjectToDelete(id);
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete);
      setSubjectToDelete(null);
      
      // Force refresh data to ensure everything is updated
      setTimeout(() => {
        refreshSubjects();
      }, 500);
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Subjects</h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={handleAddSubject} className="gradient-bg">
            <Plus className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        </motion.div>
      </div>

      {/* Subject-Session Chart */}
      <div className="mb-6">
        <SubjectSessionChart />
      </div>

      {subjects.length === 0 ? (
        <motion.div 
          className="border rounded-lg p-8 text-center backdrop-blur-md bg-white/70 border-white/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold gradient-text">No Subjects Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first subject to start tracking your study sessions
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={handleAddSubject} className="mt-4 gradient-bg">
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {subjects.map((subject, index) => {
            const isComplete = subject.totalSessions > 0 && subject.completedSessions === subject.totalSessions;
            const isSkipped = subject.totalSessions > 0 && subject.skippedSessions === subject.totalSessions;
            
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: isComplete ? "0 10px 25px -5px rgba(155, 135, 245, 0.3)" : 
                            isSkipped ? "0 10px 25px -5px rgba(254, 202, 202, 0.3)" :
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className={`h-full ${
                  isComplete ? 'scale-[1.02]' : 
                  isSkipped ? 'grayscale-[0.3]' : ''
                }`}
              >
                <SubjectCard
                  subject={subject}
                  onEdit={handleEditSubject}
                  onDelete={handleDeleteConfirm}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      <SubjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSubject}
        editSubject={currentSubject}
      />

      <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-md border border-white/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the subject and all associated sessions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/70 hover:bg-white/90">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Subjects;
