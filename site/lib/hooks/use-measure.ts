import { useState, useRef, useLayoutEffect, RefObject } from "react";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type UseMeasureReturnType<T extends HTMLElement> = [RefObject<T>, Rect];

export function useMeasure<T extends HTMLElement>(): UseMeasureReturnType<T> {
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });

  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function handleResize() {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (ref.current !== null) {
          setRect(ref.current.getBoundingClientRect());
        }
        /* todo – ideally we could debounce this, but that breaks during soft nav */
      }, 0);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [ref, rect];
}
