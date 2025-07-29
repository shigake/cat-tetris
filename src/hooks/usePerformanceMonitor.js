import { useState, useEffect, useRef, useCallback } from 'react';

export function usePerformanceMonitor(enabled = false) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    gameLoopTime: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsUpdateIntervalRef = useRef(null);
  const renderStartTimeRef = useRef(0);

  const updateFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      const avgFrameTime = delta / frameCountRef.current;
      
      setMetrics(prev => ({
        ...prev,
        fps,
        frameTime: parseFloat(avgFrameTime.toFixed(2))
      }));
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  }, []);

  const updateMemoryUsage = useCallback(() => {
    if (performance.memory) {
      const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memoryMB
      }));
    }
  }, []);

  const markRenderStart = useCallback(() => {
    if (enabled) {
      renderStartTimeRef.current = performance.now();
    }
  }, [enabled]);

  const markRenderEnd = useCallback(() => {
    if (enabled && renderStartTimeRef.current > 0) {
      const renderTime = performance.now() - renderStartTimeRef.current;
      setMetrics(prev => ({
        ...prev,
        renderTime: parseFloat(renderTime.toFixed(2))
      }));
    }
  }, [enabled]);

  const tick = useCallback(() => {
    if (enabled) {
      frameCountRef.current++;
      updateFPS();
    }
  }, [enabled, updateFPS]);

  const measureGameLoop = useCallback((fn) => {
    if (!enabled) return fn();
    
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      gameLoopTime: parseFloat((end - start).toFixed(2))
    }));
    
    return result;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const memoryInterval = setInterval(updateMemoryUsage, 5000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, [enabled, updateMemoryUsage]);

  const getPerformanceWarnings = useCallback(() => {
    const warnings = [];
    
    if (metrics.fps < 55) {
      warnings.push('Low FPS detected');
    }
    
    if (metrics.frameTime > 20) {
      warnings.push('High frame time');
    }
    
    if (metrics.renderTime > 10) {
      warnings.push('Slow rendering');
    }
    
    if (metrics.gameLoopTime > 5) {
      warnings.push('Heavy game loop');
    }
    
    if (metrics.memoryUsage > 100) {
      warnings.push('High memory usage');
    }
    
    return warnings;
  }, [metrics]);

  return {
    metrics,
    tick,
    markRenderStart,
    markRenderEnd,
    measureGameLoop,
    getPerformanceWarnings,
    isPerformanceGood: metrics.fps >= 55 && metrics.frameTime <= 20
  };
} 