
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Calendar,
  Clock,
  CalendarCheck,
  CalendarX,
  Filter,
  Check,
  SkipForward,
  X,
} from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import SessionCard from "@/components/sessions/SessionCard";
import SessionForm from "@/components/sessions/SessionForm";
import { Session } from "@/types";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Sessions = () => {
  const { user } = useAuth();
  const { subjects, sessions, addSession, updateSessionStatus, deleteSession, loading } = useStudy();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialSubjectId = searchParams.get("subjectId") || undefined;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | undefined>(undefined);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string | "all">("all");
  const [activeTab, setActiveTab] = useState("all");
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-medium">Loading sessions...</p>
        </div>
      </div>
    );
  }

  // Open form with initialSubjectId (from URL params)
  React.useEffect(() => {
    if (initialSubjectId) {
      setIsFormOpen(true);
    }
  }, [initialSubjectId]);

  const handleAddSession = () => {
    setCurrentSession(undefined);
    setIsFormOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setCurrentSession(session);
    setIsFormOpen(true);
  };

  const handleSaveSession = (sessionData: Omit<Session, "id" | "status">) => {
    if (currentSession) {
      // Add the current status when updating
      const updatedSession = {
        ...sessionData,
        status: currentSession.status
      };
      // For editing, we need to preserve the status
      updateSessionStatus(currentSession.id, updatedSession.status);
    } else {
      // For new sessions, set status to pending
      addSession({
        ...sessionData,
        status: "pending"
      });
    }
    
    // If we came from a URL with a subjectId, clear it
    if (initialSubjectId) {
      navigate("/sessions");
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setSessionToDelete(id);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
    }
  };

  // Filter sessions based on active tab and subject filter
  const filteredSessions = sessions.filter(session => {
    // Filter by status
    if (activeTab !== "all" && session.status !== activeTab) {
      return false;
    }
    
    // Filter by subject
    if (filterSubject !== "all" && session.subjectId !== filterSubject) {
      return false;
    }
    
    return true;
  });

  // Sort sessions by date (newest first)
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Find subject for each session
  const getSubjectForSession = (subjectId: string) => {
    return subjects.find(subject => subject.id === subjectId);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Sessions</h1>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white/70 backdrop-blur-sm border border-white/50 hover:bg-white/80">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white/80 backdrop-blur-md border border-white/50">
              <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => setFilterSubject("all")}
                  className="flex items-center justify-between"
                >
                  All Subjects
                  {filterSubject === "all" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                {subjects.map(subject => (
                  <DropdownMenuItem 
                    key={subject.id}
                    onClick={() => setFilterSubject(subject.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span>{subject.name}</span>
                    </div>
                    {filterSubject === subject.id && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleAddSession} className="gradient-bg">
            <Plus className="mr-2 h-4 w-4" /> Add Session
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full max-w-md mx-auto mb-6 backdrop-blur-md bg-white/50 border border-white/30">
          <TabsTrigger value="all" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            All
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <CalendarCheck className="h-4 w-4 mr-2" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="skipped" className="flex items-center">
            <CalendarX className="h-4 w-4 mr-2" />
            Skipped
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <SkipForward className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {renderSessionsList(sortedSessions)}
        </TabsContent>
        
        <TabsContent value="pending">
          {renderSessionsList(sortedSessions)}
        </TabsContent>
        
        <TabsContent value="completed">
          {renderSessionsList(sortedSessions)}
        </TabsContent>

        <TabsContent value="skipped">
          {renderSessionsList(sortedSessions)}
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">{sessions.filter(s => s.status === 'completed').length} sessions</span>
                  </div>
                  <Progress 
                    value={(sessions.filter(s => s.status === 'completed').length / sessions.length) * 100 || 0} 
                    className="h-2 bg-studypurple-100/30" 
                    indicatorClassName="bg-gradient-to-r from-studypurple-500 to-blue-500" 
                  />
                  
                  <div className="flex justify-between text-sm mt-4">
                    <span>Pending</span>
                    <span className="font-medium">{sessions.filter(s => s.status === 'pending').length} sessions</span>
                  </div>
                  <Progress 
                    value={(sessions.filter(s => s.status === 'pending').length / sessions.length) * 100 || 0} 
                    className="h-2 bg-studypurple-100/30" 
                    indicatorClassName="bg-gray-300" 
                  />
                  
                  <div className="flex justify-between text-sm mt-4">
                    <span>Skipped</span>
                    <span className="font-medium">{sessions.filter(s => s.status === 'skipped').length} sessions</span>
                  </div>
                  <Progress 
                    value={(sessions.filter(s => s.status === 'skipped').length / sessions.length) * 100 || 0} 
                    className="h-2 bg-studypurple-100/30" 
                    indicatorClassName="bg-red-400" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map(subject => {
                    const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
                    const percentage = (subjectSessions.length / sessions.length) * 100 || 0;
                    
                    return (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: subject.color }}
                            />
                            <span>{subject.name}</span>
                          </div>
                          <span className="font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2 bg-studypurple-100/30" 
                          indicatorClassName="bg-gradient-to-r from-studypurple-400 to-blue-400" 
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <SessionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSession}
        subjects={subjects}
        editSession={currentSession}
        initialSubjectId={initialSubjectId}
      />

      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-md border border-white/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the session. This action cannot be undone.
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

  // Helper function to render sessions list
  function renderSessionsList(sessionsToRender: Session[]) {
    if (sessionsToRender.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border rounded-lg p-8 text-center backdrop-blur-md bg-white/70 border-white/50"
        >
          <h2 className="text-lg font-semibold gradient-text">No Sessions Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {subjects.length === 0
              ? "Create subjects first before adding sessions"
              : "Create a new session to track your study progress"}
          </p>
          <Button 
            onClick={handleAddSession} 
            className="mt-4 gradient-bg"
            disabled={subjects.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Session
          </Button>
        </motion.div>
      );
    }

    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sessionsToRender.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <SessionCard
              session={session}
              subject={getSubjectForSession(session.subjectId)}
              onStatusChange={updateSessionStatus}
              onEdit={handleEditSession}
              onDelete={handleDeleteConfirm}
            />
          </motion.div>
        ))}
      </div>
    );
  }
};

// Add necessary imports at the top
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default Sessions;
