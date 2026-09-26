/** lowercases and strips anything that isn't a letter so "  Cheese! " matches "cheese" */
export function normalizeWord(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function cleanName(value: string, max = 20): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
