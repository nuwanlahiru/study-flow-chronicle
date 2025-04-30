
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/contexts/StudyContext";
import { Check, Circle, X } from "lucide-react";

const SubjectSessionChart = () => {
  const { subjects, sessions, updateSessionStatus } = useStudy();
  
  // Group sessions by subject
  const sessionsBySubject = subjects.reduce((acc, subject) => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    acc[subject.id] = subjectSessions;
    return acc;
  }, {} as Record<string, typeof sessions>);
  
  // Find the maximum number of sessions for any subject
  const maxSessions = Object.values(sessionsBySubject).reduce((max, subjectSessions) => 
    Math.max(max, subjectSessions.length), 0);
  
  // Use at least 21 sessions (as shown in the reference image)
  const totalSessionColumns = Math.max(maxSessions, 21);
  
  // Create array of session numbers (S1, S2, S3, etc.)
  const sessionNumbers = Array.from({ length: totalSessionColumns }, (_, i) => `S${i+1}`);

  // Handle session click
  const handleSessionClick = (session: typeof sessions[0] | undefined, subjectId: string, sessionIndex: number) => {
    if (session) {
      // If session exists, update its status
      if (session.status === "pending") {
        updateSessionStatus(session.id, "completed");
      } else if (session.status === "completed") {
        updateSessionStatus(session.id, "skipped");
      } else {
        updateSessionStatus(session.id, "pending");
      }
    } else {
      // If session doesn't exist, create a new one
      const newSession = {
        title: `Session ${sessionIndex + 1}`,
        description: "",
        duration: 30, // Default duration (30 minutes)
        date: new Date().toISOString(),
        subjectId
      };
      
      // Create the session with pending status
      const { addSession } = useStudy();
      addSession(newSession);
    }
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
                {sessionNumbers.map(sessionNum => (
                  <th key={sessionNum} 
                      className="px-2 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      style={{ minWidth: "40px" }}>
                    {sessionNum}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject.id} className="border-t border-border">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: subject.color }}></div>
                      <div className="text-sm font-medium text-foreground">{subject.name}</div>
                    </div>
                  </td>
                  {sessionNumbers.map((sessionNum, index) => {
                    const subjectSessions = sessionsBySubject[subject.id] || [];
                    const session = subjectSessions[index];
                    
                    return (
                      <td key={`${subject.id}-${sessionNum}`} 
                          className="p-1 text-center"
                          onClick={() => handleSessionClick(session, subject.id, index)}>
                        <div 
                          className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                            !session ? 'bg-muted text-muted-foreground hover:bg-muted/80' : 
                            session.status === "completed" ? 'bg-studypurple-400 text-white hover:bg-studypurple-500' : 
                            session.status === "skipped" ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' : 
                            'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {!session || session.status === "pending" ? (
                            <Circle size={16} />
                          ) : session.status === "completed" ? (
                            <Check size={16} />
                          ) : (
                            <X size={16} />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
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
