
import React from 'react';
import { Check, X, Circle } from 'lucide-react';
import { Subject, Session } from '@/types';

interface SubjectMiniSummaryProps {
  subject: Subject;
  sessions: Session[];
}

const SubjectMiniSummary = ({ subject, sessions }: SubjectMiniSummaryProps) => {
  const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
  
  const completed = subjectSessions.filter(session => session.status === 'completed').length;
  const skipped = subjectSessions.filter(session => session.status === 'skipped').length;
  const pending = subjectSessions.filter(session => session.status === 'pending').length;
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
      <span className="text-sm font-medium">{subject.name}</span>
      <div className="flex items-center gap-1 ml-auto">
        {completed > 0 && (
          <div className="flex items-center text-xs bg-studypurple-100 text-studypurple-700 px-1.5 py-0.5 rounded">
            <Check size={12} className="mr-0.5" />
            {completed}
          </div>
        )}
        {skipped > 0 && (
          <div className="flex items-center text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
            <X size={12} className="mr-0.5" />
            {skipped}
          </div>
        )}
        {pending > 0 && (
          <div className="flex items-center text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
            <Circle size={12} className="mr-0.5" />
            {pending}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectMiniSummary;
