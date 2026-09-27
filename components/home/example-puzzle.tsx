"use client";

import { useState } from "react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { WordTiles } from "@/components/game/word-tiles";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export function ExamplePuzzle() {
  const { dict } = useI18n();
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="w-full">
      <p className="mb-4 text-center text-sm font-extrabold text-muted">{dict.home.examplePrompt}</p>
      <WordTiles words={["cottage", "swiss", "cake"]} size="md" />
      <div className="mt-5 flex justify-center">
        {revealed ? (
          <p className="animate-pop inline-flex items-center gap-2 rounded-full bg-success-soft px-5 py-2.5 text-lg font-black text-success-dark">
            <Icon icon={Tick02Icon} size={20} />
            cheese
          </p>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setRevealed(true)}>
            {dict.home.exampleReveal}
          </Button>
        )}
      </div>
    </Card>
  );
}
