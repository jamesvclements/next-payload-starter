import Link from "next/link";
import { getFooter } from "@/app/data";
import { href } from "@/lib/utils/utils";

const Footer = async () => {
  const footer = await getFooter();
  return (
    <footer className="flex justify-between items-center py-[2rem] px-[--global-padding-x] bg-black h-[20vh]">
      <Link href="/" className="h-10"></Link>
    </footer>
  );
};

export default Footer;
