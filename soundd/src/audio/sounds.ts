import { SoundGenerator } from './SoundGenerator';

export type SoundCategory = 'Music' | 'Gameplay' | 'UI';

export interface SoundDef {
  id: string;
  name: string;
  category: SoundCategory;
  duration: number;
  method: keyof SoundGenerator;
}

export const SOUNDS: SoundDef[] = [
  { id: 'menu-theme', name: 'Menu Theme', category: 'Music', duration: 8, method: 'generateMenuTheme' },
  { id: 'game-theme', name: 'Game Theme', category: 'Music', duration: 6.4, method: 'generateGameTheme' },
  { id: 'ambient-pad', name: 'Ambient Pad', category: 'Music', duration: 15, method: 'generateAmbientPad' },
  { id: 'piece-move', name: 'Piece Move', category: 'Gameplay', duration: 0.1, method: 'generatePieceMove' },
  { id: 'piece-rotate', name: 'Piece Rotate', category: 'Gameplay', duration: 0.15, method: 'generatePieceRotate' },
  { id: 'piece-land', name: 'Piece Land', category: 'Gameplay', duration: 0.15, method: 'generatePieceLand' },
  { id: 'hard-drop', name: 'Hard Drop', category: 'Gameplay', duration: 0.2, method: 'generateHardDrop' },
  { id: 'hold-piece', name: 'Hold Piece', category: 'Gameplay', duration: 0.15, method: 'generateHoldPiece' },
  { id: 'line-clear-1', name: 'Line Clear (1)', category: 'Gameplay', duration: 0.4, method: 'generateLineClear1' },
  { id: 'line-clear-2', name: 'Line Clear (2)', category: 'Gameplay', duration: 0.5, method: 'generateLineClear2' },
  { id: 'line-clear-3', name: 'Line Clear (3)', category: 'Gameplay', duration: 0.7, method: 'generateLineClear3' },
  { id: 'tetris-4', name: 'Tetris (4)', category: 'Gameplay', duration: 0.8, method: 'generateTetris4' },
  { id: 't-spin', name: 'T-Spin', category: 'Gameplay', duration: 0.5, method: 'generateTSpin' },
  { id: 'back-to-back', name: 'Back to Back', category: 'Gameplay', duration: 0.5, method: 'generateBackToBack' },
  { id: 'combo', name: 'Combo', category: 'Gameplay', duration: 0.3, method: 'generateCombo' },
  { id: 'level-up', name: 'Level Up', category: 'Gameplay', duration: 1.0, method: 'generateLevelUp' },
  { id: 'game-over', name: 'Game Over', category: 'Gameplay', duration: 1.6, method: 'generateGameOver' },
  { id: 'pause', name: 'Pause', category: 'Gameplay', duration: 0.3, method: 'generatePause' },
  { id: 'resume', name: 'Resume', category: 'Gameplay', duration: 0.3, method: 'generateResume' },
  { id: 'menu-hover', name: 'Menu Hover', category: 'UI', duration: 0.1, method: 'generateMenuHover' },
  { id: 'menu-select', name: 'Menu Select', category: 'UI', duration: 0.2, method: 'generateMenuSelect' },
  { id: 'menu-back', name: 'Menu Back', category: 'UI', duration: 0.2, method: 'generateMenuBack' },
  { id: 'menu-open', name: 'Menu Open', category: 'UI', duration: 0.3, method: 'generateMenuOpen' },
  { id: 'game-start', name: 'Game Start', category: 'UI', duration: 0.9, method: 'generateGameStart' },
  { id: 'pwa-install', name: 'PWA Install', category: 'UI', duration: 0.6, method: 'generatePWAInstall' },
];
