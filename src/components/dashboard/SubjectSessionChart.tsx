
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/contexts/StudyContext";
import { Badge } from "@/components/ui/badge";

const SubjectSessionChart = () => {
  const { subjects, sessions } = useStudy();
  
  // Group sessions by subject
  const sessionsBySubject = subjects.reduce((acc, subject) => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    acc[subject.id] = subjectSessions;
    return acc;
  }, {} as Record<string, typeof sessions>);
  
  // Find the maximum number of sessions for any subject
  const maxSessions = Object.values(sessionsBySubject).reduce((max, subjectSessions) => 
    Math.max(max, subjectSessions.length), 0);
  
  // Create array of session numbers (S1, S2, S3, etc.)
  const sessionNumbers = Array.from({ length: maxSessions }, (_, i) => `S${i+1}`);
  
  return (
    <Card className="col-span-1 md:col-span-3 overflow-x-auto">
      <CardHeader>
        <CardTitle>Subject-Session Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                {sessionNumbers.map(sessionNum => (
                  <th key={sessionNum} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {sessionNum}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map(subject => (
                <tr key={subject.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: subject.color }}></div>
                      <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                    </div>
                  </td>
                  {sessionNumbers.map((sessionNum, index) => {
                    const subjectSessions = sessionsBySubject[subject.id] || [];
                    const session = subjectSessions[index];
                    
                    return (
                      <td key={`${subject.id}-${sessionNum}`} className="px-6 py-4 whitespace-nowrap">
                        {session ? (
                          <Badge 
                            variant={
                              session.status === "completed" ? "default" : 
                              session.status === "skipped" ? "destructive" : 
                              "outline"
                            }
                            className={
                              session.status === "completed" ? "bg-studypurple-400 hover:bg-studypurple-500" : 
                              session.status === "skipped" ? "" : 
                              "text-gray-500"
                            }
                          >
                            {session.status === "completed" ? "Done" : 
                             session.status === "skipped" ? "Skipped" : 
                             "Pending"}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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
