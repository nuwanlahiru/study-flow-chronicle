
import React, { useState, useEffect } from "react";
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
  Trash2,
  Edit,
  MoreVertical
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
  useEffect(() => {
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

  const handleSaveSession = (sessionData: Omit<Session, "id">) => {
    if (currentSession) {
      // For editing, preserve the existing status
      updateSessionStatus(currentSession.id, sessionData.status);
    } else {
      // For new sessions, use the provided status
      addSession(sessionData);
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

  const changeSessionStatus = (session: Session, newStatus: "pending" | "completed" | "skipped") => {
    updateSessionStatus(session.id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
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
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto mb-6">
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the session. This action cannot be undone.
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

  // Helper function to render sessions list
  function renderSessionsList(sessionsToRender: Session[]) {
    if (sessionsToRender.length === 0) {
      return (
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-lg font-semibold">No Sessions Found</h2>
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
        </div>
      );
    }

    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sessionsToRender.map(session => (
          <div key={session.id} className="border rounded-lg shadow-sm bg-card overflow-hidden flex flex-col">
            <div className="p-4">
              <div 
                className="w-full h-1 rounded mb-4" 
                style={{ backgroundColor: getSubjectForSession(session.subjectId)?.color || "#ddd" }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getSubjectForSession(session.subjectId)?.name}
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditSession(session)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => changeSessionStatus(session, "pending")} 
                      disabled={session.status === "pending"}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => changeSessionStatus(session, "completed")}
                      disabled={session.status === "completed"}
                    >
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => changeSessionStatus(session, "skipped")}
                      disabled={session.status === "skipped"}
                    >
                      <CalendarX className="mr-2 h-4 w-4" />
                      Mark as Skipped
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteConfirm(session.id)}
                      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {session.description && (
                <p className="text-sm mt-2">{session.description}</p>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {session.duration} min
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(session.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className={`px-4 py-3 text-sm font-medium flex justify-between items-center ${
                session.status === 'completed' 
                  ? 'bg-studypurple-100 text-studypurple-700' 
                  : session.status === 'skipped' 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className="flex items-center">
                  {session.status === 'completed' && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  {session.status === 'skipped' && (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  {session.status === 'pending' && (
                    <Clock className="mr-2 h-4 w-4" />
                  )}
                  Status: {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </div>
                
                <div className="flex gap-1">
                  {session.status !== 'completed' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-studypurple-700 hover:bg-studypurple-200"
                      onClick={() => changeSessionStatus(session, "completed")}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  {session.status !== 'skipped' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-destructive hover:bg-destructive/20"
                      onClick={() => changeSessionStatus(session, "skipped")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {session.status !== 'pending' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-muted-foreground hover:bg-muted"
                      onClick={() => changeSessionStatus(session, "pending")}
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default Sessions;
