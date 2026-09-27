"use client";

import { Flag02Icon } from "@hugeicons/core-free-icons";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icon } from "@/components/ui/icon";
import { t } from "@/i18n/format";

type EndGameDialogProps = {
  open: boolean;
  answered: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function EndGameDialog({ open, answered, onCancel, onConfirm }: EndGameDialogProps) {
  const { dict } = useI18n();
  const copy = dict.endGame;

  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon icon={Flag02Icon} size={32} />
          </span>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {answered === 0 ? copy.none : answered === 1 ? copy.playedOne : t(copy.played, { count: answered })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* cancel first so it takes the initial focus: keeping the game going is the safe default */}
          <AlertDialogCancel variant="primary" size="lg">
            {copy.keepPlaying}
          </AlertDialogCancel>
          <AlertDialogAction variant="ghost" size="md" onClick={onConfirm} className="text-error hover:text-error-dark">
            {answered > 0 ? copy.endAndSee : copy.quit}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
