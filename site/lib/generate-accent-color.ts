// import "server-only";

import { DependencyList, useEffect, useMemo } from "react";
import { accentColors } from "./constants/colors";

export let accentColorIndex = 0;

export function generateAccentColor() {
  const color = accentColors[accentColorIndex];
  accentColorIndex = (accentColorIndex + 1) % accentColors.length;
  return color;
}

export const useGenerateAccentColor = (deps: DependencyList = []) => {
  const color = useMemo(() => generateAccentColor(), deps);
  return color;
};
