
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  User, 
  ChevronDown,
  BookOpen,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
    <header className="sticky top-0 z-50 w-full">
      <div className="relative bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-studypurple-500 to-blue-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">CupCake's StudyFlow</h2>
            </div>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white/50 backdrop-blur-md border border-white/50 hover:bg-white/70 transition-all shadow-md" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-studypurple-500" />
            ) : (
              <Menu className="h-5 w-5 text-studypurple-500" />
            )}
          </button>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase">
                  Dashboard
                </Link>
                <Link to="/subjects" className="text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase">
                  Subjects
                </Link>
                <Link to="/sessions" className="text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase">
                  Sessions
                </Link>
                <Link to="/summary" className="text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase">
                  Summary
                </Link>
              </>
            )}
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full bg-white/50 backdrop-blur-md border border-white/50 hover:bg-white/70 transition-all shadow-md hover:shadow-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user.user_metadata?.avatar_url} 
                        alt={getDisplayName()} 
                      />
                      <AvatarFallback className="bg-gradient-to-r from-studypurple-400 to-blue-400 text-white text-lg">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/80 backdrop-blur-md border border-white/50 shadow-lg">
                  <div className="p-2 bg-gradient-to-r from-studypurple-500/10 to-blue-500/10 rounded-t-md">
                    <DropdownMenuLabel className="text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500 font-medium">My Account</DropdownMenuLabel>
                  </div>
                  <DropdownMenuSeparator className="bg-studypurple-100/50" />
                  <DropdownMenuItem className="flex items-center hover:bg-studypurple-50 transition-colors m-1 rounded-md">
                    <User className="mr-2 h-4 w-4 text-studypurple-400" />
                    <span>{getDisplayName()}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-studypurple-100/50" />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-500 flex items-center hover:bg-red-50 transition-colors m-1 rounded-md">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-gradient-to-r from-studypurple-500 to-blue-500 hover:from-studypurple-600 hover:to-blue-600 text-white transition-all shadow-md hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-1/4 h-1 w-16 bg-studypurple-400 rounded-full blur-sm opacity-70" />
        <div className="absolute -bottom-1 right-1/3 h-1 w-24 bg-blue-400 rounded-full blur-sm opacity-70" />
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[61px] z-50 bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg">
          <div className="p-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-studypurple-500/10 to-blue-500/10 rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url} 
                      alt={getDisplayName()} 
                    />
                    <AvatarFallback className="bg-gradient-to-r from-studypurple-400 to-blue-400 text-white text-lg">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">{getDisplayName()}</p>
                  </div>
                </div>
                
                <Link 
                  to="/dashboard" 
                  className="block p-3 text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase rounded-md hover:bg-studypurple-50"                  
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/subjects" 
                  className="block p-3 text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase rounded-md hover:bg-studypurple-50"                  
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Subjects
                </Link>
                <Link 
                  to="/sessions" 
                  className="block p-3 text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase rounded-md hover:bg-studypurple-50"                  
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sessions
                </Link>
                <Link 
                  to="/summary" 
                  className="block p-3 text-gray-700 hover:text-studypurple-500 font-medium transition-colors uppercase rounded-md hover:bg-studypurple-50"                  
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Summary
                </Link>
                
                <Button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full justify-start text-white bg-red-500 hover:bg-red-600 p-3"                  
                >
                  <LogOut className="mr-2 h-4 w-4 text-white" />
                  <span className="text-white">Log out</span>
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="lg" className="w-full bg-gradient-to-r from-studypurple-500 to-blue-500 hover:from-studypurple-600 hover:to-blue-600 text-white transition-all shadow-md hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
