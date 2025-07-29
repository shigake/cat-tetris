import { useEffect } from 'react';
import { gameEvents, GAME_EVENTS } from '../patterns/Observer';
import { soundService } from '../services/SoundService';

export function useSoundManager() {
  useEffect(() => {
    const eventHandlers = {
      [GAME_EVENTS.LINE_CLEARED]: () => soundService.playSound('line-clear'),
      [GAME_EVENTS.T_SPIN]: () => soundService.playSound('line-clear'),
      [GAME_EVENTS.GAME_OVER]: () => soundService.playSound('game-over'),
      [GAME_EVENTS.PIECE_HELD]: () => soundService.playSound('meow')
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      gameEvents.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        gameEvents.off(event, handler);
      });
    };
  }, [gameEvents, soundService]);
} 