
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Calendar, Plus, Trash } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { Link } from 'react-router-dom';

const SubjectSessionChart = () => {
  const { subjects, sessions, deleteSubject } = useStudy();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Count sessions by subject
  const sessionsBySubject = subjects.map(subject => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    const completed = subjectSessions.filter(session => session.status === 'completed').length;
    const skipped = subjectSessions.filter(session => session.status === 'skipped').length;
    const pending = subjectSessions.filter(session => session.status === 'pending').length;
    
    return {
      id: subject.id,
      name: subject.name,
      color: subject.color,
      total: subjectSessions.length,
      completed,
      skipped,
      pending
    };
  });

  // Sort by number of sessions (descending)
  const sortedSubjects = [...sessionsBySubject].sort((a, b) => b.total - a.total);
  
  const confirmDelete = (id: string) => {
    deleteSubject(id);
    setShowDeleteConfirm(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Subject Statistics</CardTitle>
          <CardDescription>Session distribution by subject</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Link to="/subjects">
            <Button size="sm" className="gradient-bg">
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </Link>
          <Link to="/sessions/new">
            <Button size="sm" variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> Plan Session
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {sortedSubjects.length > 0 ? (
          <div className="space-y-4">
            {sortedSubjects.map((subject) => (
              <div key={subject.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
                    <span className="text-sm font-medium">{subject.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {subject.total} sessions
                    </span>
                    
                    {showDeleteConfirm === subject.id ? (
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-7 text-xs px-2"
                          onClick={() => confirmDelete(subject.id)}
                        >
                          Confirm
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs px-2"
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => setShowDeleteConfirm(subject.id)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                  {subject.completed > 0 && (
                    <div 
                      className="h-full bg-studypurple-500" 
                      style={{ width: `${(subject.completed / subject.total) * 100}%` }}
                    />
                  )}
                  {subject.skipped > 0 && (
                    <div 
                      className="h-full bg-destructive" 
                      style={{ width: `${(subject.skipped / subject.total) * 100}%` }}
                    />
                  )}
                  {subject.pending > 0 && (
                    <div 
                      className="h-full bg-muted-foreground/30" 
                      style={{ width: `${(subject.pending / subject.total) * 100}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <BarChart className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No data available yet</p>
            <Link to="/subjects" className="mt-4">
              <Button size="sm" className="gradient-bg">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Subject
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-studypurple-500 mr-1" />
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-destructive mr-1" />
              <span>Skipped</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mr-1" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SubjectSessionChart;
