import { useEffect, useRef } from 'react';

const useTransparentNav = (applyTransparent: boolean = true) => {
  const navInitialBackground = useRef<string>();

  useEffect(() => {
    if (applyTransparent) {
      /* Set the nav to transparent */
      const nav = document.querySelector<HTMLElement>('.nav')!;
      navInitialBackground.current = nav.style.backgroundColor;
      nav.style.backgroundColor = 'transparent';
      return () => {
        nav.style.backgroundColor = navInitialBackground.current!;
      };
    }
  }, [applyTransparent]);
};

export default useTransparentNav;
