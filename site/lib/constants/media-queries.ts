export const breakpoints = {
  "4k": { max: "2560px" },
  desktopL: { max: "1920px" },
  desktopM: { max: "1280px" },
  laptop: { max: "1024px" },
  tablet: { max: "768px" },
  mobileL: { max: "480px" },
  mobileM: { max: "375px" },
  mobileS: { max: "320px" },
};

export const deviceInputMediaQueries = {
  isLaptopOrDesktop: "(hover: hover) and (pointer: fine)",
  isLikelyTouch: "(any-pointer: coarse)",
  isCellphone: "(hover: none) and (pointer: coarse)",
};
