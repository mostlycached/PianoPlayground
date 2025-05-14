import { Howl } from 'howler';

export interface PianoNote {
  note: string;
  frequency: number;
}

// Piano notes with their frequencies (based on standard tuning)
export const PIANO_NOTES: PianoNote[] = [
  { note: 'C3', frequency: 130.81 },
  { note: 'D3', frequency: 146.83 },
  { note: 'E3', frequency: 164.81 },
  { note: 'F3', frequency: 174.61 },
  { note: 'G3', frequency: 196.00 },
  { note: 'A3', frequency: 220.00 },
  { note: 'B3', frequency: 246.94 },
  { note: 'C4', frequency: 261.63 }, // Middle C
  { note: 'D4', frequency: 293.66 },
  { note: 'E4', frequency: 329.63 },
  { note: 'F4', frequency: 349.23 },
  { note: 'G4', frequency: 392.00 },
  { note: 'A4', frequency: 440.00 }, // A440 (standard tuning reference)
  { note: 'B4', frequency: 493.88 },
  { note: 'C5', frequency: 523.25 },
  { note: 'D5', frequency: 587.33 },
  { note: 'E5', frequency: 659.25 },
  { note: 'F5', frequency: 698.46 },
  { note: 'G5', frequency: 783.99 },
  { note: 'A5', frequency: 880.00 },
  { note: 'B5', frequency: 987.77 }
];

// Define a class to manage the audio context and sound playback
class AudioManager {
  private audioSamples: Record<string, Howl> = {};
  private initialized: boolean = false;

  constructor() {
    this.preloadSounds();
  }

  // Preload synthetic piano sounds for each note
  private preloadSounds() {
    const audioFiles: Record<string, string> = {};
    
    // Creating URLs for audio files based on note names
    PIANO_NOTES.forEach(note => {
      audioFiles[note.note] = this.createToneUrl(note.frequency);
    });
    
    // Create Howl instances for each note
    Object.entries(audioFiles).forEach(([note, src]) => {
      this.audioSamples[note] = new Howl({
        src: [src],
        format: ['wav'],
        preload: true,
        html5: true
      });
    });

    this.initialized = true;
  }

  // Create tone URL using AudioContext to generate sounds programmatically
  private createToneUrl(frequency: number): string {
    // Create an audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 2; // seconds
    const numSamples = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate a simple sine wave
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Sine wave with exponential decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-3 * t);
    }
    
    // Convert the buffer to a WAV file
    const offlineContext = new OfflineAudioContext(1, numSamples, sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineContext.destination);
    source.start();
    
    return URL.createObjectURL(this.bufferToWave(buffer, numSamples));
  }

  // Convert an AudioBuffer to a Blob
  private bufferToWave(buffer: AudioBuffer, len: number): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const data = new Uint8Array(length);
    
    // Write a WAV header
    this.writeString(data, 0, 'RIFF');
    this.writeInt32(data, 4, length - 8);
    this.writeString(data, 8, 'WAVE');
    this.writeString(data, 12, 'fmt ');
    this.writeInt32(data, 16, 16);
    this.writeInt16(data, 20, 1); // PCM format
    this.writeInt16(data, 22, numOfChan);
    this.writeInt32(data, 24, buffer.sampleRate);
    this.writeInt32(data, 28, buffer.sampleRate * 2 * numOfChan); // byte rate
    this.writeInt16(data, 32, numOfChan * 2); // block align
    this.writeInt16(data, 34, 16); // bits per sample
    this.writeString(data, 36, 'data');
    this.writeInt32(data, 40, length - 44);
    
    // Write the PCM samples
    let offset = 44;
    for (let i = 0; i < buffer.getChannelData(0).length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        let sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        
        this.writeInt16(data, offset, sample);
        offset += 2;
      }
    }
    
    return new Blob([data], { type: 'audio/wav' });
  }
  
  private writeString(data: Uint8Array, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      data[offset + i] = str.charCodeAt(i);
    }
  }
  
  private writeInt16(data: Uint8Array, offset: number, value: number) {
    data[offset] = value & 0xFF;
    data[offset + 1] = (value >> 8) & 0xFF;
  }
  
  private writeInt32(data: Uint8Array, offset: number, value: number) {
    data[offset] = value & 0xFF;
    data[offset + 1] = (value >> 8) & 0xFF;
    data[offset + 2] = (value >> 16) & 0xFF;
    data[offset + 3] = (value >> 24) & 0xFF;
  }

  // Play a note
  public playNote(note: string) {
    if (!this.initialized) {
      this.preloadSounds();
    }
    
    const sound = this.audioSamples[note];
    if (sound) {
      sound.play();
    } else {
      console.error(`Sound not found for note: ${note}`);
    }
  }

  // Check if audio is initialized
  public isInitialized(): boolean {
    return this.initialized;
  }

  // Force initialization (can be called on user interaction)
  public initialize() {
    if (!this.initialized) {
      this.preloadSounds();
    }
  }
}

// Export a singleton instance
export const audioManager = new AudioManager();
