const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteConfig = {
  name: "creativia",
  tagline: "find the word that links them all",
  description:
    "creativia is a playful remote associates test. see three words, find the one word that connects them, and measure your creative thinking.",
  url,
  /** shown on the score image and share text, e.g. "creativia.app" */
  displayUrl: url.replace(/^https?:\/\//, ""),
  xHandle: process.env.NEXT_PUBLIC_X_HANDLE ?? "",
  source: "https://www.remote-associates-test.com/",
} as const;

export const navLinks = [
  { href: "/", label: "home" },
  { href: "/play", label: "play" },
  { href: "/donate", label: "donate" },
] as const;
