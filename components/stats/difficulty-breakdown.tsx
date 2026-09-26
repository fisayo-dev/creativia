import type { CSSProperties } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DIFFICULTY_META } from "@/config/game";
import type { GameStats } from "@/types/game";

export function DifficultyBreakdown({ rows }: { rows: GameStats["byDifficulty"] }) {
  return (
    <Card>
      <h2 className="text-lg font-black text-ink">by difficulty</h2>
      <ul className="mt-4 grid gap-4">
        {rows.map((row) => {
          const meta = DIFFICULTY_META[row.difficulty];
          return (
            <li key={row.difficulty}>
              <div className="mb-1.5 flex justify-between text-sm font-extrabold">
                <span style={{ color: meta.color }}>{meta.label}</span>
                <span className="text-muted tabular-nums">
                  {row.correct}/{row.attempted}
                </span>
              </div>
              <Progress
                value={(row.correct / row.attempted) * 100}
                className="h-3"
                barClassName="bg-[var(--bar)]"
                label={`${meta.label} accuracy`}
                style={{ "--bar": meta.color } as CSSProperties}
              />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
