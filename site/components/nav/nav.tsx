"use client";
import { Nav as NavType } from "@cms/payload-types";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "../link/link";
import NavLink from "../nav-link/nav-link";
import wordmark from "@/public/wordmark.svg";
import NextImage from "next/image";
import "./nav.css";

export default function Nav({ nav }: { nav: NavType }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme: activeTheme, forcedTheme } = useTheme();
  const theme = forcedTheme || activeTheme;

  return (
    <nav className="nav flex items-center h-[--nav-height] tablet:h-auto">
      <div className="container">
        <div className="flex justify-center w-full">
          <a href="https://oldfriends.studio" className="">
            <NextImage src={wordmark} alt="Wordmark" className="h-6 w-auto" />
          </a>
          <div>
            {nav.links.map((link, i) => (
              <NavLink link={link} key={i} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
