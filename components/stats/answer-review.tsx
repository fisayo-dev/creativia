import { CancelCircleIcon, CheckmarkCircle02Icon, Forward01Icon, Idea01Icon } from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { DIFFICULTY_META } from "@/config/game";
import { cn } from "@/lib/utils";
import type { AnswerRecord } from "@/types/game";
import { formatDuration } from "@/utils/format";

const statusStyle = {
  correct: { icon: CheckmarkCircle02Icon, className: "text-success" },
  wrong: { icon: CancelCircleIcon, className: "text-error" },
  skipped: { icon: Forward01Icon, className: "text-muted" },
} as const;

export function AnswerReview({ answers }: { answers: AnswerRecord[] }) {
  return (
    <Card className="p-0 sm:p-0">
      <h2 className="px-5 pt-5 text-lg font-black text-ink sm:px-6">every word</h2>
      <ol className="mt-3 divide-y-2 divide-line">
        {answers.map((a, i) => {
          const style = statusStyle[a.status];
          return (
            <li key={a.item.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
              <Icon icon={style.icon} size={26} className={cn("shrink-0", style.className)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-muted">
                  {i + 1}. {a.item.words.join(" · ")}
                </p>
                <p className="font-black text-ink">
                  {a.item.answers.join(" / ")}
                  {a.status === "wrong" && (
                    <span className="ml-2 font-bold text-error line-through decoration-2">{a.guess}</span>
                  )}
                  {a.usedHint && <Icon icon={Idea01Icon} size={16} className="ml-1.5 inline text-info" />}
                </p>
              </div>
              <div className="shrink-0 text-right text-xs font-extrabold tabular-nums">
                <p className="text-muted">{formatDuration(a.timeMs)}</p>
                <p style={{ color: DIFFICULTY_META[a.item.difficulty].color }}>{DIFFICULTY_META[a.item.difficulty].label}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
