
import React from "react";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-studypurple-400" />
          <p className="text-sm leading-loose text-center md:text-left font-medium gradient-text">
            StudyFlow
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} StudyFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
