import { DIFFICULTY_META, DIFFICULTY_ORDER, GAME_LENGTHS, RANKS, SCORING, type RankId } from "@/config/game";
import { WORDS } from "@/lib/words";
import type { GameLengthId, GameState, GameStats, HintUsage, WordItem } from "@/types/game";
import { normalizeWord, shuffle } from "@/utils/text";

/** picks words for a game, shuffled within each difficulty but always easiest → hardest */
export function buildQueue(length: GameLengthId, bank: WordItem[] = WORDS): WordItem[] {
  const perDifficulty = GAME_LENGTHS.find((l) => l.id === length)?.perDifficulty ?? null;

  return DIFFICULTY_ORDER.flatMap((difficulty) => {
    const pool = shuffle(bank.filter((w) => w.difficulty === difficulty));
    return perDifficulty === null ? pool : pool.slice(0, perDifficulty);
  });
}

export function isCorrect(item: WordItem, guess: string): boolean {
  const g = normalizeWord(guess);
  if (!g) return false;
  return item.answers.some((a) => normalizeWord(a) === g);
}

export const NO_HINTS: HintUsage = { letters: [], explained: false };

/** the word the hints describe. items with several answers hint at the first one */
export function hintAnswer(item: WordItem): string {
  return item.answers[0].toLowerCase();
}

/** how many letters may be revealed. never all of them, or the hint would be the answer */
export function maxLetterHints(item: WordItem): number {
  return Math.max(0, Math.min(SCORING.maxLetters, hintAnswer(item).length - 1));
}

/** a random position that isn't revealed yet, or null when the letter hints are used up */
export function pickLetterHint(item: WordItem, revealed: number[]): number | null {
  if (revealed.length >= maxLetterHints(item)) return null;
  const open = [...hintAnswer(item)].map((_, i) => i).filter((i) => !revealed.includes(i));
  return open.length ? open[Math.floor(Math.random() * open.length)] : null;
}

export function usedAnyHint(hints: HintUsage): boolean {
  return hints.letters.length > 0 || hints.explained;
}

/** 0..1 share of the base xp that hints have cost */
export function hintPenalty(hints: HintUsage): number {
  const penalty = hints.letters.length * SCORING.letterPenalty + (hints.explained ? SCORING.explainPenalty : 0);
  return Math.min(1, penalty);
}

export function computeXp(
  item: WordItem,
  { timeMs, hints, streak }: { timeMs: number; hints: HintUsage; streak: number },
): number {
  let xp = DIFFICULTY_META[item.difficulty].xp;
  xp *= 1 - hintPenalty(hints);
  if (timeMs <= SCORING.fastAnswerMs) xp += SCORING.fastBonus;
  if (streak >= SCORING.streakThreshold) xp += SCORING.streakBonus;
  return Math.round(xp);
}

export function computeStats(state: GameState): GameStats {
  const { answers } = state;
  const correct = answers.filter((a) => a.status === "correct");
  const wrong = answers.filter((a) => a.status === "wrong").length;
  const skipped = answers.filter((a) => a.status === "skipped").length;
  const answered = answers.length;
  const totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0);

  return {
    player: state.player,
    correct: correct.length,
    wrong,
    skipped,
    answered,
    total: state.queue.length,
    accuracy: answered ? Math.round((correct.length / answered) * 100) : 0,
    xp: answers.reduce((sum, a) => sum + a.xp, 0),
    totalTimeMs,
    averageTimeMs: answered ? Math.round(totalTimeMs / answered) : 0,
    fastestMs: correct.length ? Math.min(...correct.map((a) => a.timeMs)) : null,
    bestStreak: state.bestStreak,
    endedEarly: state.endedEarly,
    byDifficulty: DIFFICULTY_ORDER.map((difficulty) => {
      const inLevel = answers.filter((a) => a.item.difficulty === difficulty);
      return {
        difficulty,
        attempted: inLevel.length,
        correct: inLevel.filter((a) => a.status === "correct").length,
      };
    }).filter((d) => d.attempted > 0),
  };
}

export function getRank(accuracy: number): RankId {
  return (RANKS.find((r) => accuracy >= r.min) ?? RANKS[RANKS.length - 1]).id;
}
