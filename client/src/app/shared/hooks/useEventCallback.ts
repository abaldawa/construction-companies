import {useCallback, useRef} from "react";

export const useEventCallback = <T extends (...args: any[]) => void>(callback: T): T => {
  const funRef = useRef(callback);
  funRef.current = callback;

  return useCallback((...args: any[]) => {
    funRef.current(...args);
  }, []) as T;
};