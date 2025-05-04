
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Timer, Play, Pause, SkipForward, Settings, Volume2, VolumeX } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';

const PomodoroTimer = () => {
  const { summary } = useStudy();
  
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Settings
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs for sounds
  const focusSoundRef = useRef<HTMLAudioElement | null>(null);
  const breakSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio elements when component mounts
  useEffect(() => {
    focusSoundRef.current = new Audio('https://soundbible.com/mp3/Gentle%20Rain%20Sound-SoundBible.com-1771266851.mp3');
    breakSoundRef.current = new Audio('https://soundbible.com/mp3/Babbling%20Brook-SoundBible.com-17660315.mp3');
    
    // Loop the sounds
    if (focusSoundRef.current) {
      focusSoundRef.current.loop = true;
      focusSoundRef.current.volume = 0.2;
    }
    
    if (breakSoundRef.current) {
      breakSoundRef.current.loop = true;
      breakSoundRef.current.volume = 0.2;
    }
    
    // Clean up when component unmounts
    return () => {
      if (focusSoundRef.current) focusSoundRef.current.pause();
      if (breakSoundRef.current) breakSoundRef.current.pause();
    };
  }, []);
  
  // Handle sound based on mode and isRunning
  useEffect(() => {
    const focusSound = focusSoundRef.current;
    const breakSound = breakSoundRef.current;
    
    if (!soundEnabled || !focusSound || !breakSound) return;
    
    if (isRunning) {
      if (mode === 'focus') {
        breakSound.pause();
        focusSound.play().catch(e => console.log("Audio play error:", e));
      } else {
        focusSound.pause();
        breakSound.play().catch(e => console.log("Audio play error:", e));
      }
    } else {
      focusSound.pause();
      breakSound.pause();
    }
  }, [isRunning, mode, soundEnabled]);
  
  // Timer logic
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
    // Always expand when starting timer
    if (!isRunning) setIsExpanded(true);
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
    // Calculate the current session minutes from seconds
    const currentSessionMinutes = Math.floor(totalSecondsElapsed / 60);
    
    // Add the current session minutes to the completed study time from the context
    const totalMinutes = currentSessionMinutes + summary.studyTimeCompleted;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    
    if (soundEnabled) {
      if (focusSoundRef.current) focusSoundRef.current.pause();
      if (breakSoundRef.current) breakSoundRef.current.pause();
    } else {
      if (isRunning && mode === 'focus' && focusSoundRef.current) {
        focusSoundRef.current.play().catch(e => console.log("Audio play error:", e));
      } else if (isRunning && mode === 'break' && breakSoundRef.current) {
        breakSoundRef.current.play().catch(e => console.log("Audio play error:", e));
      }
    }
  };
  
  return (
    <motion.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      animate={{ 
        scale: isHovering && !isExpanded ? 1.02 : 1,
        transition: { duration: 0.3 }
      }}
    >
      <Card
        className={`relative overflow-hidden ${
          isExpanded ? 'h-auto' : 'h-[120px] md:h-[150px]'
        } transition-all duration-500`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pomodoro Timer</CardTitle>
              <CardDescription>
                {mode === 'focus' ? 'Focus session' : 'Break time'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleSound}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowSettings(prev => !prev);
                  setIsExpanded(true);
                }}
              >
                <Settings size={16} />
              </Button>
              
              {isExpanded && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                >
                  {isExpanded ? '−' : '+'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <AnimatePresence>
            {/* Settings Panel */}
            {isExpanded && showSettings && (
              <motion.div 
                className="space-y-4 mb-4 p-3 bg-muted rounded-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Timer Display */}
          <div className="flex items-center justify-center">
            <motion.div 
              className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-full w-32 h-32 md:w-40 md:h-40 mx-auto relative ${
                mode === 'focus' ? 'bg-studypurple-100' : 'bg-green-100'
              }`}
              animate={{ 
                scale: isRunning ? [1, 1.05, 1] : 1,
                transition: { duration: 3, repeat: isRunning ? Infinity : 0, repeatType: 'reverse' }
              }}
            >
              {/* Wave Animation Background */}
              {isRunning && (
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-full ${
                      mode === 'focus' ? 'bg-studypurple-300/30' : 'bg-green-300/30'
                    }`}
                    initial={{ y: '100%' }}
                    animate={{ 
                      y: `${100 - progress}%`,
                      transition: { 
                        duration: 1,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {/* Wave effect */}
                    <svg 
                      className="absolute top-0 left-0 w-[200%]" 
                      style={{ transform: 'translateY(-98%)' }}
                      viewBox="0 0 1000 50"
                    >
                      <motion.path 
                        d="M0,50 C250,0 350,100 500,50 C650,0 750,100 1000,50 L1000,100 L0,100 Z"
                        fill={mode === 'focus' ? '#9b87f5' : '#4ade80'}
                        fillOpacity="0.6"
                        animate={{ 
                          x: [-500, 0],
                          transition: { 
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "linear"
                          }
                        }}
                      />
                    </svg>
                  </motion.div>
                </div>
              )}
              
              <span className="text-3xl md:text-4xl font-bold relative z-10">{formatTime(secondsLeft)}</span>
              <span className="text-sm mt-1 relative z-10">{mode === 'focus' ? 'Focus' : 'Break'}</span>
            </motion.div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Controls */}
                <div className="flex justify-center gap-2">
                  <Button 
                    onClick={toggleTimer}
                    variant="outline"
                    size="icon"
                    className={`rounded-full h-10 w-10 ${
                      isRunning ? 'bg-red-50 hover:bg-red-100' : 'bg-green-50 hover:bg-green-100'
                    }`}
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
                <div className="pt-2 border-t mt-4">
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
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PomodoroTimer;
