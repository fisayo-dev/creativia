"use client";

import { useCallback, useMemo, useReducer } from "react";
import { DEFAULT_GAME_LENGTH } from "@/config/game";
import { buildQueue, computeStats, computeXp, isCorrect } from "@/lib/game";
import type { AnswerRecord, AnswerStatus, GameLengthId, GameState, WordItem } from "@/types/game";

type Action =
  | { type: "start"; player: string; length: GameLengthId; queue: WordItem[]; now: number }
  | { type: "hint" }
  | { type: "answer"; guess: string; skipped: boolean; now: number }
  | { type: "next"; now: number }
  | { type: "end" }
  | { type: "reset" };

const initialState: GameState = {
  phase: "setup",
  player: "",
  length: DEFAULT_GAME_LENGTH,
  queue: [],
  index: 0,
  answers: [],
  revealed: false,
  usedHint: false,
  questionStartedAt: 0,
  streak: 0,
  bestStreak: 0,
  endedEarly: false,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return {
        ...initialState,
        phase: "playing",
        player: action.player,
        length: action.length,
        queue: action.queue,
        questionStartedAt: action.now,
      };

    case "hint":
      if (state.phase !== "playing" || state.revealed) return state;
      return { ...state, usedHint: true };

    case "answer": {
      if (state.phase !== "playing" || state.revealed) return state;
      const item = state.queue[state.index];
      const timeMs = Math.max(0, action.now - state.questionStartedAt);
      const status: AnswerStatus = action.skipped ? "skipped" : isCorrect(item, action.guess) ? "correct" : "wrong";
      const streak = status === "correct" ? state.streak + 1 : 0;
      const record: AnswerRecord = {
        item,
        guess: action.guess.trim(),
        status,
        timeMs,
        usedHint: state.usedHint,
        xp: status === "correct" ? computeXp(item, { timeMs, usedHint: state.usedHint, streak }) : 0,
      };
      return {
        ...state,
        answers: [...state.answers, record],
        revealed: true,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
      };
    }

    case "next": {
      if (state.phase !== "playing") return state;
      const index = state.index + 1;
      if (index >= state.queue.length) return { ...state, phase: "finished", revealed: false };
      return { ...state, index, revealed: false, usedHint: false, questionStartedAt: action.now };
    }

    case "end":
      if (state.phase !== "playing") return state;
      return {
        ...state,
        phase: "finished",
        revealed: false,
        endedEarly: state.answers.length < state.queue.length,
      };

    case "reset":
      return { ...initialState, player: state.player, length: state.length };
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const start = useCallback((player: string, length: GameLengthId) => {
    dispatch({ type: "start", player, length, queue: buildQueue(length), now: Date.now() });
  }, []);
  const submit = useCallback((guess: string) => dispatch({ type: "answer", guess, skipped: false, now: Date.now() }), []);
  const skip = useCallback(() => dispatch({ type: "answer", guess: "", skipped: true, now: Date.now() }), []);
  const next = useCallback(() => dispatch({ type: "next", now: Date.now() }), []);
  const hint = useCallback(() => dispatch({ type: "hint" }), []);
  const end = useCallback(() => dispatch({ type: "end" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const current = state.queue[state.index];
  const lastAnswer = state.revealed ? state.answers[state.answers.length - 1] : undefined;
  const stats = useMemo(() => (state.phase === "finished" ? computeStats(state) : null), [state]);

  return { state, current, lastAnswer, stats, start, submit, skip, next, hint, end, reset };
}
