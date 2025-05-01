
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/contexts/StudyContext";
import { Check, Circle, Plus, X, Trash, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

const SubjectSessionChart = () => {
  const { subjects, sessions, updateSessionStatus, addSession, deleteSession, deleteSubject, addSubject } = useStudy();
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<{subjectId: string, sessionId: string} | null>(null);
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
  
  // Group sessions by subject
  const sessionsBySubject = subjects.reduce((acc, subject) => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    acc[subject.id] = subjectSessions;
    return acc;
  }, {} as Record<string, typeof sessions>);
  
  // Find the maximum number of sessions for any subject to determine column width
  const maxSessions = Object.values(sessionsBySubject).reduce((max, subjectSessions) => 
    Math.max(max, subjectSessions.length), 0);
  
  // Add one more column for the "add session" button
  const totalColumns = maxSessions + 1;
  
  // Handle session click
  const handleSessionClick = (session: typeof sessions[0]) => {
    if (session.status === "pending") {
      updateSessionStatus(session.id, "completed");
    } else if (session.status === "completed") {
      updateSessionStatus(session.id, "skipped");
    } else {
      updateSessionStatus(session.id, "pending");
    }
  };

  // Handle removing a session
  const handleRemoveSession = (subjectId: string, sessionId: string) => {
    setSessionToDelete({ subjectId, sessionId });
  };
  
  // Handle adding a new session
  const handleAddSession = (subjectId: string) => {
    const subjectSessions = sessionsBySubject[subjectId] || [];
    const sessionNumber = subjectSessions.length + 1;
    
    const newSession = {
      title: `S${sessionNumber}`,
      description: "",
      duration: 30, // Default duration (30 minutes)
      date: new Date().toISOString(),
      subjectId,
      status: "pending" as "pending" | "completed" | "skipped" // Explicitly type as one of the allowed values
    };
    
    addSession(newSession);
  };

  // Handle removing a subject
  const handleRemoveSubject = (subjectId: string) => {
    setSubjectToDelete(subjectId);
  };

  // Handle adding a new subject
  const handleSaveSubject = (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => {
    addSubject(subject);
    setIsSubjectFormOpen(false);
  };
  
  return (
    <Card className="col-span-1 md:col-span-3 overflow-x-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Subject-Session Chart</CardTitle>
        <Button 
          onClick={() => setIsSubjectFormOpen(true)} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" /> Add Subject
        </Button>
      </CardHeader>
      <CardContent>
        <div className="min-w-full">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" 
                    style={{ minWidth: "150px" }}>
                  Subject
                </th>
                {Array.from({ length: totalColumns }).map((_, index) => {
                  const columnNumber = index + 1;
                  return (
                    <th key={`col-${columnNumber}`} 
                        className="px-2 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        style={{ minWidth: "40px" }}>
                      {index < maxSessions ? `S${columnNumber}` : ""}
                    </th>
                  );
                })}
                <th className="px-2 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    style={{ minWidth: "40px" }}>
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => {
                const subjectSessions = sessionsBySubject[subject.id] || [];
                subjectSessions.sort((a, b) => {
                  // Extract session numbers from titles (S1, S2, etc.)
                  const numA = parseInt(a.title.replace(/\D/g, '') || '0');
                  const numB = parseInt(b.title.replace(/\D/g, '') || '0');
                  return numA - numB;
                });
                
                return (
                  <tr key={subject.id} className="border-t border-border">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: subject.color }}></div>
                        <div className="text-sm font-medium text-foreground">{subject.name}</div>
                      </div>
                    </td>
                    
                    {/* Render existing sessions */}
                    {Array.from({ length: maxSessions }).map((_, index) => {
                      const session = subjectSessions[index];
                      
                      return (
                        <td key={`${subject.id}-session-${index}`} 
                            className="p-1 text-center">
                          {session ? (
                            <div className="relative">
                              <div 
                                onClick={() => handleSessionClick(session)}
                                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                                  session.status === "completed" ? 'bg-studypurple-400 text-white hover:bg-studypurple-500' : 
                                  session.status === "skipped" ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' : 
                                  'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                              >
                                {session.status === "pending" ? (
                                  <Circle size={16} />
                                ) : session.status === "completed" ? (
                                  <Check size={16} />
                                ) : (
                                  <X size={16} />
                                )}
                              </div>
                              <button 
                                onClick={() => handleRemoveSession(subject.id, session.id)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive/80 hover:bg-destructive text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                aria-label="Delete session"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-8 h-8"></div>
                          )}
                        </td>
                      );
                    })}
                    
                    {/* Add session button */}
                    <td className="p-1 text-center">
                      <div 
                        onClick={() => handleAddSession(subject.id)}
                        className="w-8 h-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors bg-muted text-muted-foreground hover:bg-muted/80"
                      >
                        <Plus size={16} />
                      </div>
                    </td>

                    {/* Remove subject button */}
                    <td className="p-1 text-center">
                      <button
                        onClick={() => handleRemoveSubject(subject.id)}
                        className="text-destructive/70 hover:text-destructive transition-colors"
                        aria-label="Delete subject"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {subjects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No subjects available</p>
              <Button 
                onClick={() => setIsSubjectFormOpen(true)} 
                className="mt-4 gradient-bg"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Subject
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Subject Form Dialog */}
      <SubjectForm
        isOpen={isSubjectFormOpen}
        onClose={() => setIsSubjectFormOpen(false)}
        onSave={handleSaveSubject}
      />

      {/* Confirm Session Deletion Dialog */}
      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (sessionToDelete) {
                  deleteSession(sessionToDelete.sessionId);
                  setSessionToDelete(null);
                }
              }} 
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Subject Deletion Dialog */}
      <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subject? All associated sessions will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (subjectToDelete) {
                  deleteSubject(subjectToDelete);
                  setSubjectToDelete(null);
                }
              }} 
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SubjectSessionChart;
