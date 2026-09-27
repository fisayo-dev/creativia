"use client";

import { useCallback, useMemo, useReducer } from "react";
import { DEFAULT_GAME_LENGTH } from "@/config/game";
import { NO_HINTS, buildQueue, computeStats, computeXp, isCorrect, maxLetterHints, pickLetterHint } from "@/lib/game";
import type { AnswerRecord, AnswerStatus, GameLengthId, GameState, WordItem } from "@/types/game";

type Action =
  | { type: "start"; player: string; length: GameLengthId; queue: WordItem[]; now: number }
  | { type: "letter"; position: number }
  | { type: "explain" }
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
  hints: NO_HINTS,
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

    case "letter": {
      if (state.phase !== "playing" || state.revealed) return state;
      const { letters } = state.hints;
      if (letters.includes(action.position) || letters.length >= maxLetterHints(state.queue[state.index])) return state;
      return { ...state, hints: { ...state.hints, letters: [...letters, action.position] } };
    }

    case "explain":
      if (state.phase !== "playing" || state.revealed || state.hints.explained) return state;
      return { ...state, hints: { ...state.hints, explained: true } };

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
        hints: state.hints,
        xp: status === "correct" ? computeXp(item, { timeMs, hints: state.hints, streak }) : 0,
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
      return { ...state, index, revealed: false, hints: NO_HINTS, questionStartedAt: action.now };
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
  // the random pick happens out here so the reducer stays pure
  const revealLetter = useCallback(() => {
    if (state.phase !== "playing" || state.revealed) return;
    const position = pickLetterHint(state.queue[state.index], state.hints.letters);
    if (position !== null) dispatch({ type: "letter", position });
  }, [state.phase, state.revealed, state.queue, state.index, state.hints.letters]);
  const explain = useCallback(() => dispatch({ type: "explain" }), []);
  const end = useCallback(() => dispatch({ type: "end" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const current = state.queue[state.index];
  const lastAnswer = state.revealed ? state.answers[state.answers.length - 1] : undefined;
  const stats = useMemo(() => (state.phase === "finished" ? computeStats(state) : null), [state]);

  return { state, current, lastAnswer, stats, start, submit, skip, next, revealLetter, explain, end, reset };
}
