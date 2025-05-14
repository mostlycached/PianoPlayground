import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { audioManager } from "@/lib/audioContext";

interface PianoKeyProps {
  note: string;
  colorIndex: number;
  isPlaying?: boolean;
  onPlayEnd?: () => void;
}

const colorClasses = [
  "bg-[#3B82F6] active:bg-[#2563EB]", // color-1
  "bg-[#60A5FA] active:bg-[#3B82F6]", // color-2
  "bg-[#93C5FD] active:bg-[#60A5FA]", // color-3
  "bg-[#BFDBFE] active:bg-[#93C5FD]", // color-4
  "bg-[#DBEAFE] active:bg-[#BFDBFE]", // color-5
];

const activeColorClasses = [
  "bg-[#2563EB]", // color-1 active
  "bg-[#3B82F6]", // color-2 active
  "bg-[#60A5FA]", // color-3 active
  "bg-[#93C5FD]", // color-4 active
  "bg-[#BFDBFE]", // color-5 active
];

export default function PianoKey({ note, colorIndex, isPlaying = false, onPlayEnd }: PianoKeyProps) {
  const [isActive, setIsActive] = useState(false);
  const colorClass = colorClasses[colorIndex % colorClasses.length];
  const activeColorClass = activeColorClasses[colorIndex % activeColorClasses.length];

  // Handle click or tap on key
  const handlePlay = useCallback(() => {
    setIsActive(true);
    audioManager.playNote(note);
    
    // Reset active state after animation completes
    setTimeout(() => {
      setIsActive(false);
      if (onPlayEnd) onPlayEnd();
    }, 300);
  }, [note, onPlayEnd]);

  // Handle controlled playing state (for autoplay)
  useEffect(() => {
    if (isPlaying) {
      handlePlay();
    }
  }, [isPlaying, handlePlay]);

  return (
    <motion.div
      className={`piano-key aspect-square rounded-lg shadow-md flex items-center justify-center cursor-pointer ${isActive ? activeColorClass : colorClass} touch-manipulation select-none`}
      whileTap={{ scale: 0.95 }}
      animate={isActive ? { scale: [1, 0.95, 1] } : {}}
      transition={{ duration: 0.3 }}
      data-note={note}
      role="button"
      aria-label={`Play ${note} note`}
      tabIndex={0}
      onClick={handlePlay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePlay();
        }
      }}
    />
  );
}
