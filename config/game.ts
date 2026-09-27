import type { Difficulty, GameLengthId } from "@/types/game";

export const DIFFICULTY_ORDER: Difficulty[] = ["very-easy", "easy", "medium", "hard", "very-hard"];

/** labels live in the dictionaries under `difficulty` */
export const DIFFICULTY_META: Record<Difficulty, { xp: number; color: string; soft: string }> = {
  "very-easy": { xp: 10, color: "#22B573", soft: "#E3F7EE" },
  easy: { xp: 15, color: "#1CB0F6", soft: "#E1F5FE" },
  medium: { xp: 20, color: "#FF8A1F", soft: "#FFF1E3" },
  hard: { xp: 30, color: "#FF4B4B", soft: "#FFE8E8" },
  "very-hard": { xp: 40, color: "#A560E8", soft: "#F3E9FC" },
};

/** how many items each game length pulls from every difficulty. null = all of them. labels live in the dictionaries */
export const GAME_LENGTHS: { id: GameLengthId; perDifficulty: number | null }[] = [
  { id: "quick", perDifficulty: 2 },
  { id: "classic", perDifficulty: 5 },
  { id: "marathon", perDifficulty: null },
];

export const DEFAULT_GAME_LENGTH: GameLengthId = "quick";

export const SCORING = {
  /** answering under this many ms earns the speed bonus */
  fastAnswerMs: 10_000,
  fastBonus: 5,
  /** a streak at or above this earns the streak bonus on every correct answer */
  streakThreshold: 3,
  streakBonus: 5,
  /** share of the base xp lost for every revealed letter */
  letterPenalty: 0.2,
  /** share of the base xp lost for reading the explanation. it gives away more, so it costs more */
  explainPenalty: 0.4,
  /** at most this many letters can be revealed, and never the whole word */
  maxLetters: 2,
} as const;

export const STORAGE_KEYS = {
  player: "creativia:player",
  muted: "creativia:muted",
  best: "creativia:best",
} as const;

export type RankId = "genius" | "wizard" | "spark" | "rising" | "curious";

/** titles and blurbs live in the dictionaries under `ranks` */
export const RANKS: { min: number; id: RankId }[] = [
  { min: 90, id: "genius" },
  { min: 70, id: "wizard" },
  { min: 50, id: "spark" },
  { min: 25, id: "rising" },
  { min: 0, id: "curious" },
];
