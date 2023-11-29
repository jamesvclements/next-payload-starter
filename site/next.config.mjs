import withPlaiceholder from "@plaiceholder/next";

const mapWhitelistToRemotePatterns = (whitelist) => {
  if (!whitelist) {
    return [];
  }
  const urls = whitelist.split(",");
  return urls.map((url) => {
    const protocol = url.startsWith("https") ? "https" : "http";
    const hostAndPort = url.replace(/https?:\/\//, "");
    const [hostname, port] = hostAndPort.split(":");
    const remotePattern = {
      protocol,
      hostname,
      port: port || "",
      pathname: "/media/**",
    };

    console.log(
      `Adding remote pattern: ${JSON.stringify(remotePattern, null, 2)}`
    );

    return remotePattern;
  });
};

/** @type {import('next').NextConfig}*/
const nextConfig = {
  images: {
    remotePatterns: mapWhitelistToRemotePatterns(process.env.WHITELIST),
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    /* Disable minification in preview mode */
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      config.optimization.minimize = false;
    }
    return config;
  },
  // Prevent preview site from being indexed by search engines
  async headers() {
    const headers = [];
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      headers.push({
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
        source: "/:path*",
      });
    }
    return headers;
  },
};

export default withPlaiceholder(nextConfig);
