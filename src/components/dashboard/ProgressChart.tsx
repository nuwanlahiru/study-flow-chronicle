
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStudy } from "@/contexts/StudyContext";
import { Subject } from "@/types";

const ProgressChart = () => {
  const { subjects, sessions } = useStudy();

  // Prepare data for chart
  const data = subjects.map(subject => {
    const subjectSessions = sessions.filter(session => session.subjectId === subject.id);
    const completed = subjectSessions.filter(session => session.status === "completed").length;
    const skipped = subjectSessions.filter(session => session.status === "skipped").length;
    const pending = subjectSessions.filter(session => session.status === "pending").length;
    
    return {
      name: subject.name,
      Completed: completed,
      Skipped: skipped,
      Pending: pending,
      color: subject.color,
    };
  });

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Subject Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-1 md:p-6">
        <div className="h-80 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Completed" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="Pending" stackId="a" fill="#E5E7EB" />
                <Bar dataKey="Skipped" stackId="a" fill="#F87171" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
