import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import InteractiveLesson from "@/components/training/interactive-lesson";
import Quiz from "@/components/training/quiz";
import StormMapLab from "@/components/training/storm-map-lab";
import PracticeCallModal from "@/components/training/practice-call-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { CheckCircle, Play, Lock, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { interactiveContent } from "@/data/training-content";

const trainingDayContent = {
  1: {
    title: "Welcome & Roofing Basics",
    description: "Master the fundamentals of roofing and Best Roofing Now's mission",
    modules: [
      { id: "welcome", title: "CEO Welcome & Mission", type: "interactive", duration: 15 },
      { id: "basics", title: "Roofing Basics Lightning Round", type: "interactive", duration: 20 },
      { id: "attic", title: "Virtual Attic Walkthrough", type: "interactive", duration: 25 },
      { id: "quiz1", title: "Knowledge Check", type: "quiz", duration: 10 }
    ]
  },
  2: {
    title: "Insurance 101 & NC Claim Regulations",
    description: "Master the fundamentals of insurance claims and regulatory compliance",
    modules: [
      { id: "insurance", title: "Insurance Fundamentals", type: "interactive", duration: 20 },
      { id: "regulations", title: "NC Claim Regulations", type: "interactive", duration: 15 },
      { id: "storm-map", title: "Storm Map Lab", type: "interactive", duration: 30 },
      { id: "vocabulary", title: "Roof Damage Vocabulary", type: "interactive", duration: 15 },
      { id: "quiz2", title: "ACV vs RCV Role Play", type: "quiz", duration: 10 }
    ]
  },
  3: {
    title: "Scripts & Psychology",
    description: "Master cold calling psychology and script development",
    modules: [
      { id: "compliance", title: "TCPA & DNC Compliance", type: "interactive", duration: 20 },
      { id: "psychology", title: "Psychology of Cold Calling", type: "interactive", duration: 25 },
      { id: "hackathon", title: "Script Writing Hack-a-thon", type: "interactive", duration: 45 },
      { id: "quiz3", title: "Script Assessment", type: "quiz", duration: 15 }
    ]
  },
  4: {
    title: "Objection Handling",
    description: "Master objection handling and CRM management",
    modules: [
      { id: "objections", title: "Objection Handling Dojo", type: "interactive", duration: 40 },
      { id: "crm", title: "CRM Training", type: "interactive", duration: 20 },
      { id: "live-calls", title: "Live Call Analysis", type: "interactive", duration: 30 },
      { id: "simulation", title: "Live Call Simulation", type: "practice", duration: 20 }
    ]
  },
  5: {
    title: "Ethics & Certification",
    description: "Ethics training and final certification exam",
    modules: [
      { id: "ethics", title: "Ethics & Fraud Prevention", type: "interactive", duration: 25 },
      { id: "kpis", title: "KPI Math & Compensation", type: "interactive", duration: 15 },
      { id: "final-exam", title: "Certification Exam", type: "quiz", duration: 45 },
      { id: "graduation", title: "Graduation", type: "interactive", duration: 10 }
    ]
  }
};

