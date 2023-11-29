import React from "react";

// export const useMediaQuerySSR = (query: string, fallback = false): boolean => {
//   if (typeof window === 'undefined') {
//     return fallback;
//   }
//   return useMediaQuery(query);
// }

export function useMediaQuerySSR(query: string, fallback = false): boolean {
  const subscribe = React.useCallback(
    (callback: any) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return fallback;
  };

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}