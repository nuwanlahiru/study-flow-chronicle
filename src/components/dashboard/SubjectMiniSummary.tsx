
import React from 'react';
import { Check, X, Circle } from 'lucide-react';
import { Subject, Session } from '@/types';
import { motion } from 'framer-motion';

interface SubjectMiniSummaryProps {
  subject: Subject;
  sessions: Session[];
}

const SubjectMiniSummary = ({ subject, sessions }: SubjectMiniSummaryProps) => {
  const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
  
  const completed = subjectSessions.filter(session => session.status === 'completed').length;
  const skipped = subjectSessions.filter(session => session.status === 'skipped').length;
  const pending = subjectSessions.filter(session => session.status === 'pending').length;
  
  // Calculate completion status
  const isComplete = subjectSessions.length > 0 && completed === subjectSessions.length;
  const isSkipped = subjectSessions.length > 0 && skipped === subjectSessions.length;
  
  return (
    <motion.div 
      className={`flex items-center gap-2 p-2 rounded-md ${
        isComplete ? 'bg-studypurple-50/70' : 
        isSkipped ? 'bg-red-50/70' : 
        'bg-white/50'
      } backdrop-blur-sm border border-white/30`}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        backgroundColor: isComplete ? 'rgba(156, 133, 243, 0.15)' : 
                        isSkipped ? 'rgba(254, 202, 202, 0.15)' : 
                        'rgba(255, 255, 255, 0.7)'
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
      <span className={`text-sm font-medium ${
        isComplete ? 'text-studypurple-700' :
        isSkipped ? 'text-red-600' :
        'text-gray-800'
      }`}>
        {subject.name}
        {isComplete && 
          <span className="ml-2 text-xs bg-studypurple-100 text-studypurple-700 px-1.5 py-0.5 rounded">
            Complete
          </span>
        }
        {isSkipped && 
          <span className="ml-2 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
            Skipped
          </span>
        }
      </span>
      <div className="flex items-center gap-1 ml-auto">
        {completed > 0 && (
          <motion.div 
            className="flex items-center text-xs bg-studypurple-100 text-studypurple-700 px-1.5 py-0.5 rounded"
            whileHover={{ scale: 1.1 }}
          >
            <Check size={12} className="mr-0.5" />
            {completed}
          </motion.div>
        )}
        {skipped > 0 && (
          <motion.div 
            className="flex items-center text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded"
            whileHover={{ scale: 1.1 }}
          >
            <X size={12} className="mr-0.5" />
            {skipped}
          </motion.div>
        )}
        {pending > 0 && (
          <motion.div 
            className="flex items-center text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded"
            whileHover={{ scale: 1.1 }}
          >
            <Circle size={12} className="mr-0.5" />
            {pending}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SubjectMiniSummary;
