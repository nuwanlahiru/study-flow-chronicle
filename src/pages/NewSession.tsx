import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useStudy } from "@/contexts/StudyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "react-toastify";

const NewSession = () => {
  const { user } = useAuth();
  const { subjects, addSession, loading } = useStudy();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialSubjectId = searchParams.get("subjectId") || "";
  
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [subjectId, setSubjectId] = React.useState(initialSubjectId);
  const [duration, setDuration] = React.useState(30); // Default 30 minutes
  const [date, setDate] = React.useState<Date>(new Date());
  
  // Update subjectId when initialSubjectId changes
  useEffect(() => {
    if (initialSubjectId) {
      setSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If no subjects exist, redirect to subjects page
  useEffect(() => {
    if (!loading && subjects.length === 0) {
      navigate("/subjects");
    }
  }, [loading, subjects, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Form validation
    if (!title.trim()) {
      toast.error("Please enter a session title");
      return;
    }

    if (!subjectId) {
      toast.error("Please select a subject");
      return;
    }

    if (duration <= 0) {
      toast.error("Duration must be greater than 0");
      return;
    }

    // Create new session
    addSession({
      title,
      description,
      subjectId,
      duration,
      date,
      status: "pending" // Add status field here
    });

    // Navigate back to sessions page
    navigate("/sessions");
    toast.success("New session added!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Session</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Math Practice, Physics Review, etc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this study session"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={subjectId} 
                onValueChange={setSubjectId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject.color }}
                        />
                        <span>{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/sessions")}
              >
                Cancel
              </Button>
              <Button type="submit" className="gradient-bg">Create Session</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewSession;
