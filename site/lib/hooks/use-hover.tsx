'use client';

import { useEffect, useRef, useState } from "react";
import { useDeviceInputType } from "./use-device-input-type";

export function useHover<T extends HTMLElement = HTMLElement>() {
  const { isLaptopOrDesktop } = useDeviceInputType();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isLaptopOrDesktop) {
      return;
    }

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const element = ref.current;

    element?.addEventListener("mouseenter", handleMouseEnter);
    element?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element?.removeEventListener("mouseenter", handleMouseEnter);
      element?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isLaptopOrDesktop, ref]);

  return [ref, isHovered] as const;
}
