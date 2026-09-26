"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Cancel01Icon, Clock01Icon, FireIcon, Idea01Icon, ZapIcon } from "@hugeicons/core-free-icons";
import { AnswerFooter } from "@/components/game/answer-footer";
import { EndGameDialog } from "@/components/game/end-game-dialog";
import { SoundToggle } from "@/components/game/sound-toggle";
import { WordTiles } from "@/components/game/word-tiles";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DIFFICULTY_META } from "@/config/game";
import { useElapsed } from "@/hooks/use-elapsed";
import { getHint } from "@/lib/game";
import { cn } from "@/lib/utils";
import type { AnswerRecord, GameState, WordItem } from "@/types/game";
import { formatClock } from "@/utils/format";

type PlayScreenProps = {
  state: GameState;
  current: WordItem;
  lastAnswer?: AnswerRecord;
  onSubmit: (guess: string) => void;
  onSkip: () => void;
  onHint: () => void;
  onNext: () => void;
  onEnd: () => void;
};

export function PlayScreen({ state, current, lastAnswer, onSubmit, onSkip, onHint, onNext, onEnd }: PlayScreenProps) {
  const [guess, setGuess] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const elapsed = useElapsed(state.questionStartedAt, !state.revealed);
  const questionTime = lastAnswer ? lastAnswer.timeMs : elapsed;
  const xp = state.answers.reduce((sum, a) => sum + a.xp, 0);
  const meta = DIFFICULTY_META[current.difficulty];
  const done = state.index + (state.revealed ? 1 : 0);
  const isLast = state.index === state.queue.length - 1;

  // fresh input + focus for every new word
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [state.index]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (state.revealed || !guess.trim()) return;
    onSubmit(guess);
  }

  function handleNext() {
    setGuess("");
    onNext();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center gap-2 px-3 pt-4 sm:gap-4 sm:px-4 sm:pt-6">
        <Button variant="ghost" size="icon" onClick={() => setConfirmEnd(true)} aria-label="end game">
          <Icon icon={Cancel01Icon} size={26} />
        </Button>
        <Progress value={(done / state.queue.length) * 100} label="game progress" className="flex-1" />
        <span
          className={cn(
            "flex items-center gap-1 text-lg font-black tabular-nums transition-colors",
            state.streak > 0 ? "text-primary" : "text-line-dark",
          )}
          title="current streak"
        >
          <Icon icon={FireIcon} size={24} />
          {state.streak}
        </span>
        <SoundToggle />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-6 sm:pt-10">
        <div className="flex items-center justify-between gap-2 text-sm font-extrabold">
          <span className="rounded-full px-3 py-1" style={{ background: meta.soft, color: meta.color }}>
            {meta.label}
          </span>
          <span className="flex items-center gap-3 text-muted tabular-nums">
            <span className="flex items-center gap-1" title="xp earned">
              <Icon icon={ZapIcon} size={18} className="text-primary" />
              {xp}
            </span>
            <span className="flex items-center gap-1" title="time on this word">
              <Icon icon={Clock01Icon} size={18} />
              {formatClock(questionTime)}
            </span>
            <span>
              {state.index + 1}/{state.queue.length}
            </span>
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-black text-ink sm:text-3xl">which word links all three?</h1>

        <WordTiles words={current.words} animationKey={current.id} className="mt-6" />

        <form id="answer-form" onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="guess" className="sr-only">
            your answer
          </label>
          <Input
            ref={inputRef}
            id="guess"
            key={current.id}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="type your answer"
            disabled={state.revealed}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="done"
            maxLength={30}
            className={cn(
              "h-16 text-center text-2xl lowercase",
              lastAnswer?.status === "correct" && "border-success bg-success-soft text-success-dark",
              lastAnswer?.status === "wrong" && "animate-shake border-error bg-error-soft text-error-dark",
            )}
          />
        </form>

        <div className="mt-4 flex min-h-11 justify-center">
          {state.usedHint ? (
            <p className="animate-pop flex items-center gap-2 rounded-full bg-info-soft px-4 py-2 font-black tracking-widest text-info-dark">
              <Icon icon={Idea01Icon} size={18} />
              {getHint(current)}
            </p>
          ) : (
            !state.revealed && (
              <Button variant="ghost" size="sm" onClick={onHint} className="text-info hover:text-info-dark">
                <Icon icon={Idea01Icon} size={18} />
                need a hint? (half xp)
              </Button>
            )
          )}
        </div>
      </main>

      <AnswerFooter
        result={lastAnswer}
        canCheck={guess.trim().length > 0}
        isLast={isLast}
        onSkip={onSkip}
        onContinue={handleNext}
      />

      <EndGameDialog
        open={confirmEnd}
        answered={state.answers.length}
        onCancel={() => setConfirmEnd(false)}
        onConfirm={() => {
          setConfirmEnd(false);
          onEnd();
        }}
      />
    </div>
  );
}
