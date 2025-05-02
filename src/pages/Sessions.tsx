
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useStudy } from "@/contexts/StudyContext";
import { Session } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Trash2 } from "lucide-react";

const Sessions = () => {
  const { subjects, sessions, addSession, updateSession, updateSessionStatus, deleteSession } = useStudy();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<"pending" | "completed" | "skipped" | "all">("all");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (editingSessionId) {
      const sessionToEdit = sessions.find((session) => session.id === editingSessionId);
      if (sessionToEdit) {
        setTitle(sessionToEdit.title);
        setDescription(sessionToEdit.description || "");
        setSubjectId(sessionToEdit.subjectId);
        setDuration(sessionToEdit.duration);
        setDate(new Date(sessionToEdit.date));
      }
    } else {
      // Reset form fields when not editing
      setTitle("");
      setDescription("");
      setSubjectId("");
      setDuration(30);
      setDate(new Date());
    }
  }, [editingSessionId, sessions]);

  const filteredSessions =
    filter === "all"
      ? sessions
      : sessions.filter((session) => session.status === filter);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    const newSession = {
      title,
      description,
      subjectId,
      duration,
      date: date?.toISOString() || new Date().toISOString(),
      status: "pending" as "pending" | "completed" | "skipped", // Fix the type with explicit cast
    };

    if (editingSessionId) {
      editSession(newSession);
    } else {
      addSession(newSession);
    }

    setTitle("");
    setDescription("");
    setSubjectId("");
    setDuration(30);
    setDate(new Date());
    setEditingSessionId(null);
  };

  const editSession = (session: Omit<Session, "id">) => {
    if (editingSessionId) {
      updateSession(editingSessionId, session);
      setEditingSessionId(null);
      toast.success("Session updated");
    }
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
  };

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Manage Sessions</CardTitle>
          <CardDescription>
            Add, edit, and manage your study sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Session Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  type="number"
                  id="duration"
                  placeholder="30"
                  value={duration.toString()}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <div>
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
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Session Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit">{editingSessionId ? "Update Session" : "Add Session"}</Button>
            {editingSessionId && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingSessionId(null)}
              >
                Cancel Edit
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Session List</CardTitle>
          <CardDescription>View and manage existing sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Filter Sessions</Label>
            <Select 
              value={filter} 
              onValueChange={(value: "pending" | "completed" | "skipped" | "all") => setFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => {
                  const subject = subjects.find((s) => s.id === session.subjectId);
                  return (
                    <TableRow key={session.id}>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>{subject?.name || "N/A"}</TableCell>
                      <TableCell>{format(new Date(session.date), "PPP")}</TableCell>
                      <TableCell>{session.duration} minutes</TableCell>
                      <TableCell>
                        <Select
                          value={session.status}
                          onValueChange={(status: "pending" | "completed" | "skipped") =>
                            updateSessionStatus(session.id, status)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="skipped">Skipped</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingSessionId(session.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sessions;
