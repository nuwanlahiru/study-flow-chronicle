
import React from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-studypurple-400" />
          <p className="text-sm leading-loose text-center md:text-left font-medium gradient-text">
            CupCake's StudyFlow
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Link to="/login" className="text-sm text-studypurple-400 hover:underline">
            Login
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} CupCake's StudyFlow. By Lahiru NK @ 
            <a 
              href="https://ScrollLoop.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline ml-1"
            >
              ScrollLoop.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
