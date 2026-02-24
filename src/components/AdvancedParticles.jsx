import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedParticles({
 enabled = true,
 type = 'mixed',
 intensity = 'medium',
 className = ''
}) {
 const [particles, setParticles] = useState([]);
 const [particleId, setParticleId] = useState(0);

 const particleColors = useMemo(() => ({
 hearts: ['#ff4444', '#ff6b9d', '#ff8ecf', '#ff69b4', '#ff7043', '#ffd54f', '#66bb6a', '#42a5f5', '#ab47bc'],
 stars: ['#ffd700', '#fff176', '#ffe082', '#ffcc80', '#81d4fa', '#4fc3f7', '#ff8a65', '#e0e0e0', '#b388ff'],
 cats: ['#ff8a65', '#ffab91', '#ffccbc', '#bcaaa4', '#a1887f', '#8d6e63', '#90a4ae', '#78909c', '#607d8b'],
 tetris: ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#795548', '#212121', '#9e9e9e'],
 magic: ['#e040fb', '#7c4dff', '#448aff', '#18ffff', '#69f0ae', '#eeff41', '#ffab40', '#ff6e40', '#ea80fc']
 }), []);

 const getRandomColor = useCallback(() => {
 if (type === 'mixed') {
 const types = Object.keys(particleColors);
 const randomType = types[Math.floor(Math.random() * types.length)];
 const colors = particleColors[randomType];
 return colors[Math.floor(Math.random() * colors.length)];
 } else {
 const colors = particleColors[type] || particleColors.cats;
 return colors[Math.floor(Math.random() * colors.length)];
 }
 }, [type, particleColors]);

 const getParticleCount = useCallback(() => {
 switch (intensity) {
 case 'low': return 5;
 case 'medium': return 8;
 case 'high': return 12;
 default: return 8;
 }
 }, [intensity]);

 const generateParticle = useCallback(() => {
 return {
 id: particleId,
 color: getRandomColor(),
 x: Math.random() * 100,
 y: Math.random() * 100,
 size: 6 + Math.random() * 8,
 duration: 6,
 delay: Math.random() * 2,
 direction: Math.random() > 0.5 ? 1 : -1
 };
 }, [particleId, getRandomColor]);

 useEffect(() => {
 if (!enabled) {
 setParticles([]);
 return;
 }

 const count = getParticleCount();
 const newParticles = [];

 for (let i = 0; i < count; i++) {
 newParticles.push({
 ...generateParticle(),
 id: i
 });
 }

 setParticles(newParticles);
 setParticleId(count);
 }, [enabled, type, intensity, getParticleCount, generateParticle]);

 const refreshParticle = useCallback((id) => {
 setParticles(prev =>
 prev.map(p =>
 p.id === id
 ? { ...generateParticle(), id }
 : p
 )
 );
 }, [generateParticle]);

 if (!enabled) return null;

 return (
 <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
 <AnimatePresence>
 {particles.map((particle) => (
 <motion.div
 key={particle.id}
 className="absolute"
 style={{
 left: `${particle.x}%`,
 top: `${particle.y}%`,
 width: `${particle.size}px`,
 height: `${particle.size}px`,
 borderRadius: '50%',
 backgroundColor: particle.color,
 zIndex: 1
 }}
 initial={{
 opacity: 0,
 scale: 0,
 rotate: 0,
 y: 0
 }}
 animate={{
 opacity: [0, 0.6, 0],
 y: [0, -50]
 }}
 transition={{
 duration: particle.duration,
 delay: particle.delay,
 ease: "linear",
 repeat: Infinity,
 repeatDelay: 3
 }}
 onAnimationComplete={() => {
 if (Math.random() > 0.7) {
 refreshParticle(particle.id);
 }
 }}
 />
 ))}
 </AnimatePresence>

 </div>
 );
}
export function LineClearParticles({ linesCleared, onComplete }) {
 const [particles, setParticles] = useState([]);

 useEffect(() => {
 if (linesCleared > 0) {
 const count = linesCleared * 15;
 const newParticles = [];

 const lineClearColors = linesCleared === 4
 ? ['#ffd700', '#ffeb3b', '#fff176']
 : linesCleared >= 3
 ? ['#e040fb', '#7c4dff', '#448aff']
 : linesCleared >= 2
 ? ['#42a5f5', '#66bb6a', '#ffd54f']
 : ['#90caf9', '#b39ddb', '#ce93d8'];

 for (let i = 0; i < count; i++) {
 newParticles.push({
 id: i,
 color: lineClearColors[Math.floor(Math.random() * lineClearColors.length)],
 x: 20 + Math.random() * 60,
 y: 30 + Math.random() * 40,
 size: 4 + Math.random() * 8,
 direction: Math.random() > 0.5 ? 1 : -1
 });
 }

 setParticles(newParticles);

 const timer = setTimeout(() => {
 setParticles([]);
 if (onComplete) onComplete();
 }, 2000);

 return () => clearTimeout(timer);
 }
 }, [linesCleared, onComplete]);

 return (
 <div className="absolute inset-0 pointer-events-none z-20">
 <AnimatePresence>
 {particles.map((particle) => (
 <motion.div
 key={particle.id}
 className="absolute"
 style={{
 left: `${particle.x}%`,
 top: `${particle.y}%`,
 width: `${particle.size}px`,
 height: `${particle.size}px`,
 borderRadius: '50%',
 backgroundColor: particle.color
 }}
 initial={{
 opacity: 0,
 scale: 0,
 rotate: 0
 }}
 animate={{
 opacity: [0, 1, 0.8, 0],
 scale: [0, 1.5, 1.2, 0],
 rotate: [0, particle.direction * 720],
 y: [0, -100, -150, -200],
 x: [0, particle.direction * 50]
 }}
 exit={{
 opacity: 0,
 scale: 0
 }}
 transition={{
 duration: 2,
 ease: "easeOut"
 }}
 />
 ))}
 </AnimatePresence>
 </div>
 );
}

