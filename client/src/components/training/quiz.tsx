import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
interface QuizType {
  id: number;
  title: string;
  timeLimit?: number;
  passingScore: number;
  questions?: QuizQuestion[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  quiz: QuizType;
  onComplete?: (score: number, passed: boolean) => void;
}

export default function Quiz({ quiz, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimit || 30) * 60); // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use questions directly from quiz object
  const questions = quiz.questions || [];

  // Track attempts locally for now
  const previousAttempts: any[] = [];

  const submitQuizMutation = useMutation({
    mutationFn: async (data: { score: number; answers: number[]; passed: boolean; timeSpent: number }) => {
      // Temporarily skip API call since we're working locally
      return data;
    },
    onSuccess: (_, { score, passed }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes", quiz.id, "attempts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      onComplete?.(score, passed);
      toast({
        title: passed ? "Quiz Passed!" : "Quiz Failed",
        description: passed 
          ? `Congratulations! You scored ${score}%` 
          : `You scored ${score}%. ${quiz.passingScore}% required to pass.`,
        variant: passed ? "default" : "destructive",
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
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults, isSubmitted]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSubmitQuiz(newAnswers);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
    }
  };

  const handleSubmitQuiz = (finalAnswers = answers) => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question: QuizQuestion, index: number) => {
      if (finalAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= (quiz.passingScore || 80);
    const timeSpent = Math.round(((quiz.timeLimit || 30) * 60 - timeLeft) / 60); // Convert back to minutes
    
    setShowResults(true);
    submitQuizMutation.mutate({ score, answers: finalAnswers, passed, timeSpent });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Quiz...</h3>
          <p className="text-gray-600">Please wait while we load the questions.</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = Math.round((answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length / questions.length) * 100);
    
    const passed = score >= (quiz.passingScore || 80);

    return (
      <Card>
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className={`text-2xl ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-gray-900">
            {score}%
          </div>
          <p className="text-gray-600">
            You answered {answers.filter((answer, index) => 
              answer === questions[index]?.correctAnswer
            ).length} out of {questions.length} questions correctly.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>Passing Score: {quiz.passingScore || 80}%</span>
            <span>•</span>
            <span>Time: {formatTime((quiz.timeLimit || 30) * 60 - timeLeft)}</span>
          </div>
          
          {!passed && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 text-sm">
                Don't worry! You can retake this quiz. Review the training material and try again.
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4 pt-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Training
            </Button>
            {!passed && (
              <Button onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{quiz.title}</CardTitle>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(timeLeft)}</span>
            </Badge>
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Quiz Progress</span>
            <span>{quiz.passingScore || 80}% required to pass</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 text-lg leading-relaxed">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Answer Options */}
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {(currentQuestion.options as string[]).map((option, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-0.5" />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-gray-700 leading-relaxed"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next'}
            {currentQuestionIndex < questions.length - 1 && (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>

        {/* Previous Attempts */}
        {previousAttempts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Previous Attempts</h4>
            <div className="space-y-1 text-sm text-blue-800">
              {previousAttempts.slice(0, 3).map((attempt: any, index: number) => (
                <div key={attempt.id} className="flex justify-between">
                  <span>Attempt {previousAttempts.length - index}</span>
                  <span className={attempt.passed ? 'text-green-600' : 'text-red-600'}>
                    {attempt.score}% {attempt.passed ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
