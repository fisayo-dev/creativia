"use client";

import { VolumeHighIcon, VolumeMute02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useSound } from "@/hooks/use-sound";

export function SoundToggle() {
  const { muted, toggleMuted } = useSound();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMuted}
      aria-label={muted ? "turn sound on" : "turn sound off"}
      aria-pressed={!muted}
    >
      <Icon icon={muted ? VolumeMute02Icon : VolumeHighIcon} size={24} />
    </Button>
  );
}
