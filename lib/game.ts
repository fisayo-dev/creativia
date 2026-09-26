import { DIFFICULTY_META, DIFFICULTY_ORDER, GAME_LENGTHS, RANKS, SCORING } from "@/config/game";
import { WORDS } from "@/lib/words";
import type { GameLengthId, GameState, GameStats, WordItem } from "@/types/game";
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

/** the hint reveals the first letter and the answer's length */
export function getHint(item: WordItem): string {
  const answer = item.answers[0];
  return answer[0] + " _".repeat(answer.length - 1);
}

export function computeXp(
  item: WordItem,
  { timeMs, usedHint, streak }: { timeMs: number; usedHint: boolean; streak: number },
): number {
  let xp = DIFFICULTY_META[item.difficulty].xp;
  if (usedHint) xp *= SCORING.hintMultiplier;
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

export function getRank(accuracy: number) {
  return RANKS.find((r) => accuracy >= r.min) ?? RANKS[RANKS.length - 1];
}
