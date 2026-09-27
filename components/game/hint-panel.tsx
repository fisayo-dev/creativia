"use client";

import { useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { BookOpen01Icon, TextFontIcon } from "@hugeicons/core-free-icons";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icon } from "@/components/ui/icon";
import { SCORING } from "@/config/game";
import { useSound } from "@/hooks/use-sound";
import { t } from "@/i18n/format";
import { getExplanation } from "@/lib/explanations";
import { hintAnswer, maxLetterHints } from "@/lib/game";
import { cn } from "@/lib/utils";
import type { HintUsage, WordItem } from "@/types/game";

type HintPanelProps = {
  item: WordItem;
  hints: HintUsage;
  /** true once the word has been answered. hints lock but the revealed letters stay */
  locked: boolean;
  onRevealLetter: () => void;
  onExplain: () => void;
};

/** two kinds of hint: flip up to two random letters, or read a description of the word */
export function HintPanel({ item, hints, locked, onRevealLetter, onExplain }: HintPanelProps) {
  const { dict } = useI18n();
  const { play } = useSound();
  const [explainOpen, setExplainOpen] = useState(false);

  const answer = hintAnswer(item);
  const explanation = getExplanation(answer);
  const lettersLeft = maxLetterHints(item) - hints.letters.length;

  function handleLetter() {
    play("reveal");
    onRevealLetter();
  }

  function handleExplainOpenChange(open: boolean) {
    if (open && !hints.explained) onExplain();
    play(open ? "open" : "close");
    setExplainOpen(open);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {hints.letters.length > 0 && (
        <ol
          className="grid w-full justify-center gap-1.5"
          style={{ gridTemplateColumns: `repeat(${answer.length}, minmax(0, 2.75rem))` }}
          aria-label={dict.hints.letterSlots}
        >
          {[...answer].map((letter, i) => {
            const shown = hints.letters.includes(i);
            return (
              <li
                key={i}
                className={cn(
                  "grid aspect-square place-items-center rounded-xl border-2 border-b-4 text-xl font-black uppercase sm:text-2xl",
                  shown ? "animate-flip border-info bg-info-soft text-info-dark" : "border-line bg-surface text-line-dark",
                )}
                aria-label={shown ? letter : dict.hints.hidden}
              >
                {shown ? letter : "·"}
              </li>
            );
          })}
        </ol>
      )}

      {!locked && (
        <div className="w-full">
          <p className="mb-2 text-center text-sm font-extrabold text-muted">{dict.hints.title}</p>
          <div className="grid grid-cols-2 gap-3">
            <HintButton
              icon={TextFontIcon}
              label={dict.hints.letter}
              detail={`${t(dict.hints.penalty, { percent: SCORING.letterPenalty * 100 })} · ${
                lettersLeft > 0 ? t(dict.hints.lettersLeft, { count: lettersLeft }) : dict.hints.noLettersLeft
              }`}
              tone="info"
              disabled={lettersLeft <= 0}
              onClick={handleLetter}
            />
            {explanation && (
              <HintButton
                icon={BookOpen01Icon}
                label={hints.explained ? dict.hints.explainAgain : dict.hints.explain}
                detail={hints.explained ? "✓" : t(dict.hints.penalty, { percent: SCORING.explainPenalty * 100 })}
                tone="primary"
                onClick={() => handleExplainOpenChange(true)}
              />
            )}
          </div>
        </div>
      )}

      {explanation && (
        <AlertDialog open={explainOpen} onOpenChange={handleExplainOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
                <Icon icon={BookOpen01Icon} size={32} />
              </span>
              <AlertDialogTitle>{dict.hints.dialogTitle}</AlertDialogTitle>
              <AlertDialogDescription className="mt-4 w-full rounded-2xl bg-surface px-5 py-4 text-lg font-bold text-ink">
                {explanation}
              </AlertDialogDescription>
              <p className="mt-3 text-sm font-bold text-muted">{dict.hints.dialogNote}</p>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>{dict.hints.gotIt}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

const tones = {
  info: { chip: "bg-info-soft text-info", hover: "hover:border-info" },
  primary: { chip: "bg-primary-soft text-primary", hover: "hover:border-primary" },
} as const;

type HintButtonProps = {
  icon: IconSvgElement;
  label: string;
  detail: string;
  tone: keyof typeof tones;
  disabled?: boolean;
  onClick: () => void;
};

function HintButton({ icon, label, detail, tone, disabled, onClick }: HintButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-b-4 border-line bg-white p-3 text-left transition-[transform,border-color] outline-none",
        "focus-visible:ring-4 focus-visible:ring-info/40 active:translate-y-0.5 active:border-b-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        !disabled && tones[tone].hover,
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone].chip)}>
        <Icon icon={icon} size={22} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black leading-tight text-ink sm:text-base">{label}</span>
        <span className="block text-xs font-bold text-muted">{detail}</span>
      </span>
    </button>
  );
}
