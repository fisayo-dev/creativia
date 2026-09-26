"use client";

import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/config/game";
import { playSound, type SoundName } from "@/lib/sounds";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getMuted() {
  return localStorage.getItem(STORAGE_KEYS.muted) === "1";
}

/** sound effects with a persisted mute toggle shared across components */
export function useSound() {
  const muted = useSyncExternalStore(subscribe, getMuted, () => false);

  const toggleMuted = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.muted, getMuted() ? "0" : "1");
    listeners.forEach((l) => l());
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!muted) playSound(name);
    },
    [muted],
  );

  return { muted, toggleMuted, play };
}
