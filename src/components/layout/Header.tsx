
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

  // Function to get initials from user metadata or email
  const getUserInitials = () => {
    if (!user) return "";
    
    // If we have metadata with a name
    if (user.user_metadata && user.user_metadata.full_name) {
      return user.user_metadata.full_name.split(" ")
        .map((n: string) => n[0])
        .join("");
    }
    
    // Fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return "U";
  };

  // Function to get display name
  const getDisplayName = () => {
    if (!user) return "";
    
    if (user.user_metadata && user.user_metadata.full_name) {
      return user.user_metadata.full_name;
    }
    
    return user.email || "User";
  };

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
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url} 
                      alt={getDisplayName()} 
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{getDisplayName()}</span>
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
