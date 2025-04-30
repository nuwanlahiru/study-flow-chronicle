
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  User, 
  ChevronDown,
  BookOpen
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-studypurple-400" />
          <span className="text-xl font-bold gradient-text">CupCake's StudyFlow</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {user && (
            <>
              <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-studypurple-400">
                Dashboard
              </Link>
              <Link to="/subjects" className="text-sm font-medium transition-colors hover:text-studypurple-400">
                Subjects
              </Link>
              <Link to="/sessions" className="text-sm font-medium transition-colors hover:text-studypurple-400">
                Sessions
              </Link>
              <Link to="/summary" className="text-sm font-medium transition-colors hover:text-studypurple-400">
                Summary
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.name}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="default" className="gradient-bg">Log in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
