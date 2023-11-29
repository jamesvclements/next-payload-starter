// @type {import('tailwindcss').Config}
import defaultTheme from "tailwindcss/defaultTheme";
import {
  breakpoints,
  deviceInputMediaQueries,
} from "./lib/constants/media-queries";
import { colors } from "./lib/constants/colors";
import plugin from "tailwindcss/plugin";

module.exports = {
  future: {
    /* so that :hover rules are not used on touch devices */
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
    },
    screens: {
      ...breakpoints,
      "laptop-or-desktop": {
        raw: deviceInputMediaQueries.isLaptopOrDesktop,
      },
      "likely-touch": {
        raw: deviceInputMediaQueries.isLikelyTouch,
      },
      cellphone: {
        raw: deviceInputMediaQueries.isCellphone,
      },
    },
    fontSize: {
      base: ["var(--text-base)", "var(--text-base-leading)"],
      sm: ["var(--text-sm)", "var(--text-sm-leading)"],
      xs: ["var(--text-xs)", "var(--text-xs-leading)"],
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        headingXl: ["var(--heading-xl)", "var(--heading-xl-leading)"],
        headingLg: ["var(--heading-lg)", "var(--heading-lg-leading)"],
        headingMd: ["var(--heading-md)", "var(--heading-md-leading)"],
        headingBase: ["var(--heading-base)", "var(--heading-base-leading)"],
        headingSm: ["var(--heading-sm)", "var(--heading-sm-leading)"],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontSize: theme("fontSize.headingXl") },
        h2: { fontSize: theme("fontSize.headingLg") },
        h3: { fontSize: theme("fontSize.headingMd") },
        body: { fontSize: theme("fontSize.base") },
      });
    }),
  ],
};
