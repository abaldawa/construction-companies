import { useRef, useEffect } from 'react'

const useDidUpdate = (callback: () => void, deps?: any[]) => {
  const hasMount = useRef(false);

  useEffect(() => {
    if (hasMount.current) {
      callback();
    } else {
      hasMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export {useDidUpdate};