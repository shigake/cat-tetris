import React from 'react';
import { SOUNDS } from './audio/sounds';
import { SoundCard } from './components/SoundCard';
import { Music, Gamepad2, MousePointer2 } from 'lucide-react';

export default function App() {
  const musicSounds = SOUNDS.filter(s => s.category === 'Music');
  const gameplaySounds = SOUNDS.filter(s => s.category === 'Gameplay');
  const uiSounds = SOUNDS.filter(s => s.category === 'UI');

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-900 pb-20">
      <header className="bg-gradient-to-r from-orange-400 to-purple-500 text-white p-8 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Cat Tetris Audio Generator</h1>
          <p className="text-orange-100 max-w-lg">
            Listen to and download all the synthesized 8-bit meows and retro sound effects for your Cat Tetris game.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-orange-200 pb-2">
            <Music className="text-orange-500" />
            <h2 className="text-2xl font-semibold text-orange-900">Music (Loops)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicSounds.map(sound => <SoundCard key={sound.id} sound={sound} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-purple-200 pb-2">
            <Gamepad2 className="text-purple-500" />
            <h2 className="text-2xl font-semibold text-purple-900">Gameplay SFX</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameplaySounds.map(sound => <SoundCard key={sound.id} sound={sound} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
            <MousePointer2 className="text-blue-500" />
            <h2 className="text-2xl font-semibold text-blue-900">Menu & UI SFX</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uiSounds.map(sound => <SoundCard key={sound.id} sound={sound} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
