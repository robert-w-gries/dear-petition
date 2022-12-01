import { useCallback, useEffect, useRef } from 'react';
import { useTimer } from './useTimeout';

type UseDebounceOptions = {
  timeout?: number;
};

/*
 * Wrap a function with setTimeout. Default timeout is 500 ms.
 */
const useDebounce = (callback: (...args: unknown[]) => void, options: UseDebounceOptions) => {
  // keep up to date reference to callback while keeping it memoized
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  const timer = useTimer();

  const { timeout } = options;
  return useCallback(
    (...args: unknown[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => callbackRef.current(...args), timeout ?? 500);
    },
    [timer, timeout]
  );
};

export default useDebounce;
