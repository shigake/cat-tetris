import { useCallback } from 'react';
import { playSound } from '../utils/audioManager';

export function useMenuSounds() {

 const playMenuHover = useCallback(() => {
  playSound('sfx_menu_hover.wav', { volume: 0.25 });
 }, []);

 const playMenuSelect = useCallback(() => {
  playSound('sfx_menu_select.wav', { volume: 0.4 });
 }, []);

 const playMenuBack = useCallback(() => {
  playSound('sfx_menu_back.wav', { volume: 0.35 });
 }, []);

 const playMenuOpen = useCallback(() => {
  playSound('sfx_menu_open.wav', { volume: 0.35 });
 }, []);

 const playGameStart = useCallback(() => {
  playSound('sfx_game_start.wav', { volume: 0.5 });
 }, []);

 const playPWAInstall = useCallback(() => {
  playSound('sfx_pwa_install.wav', { volume: 0.4 });
 }, []);

 return {
  playMenuHover,
  playMenuSelect,
  playMenuBack,
  playMenuOpen,
  playGameStart,
  playPWAInstall
 };
}
