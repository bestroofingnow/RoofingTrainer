import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Trophy, Target, BookOpen, Award } from "lucide-react";
import { Link } from "wouter";

interface ProgressTrackerProps {
  currentDay: number;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
}

export default function ProgressTracker({ 
  currentDay, 
  overallProgress, 
  completedModules, 
  totalModules 
}: ProgressTrackerProps) {
  const days = [
    {
      day: 1,
      title: "Welcome & Basics",
      description: "CEO welcome, roofing fundamentals",
      modules: 4,
      estimatedTime: "2.5 hours",
      status: currentDay > 1 ? 'completed' : currentDay === 1 ? 'current' : 'upcoming'
    },
    {
      day: 2,
      title: "Insurance & Regulations",
      description: "Insurance 101, NC regulations",
      modules: 5,
      estimatedTime: "3 hours",
      status: currentDay > 2 ? 'completed' : currentDay === 2 ? 'current' : 'upcoming'
    },
    {
      day: 3,
      title: "Scripts & Psychology",
      description: "Cold calling psychology, scripts",
      modules: 4,
      estimatedTime: "3.5 hours",
      status: currentDay > 3 ? 'completed' : currentDay === 3 ? 'current' : 'upcoming'
    },
    {
      day: 4,
      title: "Objection Handling",
      description: "Handle objections, CRM training",
      modules: 4,
      estimatedTime: "3 hours",
      status: currentDay > 4 ? 'completed' : currentDay === 4 ? 'current' : 'upcoming'
    },
    {
      day: 5,
      title: "Ethics & Certification",
      description: "Ethics, final exam",
      modules: 4,
      estimatedTime: "2.5 hours",
      status: currentDay > 5 ? 'completed' : currentDay === 5 ? 'current' : 'upcoming'
    }
  ];

  const completedDays = days.filter(day => day.status === 'completed').length;
  const totalEstimatedHours = days.reduce((total, day) => {
    return total + parseFloat(day.estimatedTime);
  }, 0);
  
  const completedHours = days
    .filter(day => day.status === 'completed')
    .reduce((total, day) => total + parseFloat(day.estimatedTime), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Training Progress</CardTitle>
          <Badge variant="outline" className="text-primary">
            Day {currentDay} of 5
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="training-gradient rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <p className="text-white/80 text-sm">Cold Calling Certification Program</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{overallProgress}%</div>
              <div className="text-white/80 text-sm">Complete</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={overallProgress} 
              className="h-3 bg-white/20"
            />
            <div className="flex justify-between text-sm text-white/80">
              <span>{completedModules} of {totalModules} modules</span>
              <span>{completedHours.toFixed(1)}h of {totalEstimatedHours}h</span>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{completedDays}</div>
            <div className="text-sm text-green-700">Days Complete</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{completedHours.toFixed(1)}</div>
            <div className="text-sm text-blue-700">Hours Logged</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{completedModules}</div>
            <div className="text-sm text-purple-700">Modules Done</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {overallProgress >= 100 ? '1' : '0'}
            </div>
            <div className="text-sm text-orange-700">Certificates</div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Training Days</h4>
          
          {days.map((day) => (
            <div 
              key={day.day}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                day.status === 'current' ? 'bg-blue-50 border-blue-200' :
                day.status === 'completed' ? 'bg-green-50 border-green-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  day.status === 'completed' ? 'bg-green-500 text-white' :
                  day.status === 'current' ? 'bg-blue-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {day.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    day.day
                  )}
                </div>
                
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">
                    Day {day.day}: {day.title}
                  </h5>
                  <p className="text-sm text-gray-600">{day.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{day.modules} modules</span>
                    <span>•</span>
                    <span>{day.estimatedTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant={
                  day.status === 'completed' ? 'default' :
                  day.status === 'current' ? 'secondary' : 'outline'
                }>
                  {day.status === 'completed' ? 'Complete' :
                   day.status === 'current' ? 'Current' : 'Upcoming'}
                </Badge>
                
                <Link href={`/training/${day.day}`}>
                  <Button
                    size="sm"
                    variant={day.status === 'current' ? 'default' : 'outline'}
                    disabled={day.status === 'upcoming'}
                  >
                    {day.status === 'completed' ? 'Review' :
                     day.status === 'current' ? 'Continue' : 'Locked'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        {overallProgress < 100 && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Next Steps</h4>
                <p className="text-sm text-gray-600">
                  {currentDay <= 5 ? 
                    `Continue with Day ${currentDay} training modules to maintain your progress.` :
                    'Complete the final certification exam to earn your certificate.'
                  }
                </p>
              </div>
              <Link href={`/training/${currentDay}`}>
                <Button size="sm">
                  Continue
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Certification Status */}
        {overallProgress >= 100 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900">Congratulations!</h4>
                <p className="text-sm text-green-700">
                  You've completed the Cold Calling Certification Program. Your certificate is ready for download.
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                Download Certificate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
