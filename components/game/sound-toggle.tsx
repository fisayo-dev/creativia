"use client";

import { VolumeHighIcon, VolumeMute02Icon } from "@hugeicons/core-free-icons";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useSound } from "@/hooks/use-sound";

export function SoundToggle() {
  const { dict } = useI18n();
  const { muted, toggleMuted } = useSound();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMuted}
      aria-label={muted ? dict.sound.on : dict.sound.off}
      aria-pressed={!muted}
    >
      <Icon icon={muted ? VolumeMute02Icon : VolumeHighIcon} size={24} />
    </Button>
  );
}
