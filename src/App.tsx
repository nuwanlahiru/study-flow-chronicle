
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { StudyProvider } from "@/contexts/StudyContext";

import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Subjects from "@/pages/Subjects";
import Sessions from "@/pages/Sessions";
import NewSession from "@/pages/NewSession";
import Summary from "@/pages/Summary";
import NotFound from "@/pages/NotFound";
import React from "react";

// Create a client outside the component to avoid re-creation on each render
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <StudyProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="login" element={<Login />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="subjects" element={<Subjects />} />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="sessions/new" element={<NewSession />} />
                    <Route path="summary" element={<Summary />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </StudyProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
