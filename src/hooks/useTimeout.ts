import { useEffect, useRef } from 'react';

/*
 * Create a timer reference that automatically cleans up on unmount
 */
export const useTimer = () => {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  return timer;
};
