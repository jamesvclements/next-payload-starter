"use client";

import NextLink from "next/link";
import { CursorState } from "../cursor/cursor";
import { Nav } from "@cms/payload-types";
import { href } from "@/lib/utils/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asNextLink?: boolean;
  // useInteractiveCursor?: boolean;
  // cursorText?: string;
  cursorState?: Partial<CursorState>;
  link?: Nav["links"][0]["link"];
}

const Link = ({
  asNextLink = false,
  cursorState,
  link,
  ...rest
}: LinkProps) => {
  /* Render external links as anchor tags, internal links as NextLinks */
  const Tag = asNextLink || link?.type !== "url" ? NextLink : "a";

  return (
    <Tag
      {...rest}
      /* @ts-ignore todo */
      href={link ? href(link) : rest.href}
    />
  );
};

export default Link;
