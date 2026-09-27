export type Difficulty = "very-easy" | "easy" | "medium" | "hard" | "very-hard";

export type WordItem = {
  id: number;
  words: string[];
  answers: string[];
  difficulty: Difficulty;
};

export type GameLengthId = "quick" | "classic" | "marathon";

export type AnswerStatus = "correct" | "wrong" | "skipped";

/** hints used on one word: positions of revealed letters in the answer, and whether the explanation was read */
export type HintUsage = {
  letters: number[];
  explained: boolean;
};

export type AnswerRecord = {
  item: WordItem;
  guess: string;
  status: AnswerStatus;
  timeMs: number;
  hints: HintUsage;
  xp: number;
};

export type GamePhase = "setup" | "playing" | "finished";

export type GameState = {
  phase: GamePhase;
  player: string;
  length: GameLengthId;
  queue: WordItem[];
  index: number;
  answers: AnswerRecord[];
  /** true while the check/continue footer is showing the result of the current word */
  revealed: boolean;
  hints: HintUsage;
  questionStartedAt: number;
  streak: number;
  bestStreak: number;
  endedEarly: boolean;
};

export type GameStats = {
  player: string;
  correct: number;
  wrong: number;
  skipped: number;
  answered: number;
  total: number;
  accuracy: number;
  xp: number;
  /** sum of the time spent on every answered word */
  totalTimeMs: number;
  averageTimeMs: number;
  fastestMs: number | null;
  bestStreak: number;
  endedEarly: boolean;
  byDifficulty: { difficulty: Difficulty; correct: number; attempted: number }[];
};

/** compact result payload used for share links and the score image */
export type SharedResult = {
  name: string;
  correct: number;
  answered: number;
  xp: number;
  timeMs: number;
  streak: number;
};
