import React, { useState } from "react";
import {Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card";
import { Badge } from "../Components/ui/Badge";
import { Progress } from "../Components/ui/Progress";
import { Button } from "../Components/ui/Button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../Components/ui/Collapsible";
import { Trophy, BookOpen, Clock, ChevronDown } from "../Components/ui/Icons";
import examData from "../Data/ExamData.json";
//import "../App.css";

export function ExamResults() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("B")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <span className="text-green">↑</span>;
    if (trend === "down") return <span className="text-red">↓</span>;
    return <span className="text-gray">→</span>;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Exam Results</h1>
        <p className="text-lg text-white">Your Performance Overview</p>
        <div className="mt-4 text-sm text-white">
          <p>
            {examData.student.name} • {examData.student.class} • {examData.examDate}
          </p>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white">Overall Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">{examData.overall.grade}</div>
            <p className="text-sm text-white">{examData.overall.percentage}%</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white flex items-center justify-center gap-2">
              <Trophy />
              Class Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">#{examData.overall.rank}</div>
            <p className="text-sm text-white">out of {examData.overall.totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white flex items-center justify-center gap-2">
              <BookOpen />
              Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">{examData.subjects.length}</div>
            <p className="text-sm text-white">completed</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white flex items-center justify-center gap-2">
              <Clock />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">{examData.attendance}%</div>
            <Progress value={examData.attendance} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Subject Performance</CardTitle>
          <CardDescription>Your scores across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {examData.subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bodyglass">
                <div className="flex items-center gap-4 flex-1">
                  <div className="min-w-0 flex-1 ">
                    <h3 className="font-medium text-white text-start">{subject.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={(subject.score / subject.maxScore) * 100} className="h-2 flex-1 max-w-32" />
                      <span className="text-sm text-white">
                        {subject.score}/{subject.maxScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(subject.trend)}
                    <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {({ isOpen, handleToggle }) => (
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors" 
                onClick={handleToggle}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Detailed Score Breakdown</CardTitle>
                    <CardDescription>View comprehensive performance metrics</CardDescription>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent isOpen={isOpen}>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Subject</th>
                        <th className="text-center py-3 px-4 font-medium">Score</th>
                        <th className="text-center py-3 px-4 font-medium">Grade</th>
                        <th className="text-center py-3 px-4 font-medium">Percentage</th>
                        <th className="text-center py-3 px-4 font-medium">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examData.subjects.map((subject, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="py-3 px-4 font-medium">{subject.name}</td>
                          <td className="text-center py-3 px-4">
                            {subject.score}/{subject.maxScore}
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            {Math.round((subject.score / subject.maxScore) * 100)}%
                          </td>
                          <td className="text-center py-3 px-4">{getTrendIcon(subject.trend)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        )}
      </Collapsible>

      {/* Encouragement Section */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="text-center py-8">
          <div className="text-3xl mb-4 mt-2">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">Excellent Performance!</h2>
          <p className="text-lg text-white mb-4">
            You've achieved an outstanding {examData.overall.grade} grade with {examData.overall.percentage}% overall
            score.
          </p>
          <p className="text-white font-medium">Keep up the great work and continue striving for excellence!</p>
          <div className="mt-6">
            <Button className="mr-4">Download Report</Button>
            {/* <Button variant="outline">Share Results</Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ExamResults;