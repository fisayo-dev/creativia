"use client";

import type { CSSProperties } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DIFFICULTY_META } from "@/config/game";
import { t } from "@/i18n/format";
import type { GameStats } from "@/types/game";

export function DifficultyBreakdown({ rows }: { rows: GameStats["byDifficulty"] }) {
  const { dict } = useI18n();
  return (
    <Card>
      <h2 className="text-lg font-black text-ink">{dict.results.byDifficulty}</h2>
      <ul className="mt-4 grid gap-4">
        {rows.map((row) => {
          const meta = DIFFICULTY_META[row.difficulty];
          const label = dict.difficulty[row.difficulty];
          return (
            <li key={row.difficulty}>
              <div className="mb-1.5 flex justify-between text-sm font-extrabold">
                <span style={{ color: meta.color }}>{label}</span>
                <span className="text-muted tabular-nums">
                  {row.correct}/{row.attempted}
                </span>
              </div>
              <Progress
                value={(row.correct / row.attempted) * 100}
                className="h-3"
                barClassName="bg-[var(--bar)]"
                label={t(dict.results.levelAccuracy, { level: label })}
                style={{ "--bar": meta.color } as CSSProperties}
              />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
