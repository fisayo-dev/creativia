import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the score image reads nunito from disk; make sure the fonts ship with the route
  outputFileTracingIncludes: {
    "/api/score-image": ["./assets/fonts/**/*"],
  },
};

export default nextConfig;
