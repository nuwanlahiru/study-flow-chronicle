
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/contexts/StudyContext";
import { Check, Circle, Plus, X } from "lucide-react";

const SubjectSessionChart = () => {
  const { subjects, sessions, updateSessionStatus, addSession } = useStudy();
  
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
  
  // Handle adding a new session
  const handleAddSession = (subjectId: string) => {
    const subjectSessions = sessionsBySubject[subjectId] || [];
    
    // Extract session numbers from titles (S1, S2, etc.)
    const sessionNumbers = subjectSessions.map(s => {
      const match = s.title.match(/S(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    // Find the next session number
    const nextSessionNumber = sessionNumbers.length > 0 ? Math.max(...sessionNumbers) + 1 : 1;
    
    const newSession = {
      title: `S${nextSessionNumber}`,
      description: "",
      duration: 30, // Default duration (30 minutes)
      date: new Date().toISOString(),
      subjectId,
      status: "pending" as "pending" | "completed" | "skipped" // Explicitly type this
    };
    
    addSession(newSession);
  };
  
  return (
    <Card className="col-span-1 md:col-span-3 overflow-x-auto">
      <CardHeader>
        <CardTitle>Subject-Session Chart</CardTitle>
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
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => {
                const subjectSessions = sessionsBySubject[subject.id] || [];
                
                // Sort sessions by session number in the title
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
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {subjects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No subjects available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectSessionChart;
