// `||` not `??`: an empty env var (e.g. left blank in the vercel dashboard) must fall through too
const vercelHost = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const url = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");

export const siteConfig = {
  name: "creativia",
  /** english copy for the share images. pages use the localized versions from the dictionaries */
  tagline: "find the word that links them all",
  description:
    "creativia is a playful remote associates test. see three words, find the one word that connects them, and measure your creative thinking.",
  url,
  /** shown on the score image and share text, e.g. "creativia.app" */
  displayUrl: url.replace(/^https?:\/\//, ""),
  xHandle: process.env.NEXT_PUBLIC_X_HANDLE ?? "",
  source: "https://www.remote-associates-test.com/",
} as const;

/** labels come from the dictionaries under `nav` */
export const navLinks = [
  { href: "/", key: "home" },
  { href: "/play", key: "play" },
  { href: "/donate", key: "donate" },
] as const;
