
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, SkipForward } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import { Session, Subject } from "@/types";
import { format } from "date-fns";

const RecentSessions = () => {
  const { sessions, subjects, updateSessionStatus } = useStudy();

  // Get pending sessions sorted by date (most recent first)
  const pendingSessions = sessions
    .filter(session => session.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Get subject by id
  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find(subject => subject.id === subjectId);
  };

  // Format date
  const formatSessionDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };

  // Handle marking a session as completed
  const handleComplete = (sessionId: string) => {
    updateSessionStatus(sessionId, "completed");
  };

  // Handle marking a session as skipped
  const handleSkip = (sessionId: string) => {
    updateSessionStatus(sessionId, "skipped");
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSessions.length > 0 ? (
          <div className="space-y-4">
            {pendingSessions.map(session => {
              const subject = getSubject(session.subjectId);
              return (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{session.title}</h4>
                      {subject && (
                        <Badge 
                          style={{ backgroundColor: subject.color }}
                          className="text-white"
                        >
                          {subject.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatSessionDate(session.date)}</span>
                      <span>{formatDuration(session.duration)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleComplete(session.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Mark Done
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleSkip(session.id)}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">No upcoming sessions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSessions;
