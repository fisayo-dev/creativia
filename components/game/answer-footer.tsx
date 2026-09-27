"use client";

import { CancelCircleIcon, CheckmarkCircle02Icon, Forward01Icon } from "@hugeicons/core-free-icons";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { AnswerRecord } from "@/types/game";
import { formatDuration } from "@/utils/format";

type AnswerFooterProps = {
  result?: AnswerRecord;
  canCheck: boolean;
  isLast: boolean;
  onSkip: () => void;
  onContinue: () => void;
};

/** duolingo style bottom bar: skip/check while answering, colored feedback after */
export function AnswerFooter({ result, canCheck, isLast, onSkip, onContinue }: AnswerFooterProps) {
  const { dict } = useI18n();
  const tone = result?.status === "correct" ? "success" : result ? "error" : null;
  const continueLabel = isLast ? dict.feedback.seeResults : dict.feedback.continue;
  const { praise } = dict.feedback;

  return (
    <footer
      className={cn(
        "sticky bottom-0 z-20 border-t-2 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 transition-colors",
        tone === "success" && "border-transparent bg-success-soft",
        tone === "error" && "border-transparent bg-error-soft",
        !tone && "border-line bg-white",
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        {result ? (
          <>
            <div role="status" aria-live="polite" className="animate-rise flex items-center gap-3">
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-full bg-white",
                  tone === "success" ? "text-success" : "text-error",
                )}
              >
                <Icon icon={tone === "success" ? CheckmarkCircle02Icon : CancelCircleIcon} size={30} />
              </span>
              <div className={tone === "success" ? "text-success-dark" : "text-error-dark"}>
                <p className="text-xl font-black">
                  {result.status === "correct"
                    ? praise[result.item.id % praise.length]
                    : result.status === "skipped"
                      ? dict.feedback.skipped
                      : dict.feedback.notQuite}
                </p>
                <p className="text-sm font-bold">
                  {result.status === "correct" ? (
                    <>
                      +{result.xp} xp · {formatDuration(result.timeMs)}
                    </>
                  ) : (
                    <>
                      {dict.feedback.answer} <span className="font-black">{result.item.answers.join(" / ")}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant={tone === "success" ? "success" : "error"}
              size="lg"
              onClick={onContinue}
              className="w-full sm:w-auto sm:min-w-40"
              autoFocus
            >
              {continueLabel}
            </Button>
          </>
        ) : (
          <div className="flex w-full items-center justify-between gap-3">
            <Button variant="outline" size="lg" onClick={onSkip} className="px-6">
              <Icon icon={Forward01Icon} size={20} />
              {dict.feedback.skip}
            </Button>
            <Button type="submit" form="answer-form" variant="success" size="lg" disabled={!canCheck} className="flex-1 sm:max-w-48">
              {dict.feedback.check}
            </Button>
          </div>
        )}
      </div>
    </footer>
  );
}
