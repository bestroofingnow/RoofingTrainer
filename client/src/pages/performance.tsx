import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import KpiDashboard from "@/components/performance/kpi-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Award, Phone, Target, Users } from "lucide-react";

const mockPerformanceData = [
  {
    date: "2024-01-15",
    dailyDials: 125,
    contactRate: 18.5,
    inspectionsSet: 7,
    inspectionToDealRate: 42.8
  },
  {
    date: "2024-01-14",
    dailyDials: 110,
    contactRate: 16.2,
    inspectionsSet: 5,
    inspectionToDealRate: 38.5
  },
  {
    date: "2024-01-13",
    dailyDials: 98,
    contactRate: 14.8,
    inspectionsSet: 4,
    inspectionToDealRate: 35.2
  }
];

const mockLeaderboard = [
  { rank: 1, name: "Sarah Johnson", score: 94, badge: "Roof Hawk" },
  { rank: 2, name: "Mike Chen", score: 89, badge: "Top Setter" },
  { rank: 3, name: "Alex Thompson", score: 87, badge: "Rising Star" },
  { rank: 4, name: "Current User", score: 84, badge: "Consistent" },
  { rank: 5, name: "David Wilson", score: 82, badge: "Improver" }
];

export default function Performance() {
  const [timeRange, setTimeRange] = useState("week");
  
  const { data: performanceMetrics = mockPerformanceData } = useQuery({
    queryKey: ["/api/user/performance"],
  });

  const { data: practiceRecordings = [] } = useQuery({
    queryKey: ["/api/user/practice-recordings"],
  });

  const latestMetrics = performanceMetrics[0];
  const previousMetrics = performanceMetrics[1];

  const getMetricTrend = (current: number, previous: number) => {
    if (!previous) return { trend: "neutral", change: 0 };
    const change = ((current - previous) / previous) * 100;
    return {
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      change: Math.abs(change)
    };
  };

  const getMetricColor = (metric: string, value: number) => {
    const thresholds = {
      dailyDials: { green: 120, yellow: 80 },
      contactRate: { green: 18, yellow: 12 },
      inspectionsSet: { green: 6, yellow: 3 },
      inspectionToDealRate: { green: 35, yellow: 25 }
    };
    
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (value >= threshold.green) return "text-green-600";
    if (value >= threshold.yellow) return "text-yellow-600";
    return "text-red-600";
  };

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
                  <p className="text-gray-600 mt-2">
                    Track your KPIs and training progress
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="metrics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="metrics">KPI Metrics</TabsTrigger>
                <TabsTrigger value="progress">Training Progress</TabsTrigger>
                <TabsTrigger value="practice">Practice Calls</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-6">
                {/* KPI Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {latestMetrics && [
                    {
                      title: "Daily Dials",
                      value: latestMetrics.dailyDials,
                      key: "dailyDials",
                      icon: Phone,
                      target: "≥ 120"
                    },
                    {
                      title: "Contact Rate",
                      value: `${latestMetrics.contactRate}%`,
                      key: "contactRate",
                      icon: Users,
                      target: "≥ 18%"
                    },
                    {
                      title: "Inspections Set",
                      value: latestMetrics.inspectionsSet,
                      key: "inspectionsSet",
                      icon: Target,
                      target: "≥ 6"
                    },
                    {
                      title: "Inspection-to-Deal",
                      value: `${latestMetrics.inspectionToDealRate}%`,
                      key: "inspectionToDealRate",
                      icon: Award,
                      target: "≥ 35%"
                    }
                  ].map((metric) => {
                    const trend = getMetricTrend(
                      typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value,
                      previousMetrics ? (typeof previousMetrics[metric.key as keyof typeof previousMetrics] === 'number' 
                        ? previousMetrics[metric.key as keyof typeof previousMetrics] as number
                        : parseFloat(previousMetrics[metric.key as keyof typeof previousMetrics] as string)) : 0
                    );
                    
                    return (
                      <Card key={metric.key}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-600">
                            {metric.title}
                          </CardTitle>
                          <metric.icon className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`text-2xl font-bold ${getMetricColor(metric.key, typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value)}`}>
                                {metric.value}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Target: {metric.target}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderTrendIcon(trend.trend)}
                              <span className={`text-xs ${trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>
                                {trend.change > 0 ? `${trend.change.toFixed(1)}%` : ''}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Detailed KPI Dashboard */}
                <KpiDashboard data={performanceMetrics} timeRange={timeRange} />
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                {/* Training Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quiz Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                      <p className="text-sm text-gray-600">Average score across all quizzes</p>
                      <div className="mt-4">
                        <Badge variant="outline" className="text-green-600">Above Target</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Practice Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">73%</div>
                      <p className="text-sm text-gray-600">Average practice call score</p>
                      <div className="mt-4">
                        <Badge variant="outline" className="text-blue-600">Target: 70%</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary mb-2">40%</div>
                      <p className="text-sm text-gray-600">Overall program completion</p>
                      <div className="mt-4">
                        <Badge variant="outline">Day 2 of 5</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Training Module Progress</CardTitle>
                    <CardDescription>
                      Your progress through each training day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { day: 1, title: "Welcome & Basics", completed: true, score: 92 },
                        { day: 2, title: "Insurance & Regulations", completed: false, score: null, current: true },
                        { day: 3, title: "Scripts & Psychology", completed: false, score: null },
                        { day: 4, title: "Objection Handling", completed: false, score: null },
                        { day: 5, title: "Ethics & Certification", completed: false, score: null }
                      ].map((day) => (
                        <div key={day.day} className="flex items-center justify-between p-4 rounded-lg border">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              day.completed ? 'bg-green-100 text-green-600' :
                              day.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {day.day}
                            </div>
                            <div>
                              <h4 className="font-medium">Day {day.day}: {day.title}</h4>
                              <p className="text-sm text-gray-500">
                                {day.completed ? 'Completed' : day.current ? 'In Progress' : 'Locked'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {day.score && (
                              <div className="text-lg font-semibold text-green-600">{day.score}%</div>
                            )}
                            <Badge variant={
                              day.completed ? 'default' :
                              day.current ? 'secondary' : 'outline'
                            }>
                              {day.completed ? 'Complete' : day.current ? 'Current' : 'Locked'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="practice" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Call History</CardTitle>
                    <CardDescription>
                      Review your recorded practice sessions and scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {practiceRecordings.length > 0 ? (
                      <div className="space-y-4">
                        {practiceRecordings.map((recording) => (
                          <div key={recording.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                              <h4 className="font-medium">{recording.scenario}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(recording.createdAt!).toLocaleDateString()} • 
                                {Math.floor((recording.duration || 0) / 60)}:{((recording.duration || 0) % 60).toString().padStart(2, '0')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              {recording.score && (
                                <div className={`text-lg font-semibold ${
                                  recording.score >= 70 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {recording.score}%
                                </div>
                              )}
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No practice calls recorded yet</p>
                        <p className="text-sm">Complete practice sessions to see your history here</p>
                        <Button className="mt-4">
                          Start Practice Call
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Leaderboard</CardTitle>
                    <CardDescription>
                      Top performers in the current training cohort
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockLeaderboard.map((user) => (
                        <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg ${
                          user.name === 'Current User' ? 'bg-blue-50 border border-blue-200' : 'border'
                        }`}>
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                              user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                              user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.rank}
                            </div>
                            <div>
                              <h4 className={`font-medium ${user.name === 'Current User' ? 'text-blue-900' : ''}`}>
                                {user.name}
                                {user.name === 'Current User' && <span className="text-blue-600"> (You)</span>}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {user.badge}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-lg font-semibold">{user.score}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>
                      Badges and milestones you've earned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg border">
                        <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-sm">First Quiz Passed</h4>
                        <p className="text-xs text-gray-500">Achieved Day 1</p>
                      </div>
                      <div className="text-center p-4 rounded-lg border">
                        <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-sm">Practice Pioneer</h4>
                        <p className="text-xs text-gray-500">5 Practice Calls</p>
                      </div>
                      <div className="text-center p-4 rounded-lg border bg-gray-50">
                        <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium text-sm text-gray-400">Perfect Score</h4>
                        <p className="text-xs text-gray-400">100% on quiz</p>
                      </div>
                      <div className="text-center p-4 rounded-lg border bg-gray-50">
                        <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium text-sm text-gray-400">Roof Hawk</h4>
                        <p className="text-xs text-gray-400">Complete program</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