export default function TrainingDay() {
  const params = useParams();
  const day = parseInt(params.day || "1");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);

  const dayContent = trainingDayContent[day as keyof typeof trainingDayContent];
  const currentModule = dayContent?.modules[currentModuleIndex];

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ["/api/training/modules", day, "quizzes"],
    enabled: !!day,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { moduleId: number; status: string; score?: number }) => {
      await apiRequest("PUT", "/api/user/progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      toast({
        title: "Progress Saved",
        description: "Your training progress has been updated.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!dayContent) {
    return <div>Training day not found</div>;
  }

  const dayProgress = Math.round((currentModuleIndex / dayContent.modules.length) * 100);

  const handleNextModule = () => {
    if (currentModuleIndex < dayContent.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  const handleSaveProgress = () => {
    updateProgressMutation.mutate({
      moduleId: day * 10 + currentModuleIndex, // Simple module ID generation
      status: "in_progress",
    });
  };

  const renderModuleContent = () => {
    if (!currentModule) return null;

    switch (currentModule.type) {
      case "quiz":
        const quiz = (quizzes as any[]).find((q: any) => q.title.includes(currentModule.title));
        return quiz ? (
          <Quiz
            quiz={quiz}
            onComplete={(score, passed) => {
              updateProgressMutation.mutate({
                moduleId: day * 10 + currentModuleIndex,
                status: "completed",
                score,
              });
              if (passed) {
                handleNextModule();
              }
            }}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">{currentModule.title}</h3>
            <p className="text-gray-600">Quiz content coming soon...</p>
          </div>
        );
      case "interactive":
        if (currentModule.id === "storm-map") {
          return <StormMapLab />;
        }
        
        // Use interactive lesson component with content from training-content.ts
        const moduleContent = interactiveContent[currentModule.id as keyof typeof interactiveContent];
        
        if (moduleContent) {
          return (
            <InteractiveLesson
              title={currentModule.title}
              moduleId={currentModule.id}
              content={moduleContent}
              onComplete={() => {
                updateProgressMutation.mutate({
                  moduleId: day * 10 + currentModuleIndex,
                  status: "completed",
                });
                handleNextModule();
              }}
            />
          );
        }
        
        return (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">{currentModule.title}</h3>
            <p className="text-gray-600">Interactive content for {currentModule.title}</p>
            <div className="mt-6">
              <Button onClick={() => handleNextModule()}>
                Complete Module
              </Button>
            </div>
          </div>
        );
      case "practice":
        return (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">{currentModule.title}</h3>
            <p className="text-gray-600 mb-6">Practice your cold calling skills with our simulation tool.</p>
            <Button onClick={() => setPracticeModalOpen(true)}>
              <Play className="h-4 w-4 mr-2" />
              Start Practice Call
            </Button>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">{currentModule.title}</h3>
            <p className="text-gray-600">Module content coming soon...</p>
          </div>
        );
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
              <h1 className="text-3xl font-bold text-gray-900">
                Day {day}: {dayContent.title}
              </h1>
              <p className="text-gray-600 mt-2">{dayContent.description}</p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {renderModuleContent()}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Day Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Day {day} Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dayContent.modules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {index < currentModuleIndex ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : index === currentModuleIndex ? (
                            <Play className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-300" />
                          )}
                          <span className={`text-sm ${
                            index <= currentModuleIndex ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {module.title}
                          </span>
                        </div>
                        <Badge variant={
                          index < currentModuleIndex ? 'default' :
                          index === currentModuleIndex ? 'secondary' : 'outline'
                        }>
                          {index < currentModuleIndex ? 'Complete' :
                           index === currentModuleIndex ? 'Current' : 'Locked'}
                        </Badge>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Day Progress</span>
                        <span>{dayProgress}%</span>
                      </div>
                      <Progress value={dayProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Reference */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Reference</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open('/scripts', '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Script Library
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setPracticeModalOpen(true)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Practice Call
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousModule}
                    disabled={currentModuleIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Module
                  </Button>
                  
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleSaveProgress}
                      disabled={updateProgressMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Progress
                    </Button>
                    <Button
                      onClick={handleNextModule}
                      disabled={currentModuleIndex >= dayContent.modules.length - 1}
                    >
                      Continue Training
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Practice Modal */}
      <PracticeCallModal
        open={practiceModalOpen}
        onOpenChange={setPracticeModalOpen}
        scenario="Post-Storm Follow-up"
        prospectInfo={{
          name: "Mrs. Sarah Douglas",
          address: "1247 Brookline Ave",
          roofAge: "Built 2008 (15 years)",
          previousContact: "None"
        }}
        stormData={{
          date: "March 18th, 2024",
          hailSize: "1.5 inches",
          windSpeed: "65 mph",
          neighborsHelped: "27 on Amber Court"
        }}
      />
    </div>
  );
}
