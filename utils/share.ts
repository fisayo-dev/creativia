import { siteConfig } from "@/config/site";
import type { GameStats, SharedResult } from "@/types/game";
import { cleanName } from "@/utils/text";
import { formatDuration } from "@/utils/format";

export function toSharedResult(stats: GameStats): SharedResult {
  return {
    name: stats.player,
    correct: stats.correct,
    answered: stats.answered,
    xp: stats.xp,
    timeMs: stats.totalTimeMs,
    streak: stats.bestStreak,
  };
}

function toParams(result: SharedResult): URLSearchParams {
  return new URLSearchParams({
    n: result.name,
    c: String(result.correct),
    a: String(result.answered),
    x: String(result.xp),
    t: String(Math.round(result.timeMs)),
    s: String(result.streak),
  });
}

/** reads a result back from query params, clamping everything to sane values */
export function parseSharedResult(params: Record<string, string | string[] | undefined>): SharedResult {
  const get = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const int = (key: string, max: number) => {
    const n = Math.floor(Number(get(key)));
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
  };
  const answered = int("a", 10_000);
  return {
    name: cleanName(get("n") ?? "") || "someone",
    answered,
    correct: Math.min(int("c", 10_000), answered),
    xp: int("x", 1_000_000),
    timeMs: int("t", 1_000 * 60 * 60 * 24),
    streak: int("s", 10_000),
  };
}

export function resultPageUrl(result: SharedResult): string {
  return `${siteConfig.url}/result?${toParams(result)}`;
}

export function resultImagePath(result: SharedResult): string {
  return `/api/score-image?${toParams(result)}`;
}

export function shareText(result: SharedResult): string {
  return [
    `i scored ${result.correct}/${result.answered} on ${siteConfig.name} 🧠`,
    `⚡ ${result.xp} xp · ⏱️ ${formatDuration(result.timeMs)} · 🔥 best streak ${result.streak}`,
    `think you're more creative? try it:`,
  ].join("\n");
}

export function xIntentUrl(result: SharedResult): string {
  const params = new URLSearchParams({ text: shareText(result), url: resultPageUrl(result) });
  if (siteConfig.xHandle) params.set("via", siteConfig.xHandle.replace(/^@/, ""));
  return `https://x.com/intent/post?${params}`;
}
