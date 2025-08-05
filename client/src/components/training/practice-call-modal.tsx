import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square, Play, Pause, Download, Clock, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PracticeCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: string;
  prospectInfo: {
    name: string;
    address: string;
    roofAge: string;
    previousContact: string;
  };
  stormData: {
    date: string;
    hailSize: string;
    windSpeed: string;
    neighborsHelped: string;
  };
}

const frameworkSteps = [
  { id: "research", label: "Research: Check CRM history", completed: false },
  { id: "ring", label: "Ring: Use local presence dialer", completed: false },
  { id: "rapport", label: "Rapport: Introduce yourself and company", completed: false },
  { id: "reason", label: "Reason: Reference storm event", completed: false },
  { id: "reassure", label: "Reassure: Mention credentials and social proof", completed: false },
  { id: "request", label: "Request: Offer specific appointment times", completed: false }
];

export default function PracticeCallModal({ 
  open, 
  onOpenChange, 
  scenario, 
  prospectInfo, 
  stormData 
}: PracticeCallModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<string[]>([]);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const savePracticeRecordingMutation = useMutation({
    mutationFn: async (data: { scenario: string; duration: number; score?: number; feedback?: string }) => {
      await apiRequest("POST", "/api/practice/recordings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/practice-recordings"] });
      toast({
        title: "Practice Recorded",
        description: "Your practice call has been saved for review.",
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
        description: "Failed to save practice recording.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordingBlob(blob);
        setHasRecording(true);
        stream.getTracks().forEach(track => track.stop());
      };

      setIsRecording(true);
      setRecordingTime(0);
      mediaRecorder.start();

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleStepCheck = (stepId: string, checked: boolean) => {
    if (checked) {
      setCheckedSteps([...checkedSteps, stepId]);
    } else {
      setCheckedSteps(checkedSteps.filter(id => id !== stepId));
    }
  };

  const calculateScore = () => {
    const completionScore = (checkedSteps.length / frameworkSteps.length) * 100;
    // In a real implementation, this would include audio analysis
    return Math.round(completionScore);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const feedback = generateFeedback();
    
    savePracticeRecordingMutation.mutate({
      scenario,
      duration: recordingTime,
      score,
      feedback
    });
    
    onOpenChange(false);
    resetModal();
  };

  const generateFeedback = () => {
    const missedSteps = frameworkSteps.filter(step => !checkedSteps.includes(step.id));
    let feedback = `You completed ${checkedSteps.length} out of ${frameworkSteps.length} framework steps. `;
    
    if (missedSteps.length > 0) {
      feedback += `Consider focusing on: ${missedSteps.map(step => step.label.split(':')[0]).join(', ')}.`;
    } else {
      feedback += "Excellent job following the 6R framework!";
    }
    
    return feedback;
  };

  const resetModal = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setHasRecording(false);
    setCheckedSteps([]);
    setRecordingBlob(null);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Practice Call Simulation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scenario Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Scenario: {scenario}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                You're calling {prospectInfo.name} after a {stormData.date} hail storm hit her neighborhood. 
                Use the 6R framework to schedule an inspection.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Prospect Info</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Name:</strong> {prospectInfo.name}</div>
                    <div><strong>Address:</strong> {prospectInfo.address}</div>
                    <div><strong>Roof Age:</strong> {prospectInfo.roofAge}</div>
                    <div><strong>Previous Contact:</strong> {prospectInfo.previousContact}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Storm Data</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Date:</strong> {stormData.date}</div>
                    <div><strong>Hail Size:</strong> {stormData.hailSize}</div>
                    <div><strong>Wind Speed:</strong> {stormData.windSpeed}</div>
                    <div><strong>Neighbors Helped:</strong> {stormData.neighborsHelped}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recording Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Recording Interface</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <Button
                      size="lg"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : hasRecording 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {isRecording ? (
                        <Square className="h-8 w-8" />
                      ) : hasRecording ? (
                        <CheckCircle className="h-8 w-8" />
                      ) : (
                        <Mic className="h-8 w-8" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-mono text-gray-900 mb-2">
                      {formatTime(recordingTime)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isRecording ? 'Recording in progress...' : 
                       hasRecording ? 'Recording complete' : 
                       'Click to start recording'}
                    </div>
                  </div>
                </div>

                {hasRecording && recordingBlob && (
                  <div className="space-y-2">
                    <audio 
                      controls 
                      src={URL.createObjectURL(recordingBlob)}
                      className="w-full"
                    />
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const url = URL.createObjectURL(recordingBlob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `practice-call-${Date.now()}.wav`;
                          a.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 6R Framework Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>6R Framework Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {frameworkSteps.map((step) => (
                    <div key={step.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={step.id}
                        checked={checkedSteps.includes(step.id)}
                        onCheckedChange={(checked) => handleStepCheck(step.id, !!checked)}
                        className="mt-0.5"
                      />
                      <Label 
                        htmlFor={step.id} 
                        className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                      >
                        {step.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Completion</span>
                    <span className="text-sm text-gray-500">
                      {checkedSteps.length}/{frameworkSteps.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(checkedSteps.length / frameworkSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!hasRecording || savePracticeRecordingMutation.isPending}
            >
              {savePracticeRecordingMutation.isPending ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
