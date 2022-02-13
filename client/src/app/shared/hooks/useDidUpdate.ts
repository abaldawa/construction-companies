import { useRef, useEffect } from 'react'

type CleanUpFun = (() => void) | void;
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