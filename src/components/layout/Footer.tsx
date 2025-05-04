
import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 h-1 w-16 bg-studypurple-400 rounded-full blur-sm opacity-70" />
      <div className="absolute top-0 right-1/3 h-1 w-24 bg-blue-400 rounded-full blur-sm opacity-70" />
      
      <div className="relative bg-white/70 backdrop-blur-md border-t border-white/20 shadow-inner">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-studypurple-500 to-blue-500 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm leading-loose text-center md:text-left font-medium text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">
              CupCake's StudyFlow
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <p className="text-sm text-gray-600 text-center md:text-left">
              &copy; {new Date().getFullYear()} CupCake's StudyFlow. By Lahiru NK @ 
              <a 
                href="https://ScrollLoop.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-studypurple-500 hover:text-studypurple-600 hover:underline inline-flex items-center"
              >
                ScrollLoop.com
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
