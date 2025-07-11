import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

/**
 * Hook to monitor component render performance
 * @param componentName - Name of the component being monitored
 * @param enabled - Whether monitoring is enabled (default: false in production)
 */
export function usePerformanceMonitor(
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === 'development'
) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStartTime.current;
    
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`🐌 Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
      });
    }

    // Log performance metrics for analysis
    if (renderCount.current % 10 === 0) {
      console.log(`📊 ${componentName} performance:`, {
        averageRenderTime: `${renderTime.toFixed(2)}ms`,
        totalRenders: renderCount.current,
      });
    }
  });
}

/**
 * Hook to measure and log function execution time
 * @param functionName - Name of the function being measured
 * @param enabled - Whether monitoring is enabled
 */
export function useExecutionTimeMonitor(
  functionName: string,
  enabled: boolean = process.env.NODE_ENV === 'development'
) {
  return <T extends (...args: any[]) => any>(fn: T): T => {
    if (!enabled) return fn;

    return ((...args: any[]) => {
      const startTime = performance.now();
      const result = fn(...args);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      if (executionTime > 5) { // Log if execution takes more than 5ms
        console.log(`⏱️ ${functionName} execution time: ${executionTime.toFixed(2)}ms`);
      }

      return result;
    }) as T;
  };
}

export default usePerformanceMonitor;
