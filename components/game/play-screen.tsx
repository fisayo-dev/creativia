"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Cancel01Icon, Clock01Icon, FireIcon, ZapIcon } from "@hugeicons/core-free-icons";
import { AnswerFooter } from "@/components/game/answer-footer";
import { EndGameDialog } from "@/components/game/end-game-dialog";
import { HintPanel } from "@/components/game/hint-panel";
import { SoundToggle } from "@/components/game/sound-toggle";
import { WordTiles } from "@/components/game/word-tiles";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DIFFICULTY_META } from "@/config/game";
import { useElapsed } from "@/hooks/use-elapsed";
import { cn } from "@/lib/utils";
import type { AnswerRecord, GameState, WordItem } from "@/types/game";
import { formatClock } from "@/utils/format";

type PlayScreenProps = {
  state: GameState;
  current: WordItem;
  lastAnswer?: AnswerRecord;
  onSubmit: (guess: string) => void;
  onSkip: () => void;
  onRevealLetter: () => void;
  onExplain: () => void;
  onNext: () => void;
  onEnd: () => void;
};

export function PlayScreen({
  state,
  current,
  lastAnswer,
  onSubmit,
  onSkip,
  onRevealLetter,
  onExplain,
  onNext,
  onEnd,
}: PlayScreenProps) {
  const { dict } = useI18n();
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
        <Button variant="ghost" size="icon" onClick={() => setConfirmEnd(true)} aria-label={dict.play.endGame}>
          <Icon icon={Cancel01Icon} size={26} />
        </Button>
        <Progress value={(done / state.queue.length) * 100} label={dict.play.progress} className="flex-1" />
        <span
          className={cn(
            "flex items-center gap-1 text-lg font-black tabular-nums transition-colors",
            state.streak > 0 ? "text-primary" : "text-line-dark",
          )}
          title={dict.play.streak}
        >
          <Icon icon={FireIcon} size={24} />
          {state.streak}
        </span>
        <SoundToggle />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-6 sm:pt-10">
        <div className="flex items-center justify-between gap-2 text-sm font-extrabold">
          <span className="rounded-full px-3 py-1" style={{ background: meta.soft, color: meta.color }}>
            {dict.difficulty[current.difficulty]}
          </span>
          <span className="flex items-center gap-3 text-muted tabular-nums">
            <span className="flex items-center gap-1" title={dict.play.xpEarned}>
              <Icon icon={ZapIcon} size={18} className="text-primary" />
              {xp}
            </span>
            <span className="flex items-center gap-1" title={dict.play.timeOnWord}>
              <Icon icon={Clock01Icon} size={18} />
              {formatClock(questionTime)}
            </span>
            <span>
              {state.index + 1}/{state.queue.length}
            </span>
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-black text-ink sm:text-3xl">{dict.play.question}</h1>

        <WordTiles words={current.words} animationKey={current.id} label={dict.play.clueWords} className="mt-6" />

        <form id="answer-form" onSubmit={handleSubmit} className="mb-6 mt-8">
          <label htmlFor="guess" className="sr-only">
            {dict.play.answerLabel}
          </label>
          <Input
            ref={inputRef}
            id="guess"
            key={current.id}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={dict.play.answerPlaceholder}
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

        <HintPanel
          key={current.id}
          item={current}
          hints={state.hints}
          locked={state.revealed}
          onRevealLetter={onRevealLetter}
          onExplain={onExplain}
        />
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
