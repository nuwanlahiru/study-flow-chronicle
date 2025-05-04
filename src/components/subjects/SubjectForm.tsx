
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Subject } from "@/types";

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Omit<Subject, "id" | "userId" | "totalSessions" | "completedSessions" | "skippedSessions">) => void;
  editSubject?: Subject;
}

// Predefined color options
const colorOptions = [
  "#8B5CF6", // Purple
  "#F87171", // Red
  "#34D399", // Green
  "#60A5FA", // Blue
  "#FBBF24", // Yellow
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
];

const SubjectForm = ({ isOpen, onClose, onSave, editSubject }: SubjectFormProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorOptions[0]);
  
  useEffect(() => {
    if (editSubject) {
      setName(editSubject.name);
      setColor(editSubject.color);
    } else {
      // Reset form for new subject
      setName("");
      setColor(colorOptions[0]);
    }
  }, [editSubject, isOpen]);
  
  const handleSave = () => {
    if (name.trim() === "") {
      return;
    }
    
    onSave({
      name,
      color,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Mathematics, Physics, History, etc."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Color</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`w-8 h-8 rounded-full ${
                    color === option ? "ring-2 ring-offset-2 ring-studypurple-400" : ""
                  }`}
                  style={{ backgroundColor: option }}
                  onClick={() => setColor(option)}
                  aria-label={`Select color ${option}`}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectForm;
