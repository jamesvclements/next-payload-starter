"use client";

import { deviceInputMediaQueries } from "../constants/media-queries";
import { useMediaQuerySSR } from "./use-media-query-ssr";

type UseDeviceInputTypeReturnType = {
  isLaptopOrDesktop: boolean;
  isLikelyTouch: boolean;
  isCellphone: boolean;
};

export function useDeviceInputType(): UseDeviceInputTypeReturnType {
  const isLaptopOrDesktop = useMediaQuerySSR(
    deviceInputMediaQueries.isLaptopOrDesktop,
    true
  );
  const isLikelyTouch = useMediaQuerySSR(deviceInputMediaQueries.isLikelyTouch);
  const isCellphone = useMediaQuerySSR(deviceInputMediaQueries.isCellphone);

  return { isLaptopOrDesktop, isLikelyTouch, isCellphone };
}
