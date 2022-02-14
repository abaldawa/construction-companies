/**
 * @author Abhijit Baldawa
 */

import React, {useEffect, useState} from "react";

/**
 * This hook detects whether the user has clicked outside or inside
 * the observed DOM component.
 *
 * @param ref
 */
export const useDetectOutsideClick = (
  ref:  React.MutableRefObject<HTMLElement | null>
) => {
  const [clickedOutside, setClickedOutside] = useState<boolean>();

  useEffect(() => {
    const checkAndHandleOutsideClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        setClickedOutside(false);
      } else {
        setClickedOutside(true);
      }
    };

    document.addEventListener("mousedown", checkAndHandleOutsideClick);
    return () => document.removeEventListener("mousedown", checkAndHandleOutsideClick);
  }, [ref]);

  return clickedOutside;
};