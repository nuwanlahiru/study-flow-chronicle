
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Timer, Play, Pause, SkipForward } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';

const PomodoroTimer = () => {
  const { summary } = useStudy();
  
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  
  // Settings
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            if (mode === 'focus') {
              setMode('break');
              setTotalSecondsElapsed(prev => prev + 1);
              return breakMinutes * 60;
            } else {
              setMode('focus');
              return focusMinutes * 60;
            }
          }
          
          if (mode === 'focus') {
            setTotalSecondsElapsed(prev => prev + 1);
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, mode, breakMinutes, focusMinutes]);
  
  // Reset timer when settings change
  useEffect(() => {
    if (mode === 'focus') {
      setSecondsLeft(focusMinutes * 60);
    } else {
      setSecondsLeft(breakMinutes * 60);
    }
  }, [focusMinutes, breakMinutes, mode]);
  
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  const skipToNext = () => {
    if (mode === 'focus') {
      setMode('break');
      setSecondsLeft(breakMinutes * 60);
    } else {
      setMode('focus');
      setSecondsLeft(focusMinutes * 60);
    }
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setMode('focus');
    setSecondsLeft(focusMinutes * 60);
    setTotalSecondsElapsed(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage for visual indication
  const progress = (secondsLeft / (mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60)) * 100;
  
  // Format total time studied (from both the timer and overall study time)
  const formatTotalTime = () => {
    const totalMinutes = Math.floor(totalSecondsElapsed / 60) + summary.studyTimeCompleted;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>
              {mode === 'focus' ? 'Focus session' : 'Break time'}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowSettings(prev => !prev)}
          >
            {showSettings ? 'Hide' : 'Settings'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-4 mb-4 p-3 bg-muted rounded-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Focus: {focusMinutes} min</span>
              </div>
              <Slider
                value={[focusMinutes]}
                min={5}
                max={60}
                step={5}
                onValueChange={(values) => setFocusMinutes(values[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Break: {breakMinutes} min</span>
              </div>
              <Slider
                value={[breakMinutes]}
                min={1}
                max={30}
                step={1}
                onValueChange={(values) => setBreakMinutes(values[0])}
              />
            </div>
          </div>
        )}
        
        {/* Timer Display */}
        <div className={`flex flex-col items-center justify-center p-6 rounded-full w-52 h-52 mx-auto relative ${
          mode === 'focus' ? 'bg-studypurple-100' : 'bg-green-100'
        }`}>
          <div className={`absolute inset-0 rounded-full ${
            mode === 'focus' ? 'bg-studypurple-400' : 'bg-green-400'
          }`} style={{ 
            opacity: 0.2,
            clipPath: `polygon(0 0, 100% 0, 100% ${100 - progress}%, 0 ${100 - progress}%)` 
          }}></div>
          <span className="text-4xl font-bold">{formatTime(secondsLeft)}</span>
          <span className="text-sm mt-2">{mode === 'focus' ? 'Focus' : 'Break'}</span>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button 
            onClick={toggleTimer}
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button 
            onClick={skipToNext}
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <SkipForward size={18} />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="pt-2 border-t mt-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Session</div>
              <div className="font-medium">{mode === 'focus' ? 'Focus' : 'Break'}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Study Time</div>
              <div className="font-medium">{formatTotalTime()}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
