"use client";

import { StoreProvider } from "./store-context";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <ThemeProvider
      themes={["dark", "light"]}
      defaultTheme="dark"
      forcedTheme={pathname === "/404" ? "light" : undefined}
    >
      <StoreProvider>
        <MotionConfig
          transition={{
            duration: 0.15,
          }}
        >
          {children}
        </MotionConfig>
      </StoreProvider>
    </ThemeProvider>
  );
};
