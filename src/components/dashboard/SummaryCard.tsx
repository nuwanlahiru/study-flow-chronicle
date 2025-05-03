
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStudy } from "@/contexts/StudyContext";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  progress?: number;
}

const SummaryCard = ({ title, value, description, icon, progress }: SummaryCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] duration-300">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-studypurple-500/10 to-blue-500/10">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-studypurple-500">
          {icon}
        </div>
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
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
