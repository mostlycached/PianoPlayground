import { useState, useEffect } from "react";
import PianoGrid from "@/components/piano/PianoGrid";
import Controls from "@/components/piano/Controls";
import Instructions from "@/components/piano/Instructions";
import { audioManager } from "@/lib/audioContext";

export default function Home() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(4);
  const [autoplay, setAutoplay] = useState(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initializeAudio = () => {
      audioManager.initialize();
      // Remove event listeners after initialization
      document.removeEventListener("click", initializeAudio);
      document.removeEventListener("touchstart", initializeAudio);
    };

    document.addEventListener("click", initializeAudio, { once: true });
    document.addEventListener("touchstart", initializeAudio, { once: true, passive: true });

    return () => {
      document.removeEventListener("click", initializeAudio);
      document.removeEventListener("touchstart", initializeAudio);
    };
  }, []);

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
  };

  const handleAutoplayChange = (enabled: boolean) => {
    setAutoplay(enabled);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* App Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center text-primary-dark">
            Piano Soundboard
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto p-4">
        {/* Piano Grid */}
        <div className="mb-6">
          <PianoGrid columns={columns} rows={rows} autoplay={autoplay} />
        </div>

        {/* Controls */}
        <Controls
          columns={columns}
          rows={rows}
          autoplay={autoplay}
          onColumnsChange={handleColumnsChange}
          onAutoplayChange={handleAutoplayChange}
        />

        {/* Instructions */}
        <Instructions />
      </main>

      {/* App Footer */}
      <footer className="bg-white mt-auto border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>Piano Soundboard • Made with ♥</p>
        </div>
      </footer>
    </div>
  );
}
