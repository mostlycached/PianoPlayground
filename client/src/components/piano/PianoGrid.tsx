import { useState, useEffect } from "react";
import PianoKey from "./PianoKey";
import { PIANO_NOTES, audioManager } from "@/lib/audioContext";

interface PianoGridProps {
  columns: number;
  rows: number;
  autoplay: boolean;
}

export default function PianoGrid({ columns, rows, autoplay }: PianoGridProps) {
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const totalKeys = columns * rows;
  
  // Auto-play functionality
  useEffect(() => {
    let autoplayInterval: NodeJS.Timeout | null = null;
    
    if (autoplay) {
      // Initialize audio on first autoplay
      audioManager.initialize();
      
      autoplayInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * totalKeys);
        setActiveKey(randomIndex);
      }, 500);
    }
    
    return () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    };
  }, [autoplay, totalKeys]);

  // Generate grid items
  const gridItems = Array.from({ length: totalKeys }).map((_, index) => {
    const noteIndex = index % PIANO_NOTES.length;
    const note = PIANO_NOTES[noteIndex].note;
    const colorIndex = index % 5;
    
    return (
      <PianoKey
        key={index}
        note={note}
        colorIndex={colorIndex}
        isPlaying={activeKey === index}
        onPlayEnd={() => setActiveKey(null)}
      />
    );
  });

  return (
    <div 
      className={`grid grid-cols-${columns} gap-4 mb-8`}
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '1rem'
      }}
    >
      {gridItems}
    </div>
  );
}
