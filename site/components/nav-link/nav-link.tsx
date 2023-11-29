import { HTMLAttributes } from "react";
import Link from "@/components/link/link";
import { Nav } from "@cms/payload-types";
import { href } from "@/lib/utils/utils";
import { useGenerateAccentColor } from "@/lib/generate-accent-color";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import classNames from "classnames";

export default function NavLink({
  link,
  ...rest
}: {
  link: Nav["links"][number];
} & HTMLAttributes<HTMLAnchorElement>) {
  const accentColor = useGenerateAccentColor();
  const pathname = usePathname();
  const isActive = pathname === href(link.link);
  return (
    <motion.div layout="position">
      <Link
        className={classNames("nav-link", { active: isActive })}
        href={href(link.link)}
        {...rest}
      >
        {link.title}{" "}
      </Link>
    </motion.div>
  );
}
