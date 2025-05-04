
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStudy } from "@/contexts/StudyContext";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  progress?: number;
  helpText?: string;
}

const SummaryCard = ({ title, value, description, icon, progress, helpText }: SummaryCardProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all transform backdrop-blur-md bg-white/70 border border-white/50 shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-studypurple-500/10 to-blue-500/10">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            
            {/* Help tooltip shown on hover */}
            {helpText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="cursor-help text-muted-foreground"
                      whileHover={{ scale: 1.2 }}
                    >
                      <HelpCircle size={14} />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent 
                    sideOffset={5}
                    className="bg-white/90 backdrop-blur-md border border-studypurple-100 p-3 max-w-[250px] z-50 text-sm shadow-lg"
                  >
                    {helpText}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <motion.div 
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-studypurple-500"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-studypurple-500 to-blue-500">{value}</div>
          {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
          {progress !== undefined && (
            <div className="mt-3">
              <Progress value={progress} className="h-2 bg-studypurple-100/30" indicatorClassName="bg-gradient-to-r from-studypurple-500 to-blue-500" />
              <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}% completed</p>
            </div>
          )}
          
          {/* Fancy glass interaction effect */}
          <div className="absolute inset-0 pointer-events-none rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="absolute -inset-[100%] opacity-0 group-hover:opacity-10 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 group-hover:animate-[shine_1.5s_ease-in-out]"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;
