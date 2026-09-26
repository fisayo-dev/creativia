import { WORDS } from "@/lib/words";
import type { Difficulty, GameLengthId } from "@/types/game";

export const DIFFICULTY_ORDER: Difficulty[] = ["very-easy", "easy", "medium", "hard", "very-hard"];

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; xp: number; color: string; soft: string }
> = {
  "very-easy": { label: "very easy", xp: 10, color: "#22B573", soft: "#E3F7EE" },
  easy: { label: "easy", xp: 15, color: "#1CB0F6", soft: "#E1F5FE" },
  medium: { label: "medium", xp: 20, color: "#FF8A1F", soft: "#FFF1E3" },
  hard: { label: "hard", xp: 30, color: "#FF4B4B", soft: "#FFE8E8" },
  "very-hard": { label: "very hard", xp: 40, color: "#A560E8", soft: "#F3E9FC" },
};

/** how many items each game length pulls from every difficulty. null = all of them */
export const GAME_LENGTHS: {
  id: GameLengthId;
  label: string;
  description: string;
  perDifficulty: number | null;
}[] = [
  { id: "quick", label: "quick", description: "10 words · ~3 min", perDifficulty: 2 },
  { id: "classic", label: "classic", description: "25 words · ~8 min", perDifficulty: 5 },
  { id: "marathon", label: "marathon", description: `all ${WORDS.length} words`, perDifficulty: null },
];

export const DEFAULT_GAME_LENGTH: GameLengthId = "quick";

export const SCORING = {
  /** answering under this many ms earns the speed bonus */
  fastAnswerMs: 10_000,
  fastBonus: 5,
  /** a streak at or above this earns the streak bonus on every correct answer */
  streakThreshold: 3,
  streakBonus: 5,
  /** multiplier applied to base xp when the hint was used */
  hintMultiplier: 0.5,
} as const;

export const STORAGE_KEYS = {
  player: "creativia:player",
  muted: "creativia:muted",
  best: "creativia:best",
} as const;

export const RANKS: { min: number; title: string; blurb: string }[] = [
  { min: 90, title: "creative genius", blurb: "your mind makes connections most people never see." },
  { min: 70, title: "word wizard", blurb: "seriously sharp associative thinking." },
  { min: 50, title: "idea spark", blurb: "solid creative instincts. keep stretching them." },
  { min: 25, title: "rising thinker", blurb: "you're warming up. the hard ones get easier with play." },
  { min: 0, title: "curious mind", blurb: "every genius started somewhere. go again!" },
];
