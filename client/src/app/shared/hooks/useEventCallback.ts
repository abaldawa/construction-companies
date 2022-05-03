/**
 * @author Abhijit Baldawa
 */

import {useCallback, useRef} from "react";

/**
 * This hook will always call the
 * latest callback provided but will always return the same callback
 * function reference to not break referential equality check in memo
 *
 * @param callback - user provided callback to call
 */
export const useEventCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const funRef = useRef(callback);
  funRef.current = callback;

  return useCallback((...args: any[]) => {
    return funRef.current(...args);
  }, []) as T;
};