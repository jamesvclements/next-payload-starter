'use client';

import { useMediaQuerySSR } from './use-media-query-ssr';

import { breakpoints } from '../constants/media-queries';

type useBreakpointReturnType = {
  is4k: boolean;
  isDesktopL: boolean;
  isDesktopM: boolean;
  isLaptop: boolean;
  isTablet: boolean;
  isMobileL: boolean;
  isMobileM: boolean;
  isMobileS: boolean;
};

export function useBreakpoint(): useBreakpointReturnType {
  const is4k = useMediaQuerySSR(`(max-width: ${breakpoints["4k"].max})`, false);
  const isDesktopL = useMediaQuerySSR(
    `(max-width: ${breakpoints.desktopL.max})`,
    false
  );

  const isDesktopM = useMediaQuerySSR(
    `(max-width: ${breakpoints.desktopM.max})`,
    true
  );
  const isLaptop = useMediaQuerySSR(
    `(max-width: ${breakpoints.laptop.max})`,
    false
  );
  const isTablet = useMediaQuerySSR(
    `(max-width: ${breakpoints.tablet.max})`,
    false
  );
  const isMobileL = useMediaQuerySSR(
    `(max-width: ${breakpoints.mobileL.max})`,
    false
  );
  const isMobileM = useMediaQuerySSR(
    `(max-width: ${breakpoints.mobileM.max})`,
    false
  );
  const isMobileS = useMediaQuerySSR(
    `(max-width: ${breakpoints.mobileS.max})`,
    false
  );

  return {
    is4k,
    isDesktopL,
    isDesktopM,
    isLaptop,
    isTablet,
    isMobileL,
    isMobileM,
    isMobileS,
  };
}
