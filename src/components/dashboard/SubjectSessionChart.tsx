
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/contexts/StudyContext";
import { Check, Circle, Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

const SubjectSessionChart = () => {
  const { subjects, sessions, updateSessionStatus, addSession, deleteSession, refreshSubjects, refreshSessions } = useStudy();
  
  // Group sessions by subject
  const sessionsBySubject = subjects.reduce((acc, subject) => {
    // Get sessions for this subject
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    
    // Sort sessions by session number in the title (S1, S2, etc.)
    const sortedSessions = [...subjectSessions].sort((a, b) => {
      const numA = parseInt(a.title.replace(/\D/g, '') || '0');
      const numB = parseInt(b.title.replace(/\D/g, '') || '0');
      return numA - numB; // Ascending order - ensure oldest sessions are first
    });
    
    acc[subject.id] = sortedSessions;
    return acc;
  }, {} as Record<string, typeof sessions>);
  
  // Find the maximum number of sessions for any subject to determine column width
  const maxSessions = Object.values(sessionsBySubject).reduce((max, subjectSessions) => 
    Math.max(max, subjectSessions.length), 0);
  
  // Add columns for the "add session" and "remove last session" buttons
  const totalColumns = maxSessions + 2;
  
  // Ensure changes are reflected in the UI
  useEffect(() => {
    const refreshData = async () => {
      await refreshSubjects();
      await refreshSessions();
    };
    
    refreshData();
    // We only want this to run once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle session click
  const handleSessionClick = async (session: typeof sessions[0]) => {
    if (session.status === "pending") {
      await updateSessionStatus(session.id, "completed");
    } else if (session.status === "completed") {
      await updateSessionStatus(session.id, "skipped");
    } else {
      await updateSessionStatus(session.id, "pending");
    }
    
    // Refresh data after status change
    await refreshSubjects();
  };
  
  // Handle adding a new session
  const handleAddSession = async (subjectId: string) => {
    const subjectSessions = sessionsBySubject[subjectId] || [];
    
    // Extract session numbers from titles (S1, S2, etc.)
    const sessionNumbers = subjectSessions.map(s => {
      const match = s.title.match(/S(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    // Find the next session number (one more than the highest existing number)
    const nextSessionNumber = sessionNumbers.length > 0 ? Math.max(...sessionNumbers) + 1 : 1;
    
    const newSession = {
      title: `S${nextSessionNumber}`,
      description: "",
      duration: 30, // Default duration (30 minutes)
      date: new Date().toISOString(),
      subjectId,
      status: "pending" as "pending" | "completed" | "skipped" // Explicitly type this
    };
    
    await addSession(newSession);
    
    // Refresh data after adding
    await refreshSubjects();
  };
  
  // Handle removing the last session of a subject
  const handleRemoveLastSession = async (subjectId: string) => {
    const subjectSessions = sessionsBySubject[subjectId] || [];
    
    if (subjectSessions.length === 0) return;
    
    // Sort sessions by their number to find the last one
    const sortedSessions = [...subjectSessions].sort((a, b) => {
      const numA = parseInt(a.title.replace(/\D/g, '') || '0');
      const numB = parseInt(b.title.replace(/\D/g, '') || '0');
      return numB - numA; // Descending order - highest number first
    });
    
    // Delete the session with the highest session number
    if (sortedSessions.length > 0) {
      await deleteSession(sortedSessions[0].id);
      
      // Refresh data after removing
      await refreshSubjects();
    }
  };

  // Calculate status for each subject (completed, in-progress, not-started)
  const getSubjectStatus = (subjectId: string) => {
    const subjectSessions = sessionsBySubject[subjectId] || [];
    
    if (subjectSessions.length === 0) return "not-started";
    
    const completed = subjectSessions.every(s => s.status === "completed");
    const skipped = subjectSessions.every(s => s.status === "skipped");
    const mixed = subjectSessions.some(s => s.status === "completed") && subjectSessions.some(s => s.status === "skipped");
    
    if (completed) return "completed";
    if (skipped) return "skipped";
    if (mixed) return "mixed";
    
    return "in-progress";
  };
  
  return (
    <Card className="col-span-1 md:col-span-3 overflow-x-auto backdrop-blur-md bg-white/70 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle>Subject-Session Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-full">
          <table className="min-w-full">
            <thead>
              <tr className="bg-transparent">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" 
                    style={{ minWidth: "150px" }}>
                  Subject
                </th>
                {Array.from({ length: totalColumns - 1 }).map((_, index) => {
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
                const subjectStatus = getSubjectStatus(subject.id);
                
                return (
                  <motion.tr 
                    key={subject.id} 
                    className={`border-t border-white/30 ${
                      subjectStatus === 'completed' ? 'bg-studypurple-50' :
                      subjectStatus === 'skipped' ? 'bg-red-50' :
                      'bg-transparent'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.01, 
                      backgroundColor: subjectStatus === 'completed' ? 'rgba(156, 133, 243, 0.2)' : 
                                      subjectStatus === 'skipped' ? 'rgba(254, 202, 202, 0.3)' : 
                                      'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <motion.div 
                          className={`w-3 h-3 rounded-full mr-2 ${
                            subjectStatus === 'completed' ? 'animate-pulse' : ''
                          }`} 
                          style={{ backgroundColor: subject.color }}
                          whileHover={{ scale: 1.5 }}
                        ></motion.div>
                        <div className={`text-sm font-medium ${
                          subjectStatus === 'completed' ? 'text-studypurple-700' :
                          subjectStatus === 'skipped' ? 'text-red-600' :
                          'text-foreground'
                        }`}>
                          {subject.name}
                          {subjectStatus === 'completed' && 
                            <span className="ml-2 text-xs bg-studypurple-100 text-studypurple-700 px-1.5 py-0.5 rounded">
                              Completed!
                            </span>
                          }
                          {subjectStatus === 'skipped' && 
                            <span className="ml-2 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                              Skipped
                            </span>
                          }
                        </div>
                      </div>
                    </td>
                    
                    {/* Render existing sessions */}
                    {Array.from({ length: maxSessions }).map((_, index) => {
                      const session = subjectSessions[index];
                      const subjectComplete = subjectStatus === 'completed';
                      const subjectSkipped = subjectStatus === 'skipped';
                      
                      return (
                        <td key={`${subject.id}-session-${index}`} 
                            className="p-1 text-center">
                          {session ? (
                            <motion.div 
                              onClick={() => handleSessionClick(session)}
                              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                                subjectComplete && session.status === "completed" ? 'bg-gradient-to-r from-studypurple-400 to-blue-400 text-white shadow-md' :
                                subjectSkipped && session.status === "skipped" ? 'bg-gradient-to-r from-red-300 to-pink-300 text-white shadow-md' :
                                session.status === "completed" ? 'bg-studypurple-400 text-white hover:bg-studypurple-500' : 
                                session.status === "skipped" ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' : 
                                'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                              whileHover={{ 
                                scale: 1.2, 
                                boxShadow: subjectComplete ? '0 0 15px rgba(155,135,245,0.6)' : 
                                            subjectSkipped ? '0 0 15px rgba(255,100,100,0.4)' :
                                            '0 0 8px rgba(0,0,0,0.2)' 
                              }}
                              whileTap={{ scale: 0.9 }}
                              animate={
                                subjectComplete && session.status === "completed" ? 
                                { y: [0, -2, 0], transition: { repeat: Infinity, duration: 2 } } : undefined
                              }
                            >
                              {session.status === "pending" ? (
                                <Circle size={16} />
                              ) : session.status === "completed" ? (
                                <Check size={16} />
                              ) : (
                                <X size={16} />
                              )}
                            </motion.div>
                          ) : (
                            <div className="w-8 h-8"></div>
                          )}
                        </td>
                      );
                    })}
                    
                    {/* Add session button - fixed at the end */}
                    <td className="p-1 text-center">
                      <motion.div 
                        onClick={() => handleAddSession(subject.id)}
                        className="w-8 h-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors bg-white/80 border border-studypurple-200 text-studypurple-600 hover:bg-white backdrop-blur-sm"
                        title="Add session"
                        whileHover={{ scale: 1.2, backgroundColor: "#9b87f5", color: "white", boxShadow: '0 0 10px rgba(155, 135, 245, 0.5)' }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ x: 0 }}
                      >
                        <Plus size={16} />
                      </motion.div>
                    </td>
                    
                    {/* Remove last session button - fixed at the end */}
                    <td className="p-1 text-center">
                      <motion.div 
                        onClick={() => handleRemoveLastSession(subject.id)}
                        className="w-8 h-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors bg-white/80 border border-red-200 text-destructive hover:bg-white backdrop-blur-sm"
                        title="Remove last session"
                        whileHover={{ scale: 1.2, backgroundColor: "#fee2e2", color: "#b91c1c", boxShadow: '0 0 10px rgba(254, 226, 226, 0.5)' }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ x: 0 }}
                      >
                        <Minus size={16} />
                      </motion.div>
                    </td>
                  </motion.tr>
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
