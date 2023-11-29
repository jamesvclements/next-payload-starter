"use client";

import { createContext, useContext, useEffect, useState } from "react";
import "./cursor.css";

import { motion, useMotionValue } from "framer-motion";
import { usePathname } from "next/navigation";

export interface CursorState {
  variant: "default" | "interactive" | "portal";
}

const initialState = {
  variant: "default" as CursorState["variant"],
  setCursorState: () => {},
};

const CursorContext = createContext<
  CursorState & {
    setCursorState: (state: Partial<CursorState>) => void;
  }
>(initialState);

export function useCursor() {
  return useContext(CursorContext);
}

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<CursorState>(initialState);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    x.set(e.clientX);
    y.set(e.clientY);
  }

  /* Reset cursor state on route change */
  const pathname = usePathname();
  useEffect(() => {
    setState(initialState);
  }, [pathname]);

  return (
    <CursorContext.Provider
      value={{
        ...state,
        setCursorState: (newState) => setState({ ...state, ...newState }),
      }}
    >
      <div className="cursor-provider" onMouseMove={handleMouseMove}>
        {children}
      </div>
      <motion.div
        className="cursor likely-touch:hidden"
        style={{
          x,
          y,
        }}
      ></motion.div>
    </CursorContext.Provider>
  );
};
