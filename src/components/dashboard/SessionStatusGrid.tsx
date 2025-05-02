
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Calendar, Plus } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { Session, Subject } from '@/types';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { format, parseISO, isSameDay } from 'date-fns';

const SessionStatusGrid = () => {
  const { subjects, sessions, updateSessionStatus } = useStudy();
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  // Group sessions by date and subject
  const sessionsByDateAndSubject = React.useMemo(() => {
    const grouped: Record<string, Record<string, Session[]>> = {};
    
    // Get unique dates from sessions
    const uniqueDates = [...new Set(sessions.map(session => 
      format(parseISO(session.date), 'yyyy-MM-dd')
    ))].sort();
    
    // Initialize the structure
    uniqueDates.forEach(date => {
      grouped[date] = {};
      subjects.forEach(subject => {
        grouped[date][subject.id] = [];
      });
    });
    
    // Fill in the sessions
    sessions.forEach(session => {
      const dateStr = format(parseISO(session.date), 'yyyy-MM-dd');
      if (grouped[dateStr] && grouped[dateStr][session.subjectId]) {
        grouped[dateStr][session.subjectId].push(session);
      }
    });
    
    return grouped;
  }, [sessions, subjects]);

  // Get the dates to display (limited to the last 7 days with sessions)
  const displayDates = React.useMemo(() => {
    return Object.keys(sessionsByDateAndSubject)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 7)
      .reverse();
  }, [sessionsByDateAndSubject]);
  
  const handleMarkSession = async (sessionId: string, status: 'completed' | 'skipped') => {
    try {
      await updateSessionStatus(sessionId, status);
      toast.success(`Session marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update session status');
    }
  };

  const getSessionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-white" />;
      case 'skipped':
        return <X className="h-4 w-4 text-white" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground/70" />;
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-studypurple-500 hover:bg-studypurple-600';
      case 'skipped':
        return 'bg-destructive hover:bg-destructive/90';
      default:
        return 'bg-muted hover:bg-muted-foreground/20';
    }
  };

  if (subjects.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subject Sessions</CardTitle>
            <CardDescription>Mark your study sessions as completed or skipped</CardDescription>
          </div>
          <Link to="/sessions/new">
            <Button size="sm" className="gradient-bg">
              <Plus className="mr-2 h-4 w-4" /> New Session
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {displayDates.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No sessions found</p>
            <Link to="/sessions/new" className="mt-4 inline-block">
              <Button size="sm" className="gradient-bg">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="grid" style={{ 
                gridTemplateColumns: `minmax(120px, auto) repeat(${displayDates.length}, 1fr)` 
              }}>
                {/* Header row with dates */}
                <div className="contents">
                  <div className="px-4 py-2 font-medium"></div>
                  {displayDates.map(date => (
                    <div key={date} className="px-2 py-2 text-center text-xs font-medium">
                      {format(new Date(date), 'MMM d')}
                    </div>
                  ))}
                </div>
                
                {/* Subject rows */}
                {subjects.map(subject => (
                  <div key={subject.id} className="contents">
                    <div className="px-4 py-2 flex items-center border-t">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: subject.color }}
                      ></div>
                      <span className="text-sm font-medium truncate">{subject.name}</span>
                    </div>
                    
                    {/* Session cells for each date */}
                    {displayDates.map(date => {
                      const sessionsForDay = sessionsByDateAndSubject[date]?.[subject.id] || [];
                      
                      return (
                        <div key={`${subject.id}-${date}`} className="p-1 border-t text-center">
                          {sessionsForDay.length > 0 ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {sessionsForDay.map(session => (
                                <div 
                                  key={session.id}
                                  className="relative"
                                  onMouseEnter={() => setHoveredSession(session.id)}
                                  onMouseLeave={() => setHoveredSession(null)}
                                >
                                  <button
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getSessionStatusColor(session.status)}`}
                                    title={session.title}
                                  >
                                    {getSessionStatusIcon(session.status)}
                                  </button>
                                  
                                  {hoveredSession === session.id && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-background shadow-lg rounded-md border min-w-[160px] z-10">
                                      <div className="text-xs font-medium mb-1">{session.title}</div>
                                      <div className="text-xs text-muted-foreground mb-2">{session.duration} mins</div>
                                      <div className="flex justify-between gap-1">
                                        {session.status !== 'completed' && (
                                          <Button 
                                            size="sm" 
                                            className="h-7 text-xs px-2 bg-studypurple-500 hover:bg-studypurple-600"
                                            onClick={() => handleMarkSession(session.id, 'completed')}
                                          >
                                            <Check className="h-3 w-3 mr-1" /> Done
                                          </Button>
                                        )}
                                        {session.status !== 'skipped' && (
                                          <Button 
                                            size="sm" 
                                            variant="destructive"
                                            className="h-7 text-xs px-2"
                                            onClick={() => handleMarkSession(session.id, 'skipped')}
                                          >
                                            <X className="h-3 w-3 mr-1" /> Skip
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionStatusGrid;
