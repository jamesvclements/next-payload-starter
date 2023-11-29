"use client";

import { useHover } from "@/lib/hooks/use-hover";
import React from "react";

const HoverContext = React.createContext(false);

export const HoverProvider = ({ children }: { children: React.ReactNode }) => {
  const [ref, isHovered] = useHover<HTMLDivElement>();
  return (
    <HoverContext.Provider value={isHovered}>
      <div ref={ref}>{children}</div>
    </HoverContext.Provider>
  );
};

export const useHoverContext = () => {
  return React.useContext(HoverContext);
};
