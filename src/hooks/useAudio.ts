
import { useRef, useEffect } from "react";

interface Sound {
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
}

export function useAudio(url: string): Sound {
  const audio = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      audio.current = new Audio(url);
      audio.current.preload = "auto";
      
      return () => {
        if (audio.current) {
          audio.current.pause();
          audio.current = null;
        }
      };
    }
  }, [url]);
  
  const play = () => {
    if (audio.current) {
      // Create a user gesture context for browsers that require it
      const context = new AudioContext();
      context.resume().then(() => {
        audio.current!.currentTime = 0;
        audio.current!.play().catch(err => {
          console.error("Error playing audio:", err);
        });
        isPlayingRef.current = true;
      });
    }
  };
  
  const stop = () => {
    if (audio.current) {
      audio.current.pause();
      audio.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  };
  
  return {
    play,
    stop,
    isPlaying: isPlayingRef.current
  };
}

export function useTimerSounds() {
  const timerStart = useAudio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
  const timerBreak = useAudio("https://assets.mixkit.co/active_storage/sfx/1635/1635-preview.mp3");
  const timerEnd = useAudio("https://assets.mixkit.co/active_storage/sfx/1339/1339-preview.mp3");
  
  return {
    timerStart,
    timerBreak,
    timerEnd
  };
}
