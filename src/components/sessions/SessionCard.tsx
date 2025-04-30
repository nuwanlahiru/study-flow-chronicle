
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Session, Subject } from "@/types";
import { Check, Clock, SkipForward, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SessionCardProps {
  session: Session;
  subject?: Subject;
  onStatusChange: (id: string, status: "pending" | "completed" | "skipped") => void;
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
}

const SessionCard = ({ session, subject, onStatusChange, onEdit, onDelete }: SessionCardProps) => {
  // Format duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };

  // Get status badge
  const getStatusBadge = () => {
    switch(session.status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "skipped":
        return <Badge variant="destructive">Skipped</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      {subject && <div className="h-1" style={{ backgroundColor: subject.color }}></div>}
      <CardHeader className="pb-2 flex justify-between items-start">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{session.title}</h3>
            {getStatusBadge()}
          </div>
          {session.description && (
            <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(session)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(session.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 opacity-70" />
          <span>{formatDuration(session.duration)}</span>
          <span className="text-muted-foreground">|</span>
          <CalendarIcon className="h-4 w-4 opacity-70" />
          <span>{format(new Date(session.date), "MMM d, yyyy")}</span>
        </div>
        
        {subject && (
          <Badge 
            variant="outline" 
            style={{ borderColor: subject.color, color: subject.color }}
          >
            {subject.name}
          </Badge>
        )}
      </CardContent>
      
      {session.status === "pending" && (
        <CardFooter className="flex justify-between gap-2 border-t bg-muted/50 px-6 py-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => onStatusChange(session.id, "completed")}
          >
            <Check className="h-4 w-4 mr-1" /> Mark Complete
          </Button>
          <Button 
            variant="ghost" 
            className="w-1/4" 
            onClick={() => onStatusChange(session.id, "skipped")}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SessionCard;
