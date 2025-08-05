import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  BookOpen, 
  Mic, 
  TrendingUp, 
  CheckCircle, 
  Play, 
  Lock 
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  
  const { data: progress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  // Calculate overall progress
  const completedModules = progress.filter(p => p.status === 'completed').length;
  const totalModules = 25; // Approximate total modules across all days
  const overallProgress = Math.round((completedModules / totalModules) * 100);
  const currentDay = Math.min(Math.floor(completedModules / 5) + 1, 5);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      current: location === "/"
    },
    {
      name: "Script Library",
      href: "/scripts",
      icon: BookOpen,
      current: location === "/scripts"
    },
    {
      name: "Practice Calls",
      href: "/practice",
      icon: Mic,
      current: location === "/practice"
    },
    {
      name: "Performance",
      href: "/performance",
      icon: TrendingUp,
      current: location === "/performance"
    }
  ];

  const trainingDays = [
    {
      day: 1,
      title: "Welcome & Basics",
      status: currentDay > 1 ? 'completed' : currentDay === 1 ? 'current' : 'locked'
    },
    {
      day: 2,
      title: "Insurance & Regulations",
      status: currentDay > 2 ? 'completed' : currentDay === 2 ? 'current' : 'locked'
    },
    {
      day: 3,
      title: "Scripts & Psychology",
      status: currentDay > 3 ? 'completed' : currentDay === 3 ? 'current' : 'locked'
    },
    {
      day: 4,
      title: "Objection Handling",
      status: currentDay > 4 ? 'completed' : currentDay === 4 ? 'current' : 'locked'
    },
    {
      day: 5,
      title: "Ethics & Certification",
      status: currentDay > 5 ? 'completed' : currentDay === 5 ? 'current' : 'locked'
    }
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {/* Progress Overview */}
            <div className="mb-6">
              <div className="training-gradient p-4 rounded-lg text-white">
                <h3 className="font-semibold mb-2">Your Progress</h3>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Day {currentDay} of 5</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2 bg-white/20">
                  <div 
                    className="h-full bg-white rounded-full transition-all" 
                    style={{ width: `${overallProgress}%` }}
                  />
                </Progress>
              </div>
            </div>

            {/* Main Navigation */}
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  item.current
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}>
                  <item.icon className={cn(
                    "mr-3 h-5 w-5",
                    item.current ? "text-primary" : "text-gray-400"
                  )} />
                  {item.name}
                </a>
              </Link>
            ))}

            {/* Training Days */}
            <div className="space-y-1 pt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                Training Days
              </h4>
              
              {trainingDays.map((day) => (
                <Link key={day.day} href={`/training/${day.day}`}>
                  <a className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    day.status === 'locked' && "cursor-not-allowed",
                    location === `/training/${day.day}`
                      ? "bg-blue-50 text-blue-700"
                      : day.status === 'completed'
                      ? "text-gray-700 hover:bg-gray-50"
                      : day.status === 'current'
                      ? "text-blue-700 hover:bg-blue-50"
                      : "text-gray-400"
                  )}>
                    <div className="mr-3">
                      {day.status === 'completed' ? (
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                      ) : day.status === 'current' ? (
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <Play className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">Day {day.day}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {day.title}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
