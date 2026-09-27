"use client";

import { useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Logo } from "@/components/layout/logo";
import { PlayScreen } from "@/components/game/play-screen";
import { ResultsScreen } from "@/components/game/results-screen";
import { SetupScreen } from "@/components/game/setup-screen";
import { SoundToggle } from "@/components/game/sound-toggle";
import { STORAGE_KEYS } from "@/config/game";
import { useGame } from "@/hooks/use-game";
import { useSound } from "@/hooks/use-sound";
import { isCorrect } from "@/lib/game";

/** saves the xp as the personal best if it beats it, and reports whether it did */
function recordBest(xp: number): boolean {
  const previous = Number(localStorage.getItem(STORAGE_KEYS.best) ?? 0);
  if (xp <= previous) return false;
  localStorage.setItem(STORAGE_KEYS.best, String(xp));
  return previous > 0;
}

export function GameShell() {
  const game = useGame();
  const { play } = useSound();
  const [isNewBest, setIsNewBest] = useState(false);
  const { state, current } = game;

  function finish() {
    play("finish");
    setIsNewBest(recordBest(state.answers.reduce((sum, a) => sum + a.xp, 0)));
    window.scrollTo({ top: 0 });
  }

  function handleSubmit(guess: string) {
    play(isCorrect(current, guess) ? "correct" : "wrong");
    game.submit(guess);
  }

  function handleSkip() {
    play("skip");
    game.skip();
  }

  function handleNext() {
    if (state.index + 1 >= state.queue.length) finish();
    game.next();
  }

  function handleEnd() {
    if (state.answers.length === 0) return game.reset();
    finish();
    game.end();
  }


  if (state.phase === "playing" && current) {
    return (
      <PlayScreen
        state={state}
        current={current}
        lastAnswer={game.lastAnswer}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        onRevealLetter={game.revealLetter}
        onExplain={game.explain}
        onNext={handleNext}
        onEnd={handleEnd}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4 sm:h-20">
        <Logo />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <SoundToggle />
        </div>
      </header>
      {state.phase === "finished" && game.stats ? (
        <ResultsScreen
          stats={game.stats}
          answers={state.answers}
          isNewBest={isNewBest}
          onRestart={() => {
            setIsNewBest(false);
            game.reset();
          }}
        />
      ) : (
        <SetupScreen defaultLength={state.length} onStart={game.start} />
      )}
    </div>
  );
}
