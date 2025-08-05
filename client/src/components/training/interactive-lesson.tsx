import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ArrowRight, ArrowLeft, BookOpen, Lightbulb, Target } from "lucide-react";

interface InteractiveLessonProps {
  title: string;
  moduleId: string;
  content: {
    sections: Array<{
      id: string;
      title: string;
      type: 'content' | 'activity' | 'knowledge_check';
      content: string;
      activity?: {
        type: 'flashcards' | 'drag_drop' | 'scenario' | 'roleplay';
        data: any;
      };
      knowledgeCheck?: {
        question: string;
        options: string[];
        correct: number;
        explanation: string;
      };
    }>;
  };
  onComplete?: () => void;
}

export default function InteractiveLesson({ 
  title, 
  moduleId, 
  content, 
  onComplete 
}: InteractiveLessonProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  // Ensure content and sections exist
  if (!content || !content.sections || content.sections.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>No content available for this module.</p>
        </CardContent>
      </Card>
    );
  }

  const section = content.sections[currentSection];
  
  // Ensure section exists
  if (!section) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Error loading section content.</p>
        </CardContent>
      </Card>
    );
  }
  
  const progress = ((completedSections.size + 1) / content.sections.length) * 100;

  const handleSectionComplete = () => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(currentSection);
    setCompletedSections(newCompleted);

    if (newCompleted.size === content.sections.length) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleNext = () => {
    if (currentSection < content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderActivity = (activity: any) => {
    switch (activity.type) {
      case 'flashcards':
        return <FlashcardActivity data={activity.data} onComplete={handleSectionComplete} />;
      case 'scenario':
        return <ScenarioActivity data={activity.data} onComplete={handleSectionComplete} />;
      case 'roleplay':
        return <RoleplayActivity data={activity.data} onComplete={handleSectionComplete} />;
      default:
        return (
          <div className="text-center p-8">
            <p className="text-gray-600 mb-4">Interactive activity: {activity.type}</p>
            <Button onClick={handleSectionComplete}>Complete Activity</Button>
          </div>
        );
    }
  };

  const renderKnowledgeCheck = (check: any) => {
    return <KnowledgeCheck data={check} onComplete={handleSectionComplete} />;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Complete" : "In Progress"}
            </Badge>
            <Badge variant="outline">
              Module {moduleId}
            </Badge>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Section {currentSection + 1} of {content.sections.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            {section.type === 'content' && <BookOpen className="h-5 w-5 mr-2 text-blue-500" />}
            {section.type === 'activity' && <Target className="h-5 w-5 mr-2 text-green-500" />}
            {section.type === 'knowledge_check' && <Lightbulb className="h-5 w-5 mr-2 text-orange-500" />}
            {section.title}
          </h3>
          
          {section.type === 'content' && (
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
              <div className="mt-6 text-center">
                <Button onClick={handleSectionComplete}>
                  Mark as Read
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
          
          {section.type === 'activity' && section.activity && renderActivity(section.activity)}
          
          {section.type === 'knowledge_check' && section.knowledgeCheck && 
            renderKnowledgeCheck(section.knowledgeCheck)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {content.sections.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  completedSections.has(index) 
                    ? 'bg-green-500' 
                    : index === currentSection 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentSection >= content.sections.length - 1 || !completedSections.has(currentSection)}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FlashcardActivity({ data, onComplete }: { data: any; onComplete: () => void }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

  const cards = data.cards || [];
  const card = cards[currentCard];

  const handleCardComplete = () => {
    const newCompleted = new Set(completedCards);
    newCompleted.add(currentCard);
    setCompletedCards(newCompleted);

    if (newCompleted.size === cards.length) {
      onComplete();
    } else if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  if (!card) return null;

  return (
    <div className="text-center p-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl mb-6">
        <div className="mb-4">
          <Badge variant="outline">Card {currentCard + 1} of {cards.length}</Badge>
        </div>
        
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-lg font-medium">
            {showAnswer ? card.answer : card.question}
          </div>
        </div>
      </div>
      
      <div className="space-x-4">
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)}>
            Show Answer
          </Button>
        ) : (
          <div className="space-x-4">
            <Button variant="outline" onClick={() => setShowAnswer(false)}>
              Show Question
            </Button>
            <Button onClick={handleCardComplete}>
              Got It! Next Card
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScenarioActivity({ data, onComplete }: { data: any; onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const scenario = data.scenario || {};
  const steps = scenario.steps || [];
  const step = steps[currentStep];

  const handleChoiceSelect = (choice: string) => {
    const newChoices = [...selectedChoices];
    newChoices[currentStep] = choice;
    setSelectedChoices(newChoices);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  if (!step) return null;

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl mb-6">
        <h4 className="font-semibold mb-2">Scenario: {scenario.title}</h4>
        <p className="text-gray-700 mb-4">{scenario.context}</p>
        
        <div className="bg-white p-4 rounded-lg">
          <p className="font-medium mb-4">{step.situation}</p>
          <div className="space-y-3">
            {step.choices?.map((choice: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleChoiceSelect(choice)}
              >
                {choice}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleplayActivity({ data, onComplete }: { data: any; onComplete: () => void }) {
  const [currentPhase, setCurrentPhase] = useState(0);

  const roleplay = data.roleplay || {};
  const phases = roleplay.phases || [];
  const phase = phases[currentPhase];

  const handlePhaseComplete = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      onComplete();
    }
  };

  if (!phase) return null;

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl mb-6">
        <h4 className="font-semibold mb-2">Role Play: {roleplay.title}</h4>
        <Badge variant="secondary" className="mb-4">
          Phase {currentPhase + 1}: {phase.title}
        </Badge>
        
        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="text-gray-700">{phase.description}</p>
        </div>
        
        <div className="text-center">
          <Button onClick={handlePhaseComplete}>
            Complete Phase
          </Button>
        </div>
      </div>
    </div>
  );
}

function KnowledgeCheck({ data, onComplete }: { data: any; onComplete: () => void }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-xl">
        <h4 className="font-semibold mb-4">Knowledge Check</h4>
        
        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="font-medium mb-4">{data.question}</p>
          
          <div className="space-y-3">
            {data.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant={
                  showResult 
                    ? index === data.correct 
                      ? "default" 
                      : index === selectedAnswer 
                      ? "destructive" 
                      : "outline"
                    : "outline"
                }
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
              >
                {option}
              </Button>
            ))}
          </div>
          
          {showResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Explanation:</strong> {data.explanation}
              </p>
              <div className="mt-4 text-center">
                <Button onClick={handleContinue}>
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}