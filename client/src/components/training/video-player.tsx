import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, Volume2 } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  duration: number;
  moduleId?: string;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

export default function VideoPlayer({ 
  title, 
  videoUrl, 
  duration, 
  moduleId,
  onComplete,
  onProgress 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration * 60); // Convert minutes to seconds
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const [volume, setVolume] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);
      
      // Mark as completed when 90% watched
      if (progress >= 90 && !isCompleted) {
        setIsCompleted(true);
        onComplete?.();
      }
    };

    const updateDuration = () => {
      setVideoDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => {
      setIsPlaying(false);
      setIsCompleted(true);
      onComplete?.();
    });

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [onComplete, onProgress, isCompleted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const handleSpeedChange = (speed: string) => {
    const video = videoRef.current;
    if (!video) return;

    setPlaybackSpeed(speed);
    video.playbackRate = parseFloat(speed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Complete" : "In Progress"}
            </Badge>
            {moduleId && (
              <Badge variant="outline">
                Module {moduleId}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Video Container */}
        <div className="relative bg-gray-900 aspect-video">
          {/* Placeholder for video - in real implementation, this would be an actual video element */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Play className="h-8 w-8 ml-1" />
              </div>
              <p className="text-sm opacity-75">Video content would load here</p>
              <p className="text-xs opacity-50 mt-1">{videoUrl}</p>
            </div>
          </div>
          
          {/* Video Progress Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div 
              ref={progressRef}
              className="w-full bg-black/50 rounded-full h-1 cursor-pointer mb-2"
              onClick={handleSeek}
            >
              <div 
                className="bg-primary h-1 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-white text-sm">
              <span>{formatTime(currentTime)} / {formatTime(videoDuration)}</span>
              <div className="flex items-center space-x-2 text-xs">
                <Volume2 className="h-3 w-3" />
                <span>Speed: {playbackSpeed}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => skipTime(-10)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => skipTime(-5)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm"
                onClick={togglePlay}
                className="w-12"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => skipTime(5)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => skipTime(10)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Speed:</span>
                <Select value={playbackSpeed} onValueChange={handleSpeedChange}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Video Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
