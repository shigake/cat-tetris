import React, { useState } from 'react';
import { Play, Download, Loader2 } from 'lucide-react';
import { SoundDef } from '../audio/sounds';
import { SoundGenerator } from '../audio/SoundGenerator';
import { audioBufferToWav } from '../audio/wavExport';

interface SoundCardProps {
  sound: SoundDef;
}

export const SoundCard: React.FC<SoundCardProps> = ({ sound }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const generator = new SoundGenerator(ctx);
      
      // Call the specific generation method
      (generator[sound.method] as Function)();
      
      // Stop playing state after duration
      setTimeout(() => {
        setIsPlaying(false);
        ctx.close();
      }, sound.duration * 1000 + 100);
    } catch (err) {
      console.error('Error playing sound:', err);
      setIsPlaying(false);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      const sampleRate = 44100;
      const OfflineAudioContextClass = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const ctx = new OfflineAudioContextClass(1, sampleRate * sound.duration, sampleRate);
      
      const generator = new SoundGenerator(ctx);
      (generator[sound.method] as Function)();
      
      const buffer = await ctx.startRendering();
      const blob = audioBufferToWav(buffer);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sound.id}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading sound:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{sound.name}</span>
        <span className="text-xs text-gray-400 font-mono">{sound.duration}s</span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 disabled:opacity-50 transition-colors"
          title="Play"
        >
          {isPlaying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50 transition-colors"
          title="Download WAV"
        >
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
