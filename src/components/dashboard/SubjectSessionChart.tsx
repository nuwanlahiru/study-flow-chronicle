
import React from 'react';
import { Session } from '@/types';
import { useStudy } from '@/contexts/StudyContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

const SubjectSessionChart = () => {
  const { subjects, sessions, updateSessionStatus } = useStudy();

  // Group sessions by subject
  const sessionsBySubject = subjects.map(subject => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    return {
      subject,
      sessions: subjectSessions,
    };
  });

  const handleStatusChange = (sessionId: string, newStatus: "pending" | "completed" | "skipped") => {
    updateSessionStatus(sessionId, newStatus);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'skipped':
        return 'bg-gray-400';
      case 'pending':
      default:
        return 'bg-yellow-300';
    }
  };

  const handleCellClick = (session: Session) => {
    // Toggle status: pending -> completed -> skipped -> pending
    const statusCycle: Record<string, "pending" | "completed" | "skipped"> = {
      'pending': 'completed',
      'completed': 'skipped',
      'skipped': 'pending',
    };

    const currentStatus = session.status;
    const newStatus = statusCycle[currentStatus];
    
    handleStatusChange(session.id, newStatus);
  };

  if (subjects.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No subjects added yet.</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="font-medium mb-2">Subject-Session Chart (Click to mark status)</div>
      <div className="grid grid-cols-1 gap-4">
        {sessionsBySubject.map(({ subject, sessions }) => (
          <div key={subject.id} className="border rounded-md p-2">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: subject.color }}
              ></div>
              <h3 className="font-medium">{subject.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2 pl-5">
              {sessions.length > 0 ? sessions.map(session => (
                <TooltipProvider key={session.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div 
                        className={`w-8 h-8 rounded-md cursor-pointer ${getStatusColor(session.status)}`}
                        onClick={() => handleCellClick(session)}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-medium">{session.title}</p>
                        <p>{format(new Date(session.date), 'MMM dd')}</p>
                        <p>{session.duration} minutes</p>
                        <p>Status: {session.status}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )) : <p className="text-xs text-muted-foreground">No sessions</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSessionChart;
