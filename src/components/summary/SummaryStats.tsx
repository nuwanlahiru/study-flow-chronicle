
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/contexts/StudyContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const SummaryStats = () => {
  const { summary, subjects } = useStudy();

  // Prepare data for overall session status chart
  const sessionStatusData = [
    {
      name: "Completed",
      value: summary.completedSessions,
      color: "#8B5CF6", // Purple
    },
    {
      name: "Pending",
      value: summary.pendingSessions,
      color: "#E5E7EB", // Gray
    },
    {
      name: "Skipped",
      value: summary.skippedSessions,
      color: "#F87171", // Red
    },
  ].filter(item => item.value > 0);

  // Prepare data for subject distribution chart
  const subjectSessionData = subjects.map(subject => ({
    name: subject.name,
    value: subject.totalSessions,
    color: subject.color,
  })).filter(item => item.value > 0);

  // Format study time
  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }
    
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <p className="text-2xl font-bold">{summary.totalSubjects}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold">{summary.totalSessions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Study Time</p>
              <p className="text-2xl font-bold">{formatStudyTime(summary.studyTimeCompleted)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-2xl font-bold">{summary.streak} {summary.streak === 1 ? "day" : "days"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Status</CardTitle>
        </CardHeader>
        <CardContent>
          {sessionStatusData.length > 0 ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sessionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-60">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Sessions by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectSessionData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectSessionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subjectSessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;
