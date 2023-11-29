import Footer from "@/components/footer/footer";
import Nav from "@/components/nav/nav";
import { inter } from "@/fonts";
import { Providers } from "@/lib/state/providers";
import { getHomepage, getNav } from "./data";
import "./globals.css";

import { mapPayloadMetadataToNextMetadata } from "@/lib/utils/utils";

export async function generateMetadata() {
  /* Assume homepage is default metadata */
  const { meta } = await getHomepage();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_CMS_URL!),
    ...mapPayloadMetadataToNextMetadata(meta),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await getNav();
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="bg-white text-black">
        <Providers>
          <Nav nav={nav} />
          {children}
          <Footer />
          <div id="background-root" />
        </Providers>
      </body>
    </html>
  );
}
