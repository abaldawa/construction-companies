/**
 * @author Abhijit Baldawa
 */

import { useRef, useEffect } from 'react'

type CleanUpFun = (() => void) | void;

/**
 * This hook provided the exact same functionality as componentDidUpdate
 * lifecycle hook for the provided dependency.
 *
 * @param callback
 * @param deps
 */
const useDidUpdate = (callback: () => CleanUpFun, deps?: any[]) => {
  const hasMount = useRef(false);

  useEffect(() => {
    let cleanUpFun: CleanUpFun;

    if (hasMount.current) {
      cleanUpFun = callback();
    } else {
      hasMount.current = true;
    }

    return () => cleanUpFun?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export {useDidUpdate};