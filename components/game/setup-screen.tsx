"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, Label } from "@/components/ui/input";
import { GAME_LENGTHS, STORAGE_KEYS } from "@/config/game";
import { cn } from "@/lib/utils";
import type { GameLengthId } from "@/types/game";
import { cleanName } from "@/utils/text";

const noopSubscribe = () => () => {};

type SetupScreenProps = {
  defaultLength: GameLengthId;
  onStart: (player: string, length: GameLengthId) => void;
};

export function SetupScreen({ defaultLength, onStart }: SetupScreenProps) {
  const savedName = useSyncExternalStore(
    noopSubscribe,
    () => localStorage.getItem(STORAGE_KEYS.player) ?? "",
    () => "",
  );
  const [typedName, setTypedName] = useState<string | null>(null);
  const [length, setLength] = useState<GameLengthId>(defaultLength);
  const name = typedName ?? savedName;
  const player = cleanName(name);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!player) return;
    localStorage.setItem(STORAGE_KEYS.player, player);
    onStart(player, length);
  }

  return (
    <form onSubmit={handleSubmit} className="animate-rise mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-8 pt-6 sm:pt-12">
      <h1 className="text-center text-3xl font-black text-ink">let&apos;s play!</h1>
      <p className="mt-2 text-center font-semibold text-muted">find the word that links all three.</p>

      <div className="mt-8">
        <Label htmlFor="player">what should we call you?</Label>
        <Input
          id="player"
          value={name}
          onChange={(e) => setTypedName(e.target.value)}
          placeholder="your name"
          maxLength={20}
          autoComplete="nickname"
          autoFocus
          enterKeyHint="go"
        />
      </div>

      <fieldset className="mt-7">
        <legend className="mb-2 text-sm font-extrabold text-ink">pick a game</legend>
        <div className="grid gap-3">
          {GAME_LENGTHS.map((option) => {
            const active = option.id === length;
            return (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-2xl border-2 border-b-4 px-5 py-4 transition-colors",
                  "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-info/40",
                  active ? "border-primary bg-primary-soft" : "border-line bg-white hover:bg-surface",
                )}
              >
                <input
                  type="radio"
                  name="length"
                  value={option.id}
                  checked={active}
                  onChange={() => setLength(option.id)}
                  className="sr-only"
                />
                <span>
                  <span className={cn("block text-lg font-black", active ? "text-primary-dark" : "text-ink")}>
                    {option.label}
                  </span>
                  <span className="block text-sm font-bold text-muted">{option.description}</span>
                </span>
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full border-2",
                    active ? "border-primary bg-primary" : "border-line",
                  )}
                >
                  {active && <span className="size-2 rounded-full bg-white" />}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-auto pt-8">
        <Button type="submit" size="lg" block disabled={!player}>
          <Icon icon={PlayIcon} />
          start
        </Button>
        <p className="mt-3 text-center text-xs font-bold text-muted">you can end the game at any time.</p>
      </div>
    </form>
  );
}
