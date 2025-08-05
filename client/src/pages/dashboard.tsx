import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ProgressTracker from "@/components/training/progress-tracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Award, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: modules = [] } = useQuery({
    queryKey: ["/api/training/modules"],
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  const { data: performanceMetrics = [] } = useQuery({
    queryKey: ["/api/user/performance"],
  });

  // Calculate overall progress
  const completedModules = progress.filter(p => p.status === 'completed').length;
  const totalModules = modules.length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Get current day
  const currentDay = Math.min(Math.floor(completedModules / 2) + 1, 5);

  // Recent performance
  const latestMetrics = performanceMetrics[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Trainee'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Continue your cold calling training journey
              </p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <ProgressTracker 
                  currentDay={currentDay}
                  overallProgress={overallProgress}
                  completedModules={completedModules}
                  totalModules={totalModules}
                />
              </div>
              
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quiz Average</span>
                      <Badge variant="outline" className="text-green-600">
                        {latestMetrics ? '87%' : 'No data'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Practice Calls</span>
                      <Badge variant="outline" className="text-blue-600">
                        {latestMetrics ? '12' : '0'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hours Completed</span>
                      <Badge variant="outline" className="text-primary">
                        {Math.round(completedModules * 2.5)}h
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href={`/training/${currentDay}`}>
                      <Button className="w-full justify-start">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Training
                      </Button>
                    </Link>
                    <Link href="/scripts">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Script Library
                      </Button>
                    </Link>
                    <Link href="/performance">
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Performance
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Training Days Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Training Program Overview</CardTitle>
                <CardDescription>
                  5-day comprehensive cold calling certification program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    {
                      day: 1,
                      title: "Welcome & Basics",
                      description: "CEO welcome, roofing fundamentals",
                      status: currentDay > 1 ? 'completed' : currentDay === 1 ? 'current' : 'locked'
                    },
                    {
                      day: 2,
                      title: "Insurance & Regulations",
                      description: "Insurance 101, NC regulations",
                      status: currentDay > 2 ? 'completed' : currentDay === 2 ? 'current' : 'locked'
                    },
                    {
                      day: 3,
                      title: "Scripts & Psychology",
                      description: "Cold calling psychology, scripts",
                      status: currentDay > 3 ? 'completed' : currentDay === 3 ? 'current' : 'locked'
                    },
                    {
                      day: 4,
                      title: "Objection Handling",
                      description: "Handle objections, CRM training",
                      status: currentDay > 4 ? 'completed' : currentDay === 4 ? 'current' : 'locked'
                    },
                    {
                      day: 5,
                      title: "Ethics & Certification",
                      description: "Ethics, final exam",
                      status: currentDay > 5 ? 'completed' : currentDay === 5 ? 'current' : 'locked'
                    }
                  ].map((day) => (
                    <Card key={day.day} className={`transition-all ${
                      day.status === 'current' ? 'ring-2 ring-primary' : ''
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={
                            day.status === 'completed' ? 'default' :
                            day.status === 'current' ? 'secondary' : 'outline'
                          }>
                            Day {day.day}
                          </Badge>
                          {day.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {day.status === 'current' && (
                            <Clock className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <CardTitle className="text-sm">{day.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {day.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Link href={`/training/${day.day}`}>
                          <Button 
                            size="sm" 
                            className="w-full"
                            disabled={day.status === 'locked'}
                            variant={day.status === 'current' ? 'default' : 'outline'}
                          >
                            {day.status === 'completed' ? 'Review' :
                             day.status === 'current' ? 'Continue' : 'Locked'}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progress.slice(0, 5).map((item) => {
                    const module = modules.find(m => m.id === item.moduleId);
                    return (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <div>
                            <p className="font-medium text-sm">{module?.title || 'Module'}</p>
                            <p className="text-xs text-gray-500">
                              {item.status === 'completed' ? 'Completed' : 'In Progress'}
                              {item.score && ` • Score: ${item.score}%`}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 
                           new Date(item.updatedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                  
                  {progress.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No training activity yet</p>
                      <p className="text-sm">Start your first training module to see your progress here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
