
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Pencil, Trash2, Check, AlertTriangle } from "lucide-react";
import { Subject } from "@/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

const SubjectCard = ({ subject, onEdit, onDelete }: SubjectCardProps) => {
  const completionRate = subject.totalSessions > 0 
    ? (subject.completedSessions / subject.totalSessions) * 100 
    : 0;
    
  const isComplete = subject.totalSessions > 0 && subject.completedSessions === subject.totalSessions;
  const isSkipped = subject.totalSessions > 0 && subject.skippedSessions === subject.totalSessions;
  
  return (
    <Card className={`overflow-hidden h-full backdrop-blur-md bg-white/80 border border-white/50 shadow-lg transition-all ${
      isComplete ? 'bg-studypurple-50/70 border-studypurple-200/70' : 
      isSkipped ? 'bg-red-50/70 border-red-200/70' : 
      'bg-white/70'
    }`}>
      <div className={`h-2 ${isComplete ? 'bg-gradient-to-r from-studypurple-400 to-blue-400' : ''}`} style={{ 
        backgroundColor: !isComplete ? subject.color : undefined 
      }}></div>
      
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <h3 className={`font-semibold text-lg ${
            isComplete ? 'text-studypurple-700' : 
            isSkipped ? 'text-red-600' : 
            ''
          }`}>{subject.name}</h3>
          
          {isComplete && (
            <motion.div
              className="ml-2 flex items-center bg-studypurple-100 text-studypurple-700 px-1.5 py-0.5 rounded text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              <Check size={12} className="mr-1" /> Completed
            </motion.div>
          )}
          
          {isSkipped && (
            <motion.div
              className="ml-2 flex items-center bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              <AlertTriangle size={12} className="mr-1" /> Needs Focus
            </motion.div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="backdrop-blur-md bg-white/90 border border-white/50">
            <DropdownMenuItem onClick={() => onEdit(subject)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={() => onDelete(subject.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress 
              value={completionRate} 
              className={`h-2 ${
                isComplete ? 'bg-studypurple-100/50' : 
                isSkipped ? 'bg-red-100/50' : 
                'bg-muted/30'
              }`} 
              indicatorClassName={`${
                isComplete ? 'bg-gradient-to-r from-studypurple-500 to-blue-500 animate-pulse' : 
                isSkipped ? 'bg-gradient-to-r from-red-400 to-pink-400' : 
                ''
              }`} 
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-medium">{subject.totalSessions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className={`font-medium ${isComplete ? 'text-studypurple-700' : ''}`}>
                {subject.completedSessions}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Skipped</p>
              <p className={`font-medium ${isSkipped ? 'text-red-600' : ''}`}>
                {subject.skippedSessions}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className={`border-t px-6 py-3 ${
        isComplete ? 'bg-studypurple-50/70' : 
        isSkipped ? 'bg-red-50/70' : 
        'bg-muted/30'
      }`}>
        <Link
          to={`/sessions/new?subjectId=${subject.id}`}
          className="w-full"
        >
          <Button 
            variant={isComplete ? "outline" : "default"} 
            className={`w-full ${
              isComplete ? 'border-studypurple-200 text-studypurple-700 hover:bg-studypurple-100' : 
              isSkipped ? 'bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500' : 
              'bg-gradient-to-r from-studypurple-400 to-blue-400 hover:from-studypurple-500 hover:to-blue-500'
            }`}
          >
            Add Session
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
