import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { t } from "@/i18n/format";
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

export function shareText(result: SharedResult, copy: Dictionary["share"]): string {
  return [
    t(copy.textScore, { correct: result.correct, answered: result.answered, site: siteConfig.name }),
    t(copy.textStats, { xp: result.xp, time: formatDuration(result.timeMs), streak: result.streak }),
    copy.textChallenge,
  ].join("\n");
}

/** the full message people copy: the text plus a link back to the score card */
export function shareMessage(result: SharedResult, copy: Dictionary["share"]): string {
  return `${shareText(result, copy)}\n${resultPageUrl(result)}`;
}

export function xIntentUrl(result: SharedResult, copy: Dictionary["share"]): string {
  const params = new URLSearchParams({ text: shareText(result, copy), url: resultPageUrl(result) });
  if (siteConfig.xHandle) params.set("via", siteConfig.xHandle.replace(/^@/, ""));
  return `https://x.com/intent/post?${params}`;
}
