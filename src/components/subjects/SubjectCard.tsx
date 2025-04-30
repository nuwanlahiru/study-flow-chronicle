
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Subject } from "@/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

const SubjectCard = ({ subject, onEdit, onDelete }: SubjectCardProps) => {
  const completionRate = subject.totalSessions > 0 
    ? (subject.completedSessions / subject.totalSessions) * 100 
    : 0;
    
  return (
    <Card className="overflow-hidden">
      <div className="h-2" style={{ backgroundColor: subject.color }}></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-semibold text-lg">{subject.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
            <Progress value={completionRate} />
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-medium">{subject.totalSessions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="font-medium">{subject.completedSessions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Skipped</p>
              <p className="font-medium">{subject.skippedSessions}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <Link
          to={`/sessions/new?subjectId=${subject.id}`}
          className="w-full"
        >
          <Button variant="default" className="w-full">Add Session</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