export function LevelUpParticles({ show, onComplete }) {
 const [particles, setParticles] = useState([]);

 useEffect(() => {
 if (show) {
 const levelParticles = [];

 const levelColors = ['#ffd700', '#ff6d00', '#e040fb', '#00e5ff', '#76ff03', '#ffea00', '#ff3d00', '#d500f9'];

 for (let i = 0; i < 40; i++) {
 levelParticles.push({
 id: i,
 color: levelColors[Math.floor(Math.random() * levelColors.length)],
 x: 30 + Math.random() * 40,
 y: 40 + Math.random() * 20,
 size: 6 + Math.random() * 6,
 angle: (Math.PI * 2 * i) / 40,
 speed: 100 + Math.random() * 50
 });
 }

 setParticles(levelParticles);

 const timer = setTimeout(() => {
 setParticles([]);
 if (onComplete) onComplete();
 }, 3000);

 return () => clearTimeout(timer);
 }
 }, [show, onComplete]);

 return (
 <div className="absolute inset-0 pointer-events-none z-30">
 <AnimatePresence>
 {particles.map((particle) => (
 <motion.div
 key={particle.id}
 className="absolute"
 style={{
 left: `${particle.x}%`,
 top: `${particle.y}%`,
 width: `${particle.size}px`,
 height: `${particle.size}px`,
 borderRadius: '50%',
 backgroundColor: particle.color
 }}
 initial={{
 opacity: 0,
 scale: 0
 }}
 animate={{
 opacity: [0, 1, 0.8, 0],
 scale: [0, 1.5, 1, 0],
 x: [0, Math.cos(particle.angle) * particle.speed],
 y: [0, Math.sin(particle.angle) * particle.speed],
 rotate: [0, 720]
 }}
 exit={{
 opacity: 0,
 scale: 0
 }}
 transition={{
 duration: 3,
 ease: "easeOut"
 }}
 />
 ))}
 </AnimatePresence>
 </div>
 );
}
