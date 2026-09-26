export const donateConfig = {
  currency: "USD",
  presets: [3, 5, 10, 25],
  defaultAmount: 5,
  /** bachs minimum for USD is 1.00 */
  minAmount: 1,
  maxAmount: 1000,
  perks: [
    { title: "keeps the servers on", body: "hosting and bandwidth so anyone can play for free." },
    { title: "more word packs", body: "funds new puzzles, themes, and languages." },
    { title: "no ads, ever", body: "your support keeps creativia clean and distraction free." },
  ],
} as const;
