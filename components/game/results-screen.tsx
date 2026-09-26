"use client";

import Link from "next/link";
import {
  ChampionIcon,
  Clock01Icon,
  FireIcon,
  Home01Icon,
  ReloadIcon,
  Rocket01Icon,
  SparklesIcon,
  Target02Icon,
  Timer02Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { ShareActions } from "@/components/share/share-actions";
import { AnswerReview } from "@/components/stats/answer-review";
import { DifficultyBreakdown } from "@/components/stats/difficulty-breakdown";
import { StatTile } from "@/components/stats/stat-tile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { getRank } from "@/lib/game";
import { cn } from "@/lib/utils";
import type { AnswerRecord, GameStats } from "@/types/game";
import { formatDuration } from "@/utils/format";
import { toSharedResult } from "@/utils/share";

type ResultsScreenProps = {
  stats: GameStats;
  answers: AnswerRecord[];
  isNewBest: boolean;
  onRestart: () => void;
};

export function ResultsScreen({ stats, answers, isNewBest, onRestart }: ResultsScreenProps) {
  const rank = getRank(stats.accuracy);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-6 sm:pt-10">
      <section className="animate-rise flex flex-col items-center text-center">
        <span className="animate-float grid size-24 place-items-center rounded-full bg-primary text-white shadow-[0_6px_0_var(--color-primary-dark)]">
          <Icon icon={ChampionIcon} size={52} />
        </span>
        {isNewBest && (
          <span className="animate-pop mt-5 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-4 py-1.5 text-sm font-black text-success-dark">
            <Icon icon={SparklesIcon} size={16} />
            new personal best!
          </span>
        )}
        <p className="mt-4 text-sm font-extrabold tracking-wide text-muted">
          {stats.endedEarly ? "game ended" : "game complete"}
        </p>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">{rank.title}</h1>
        <p className="mt-3 text-lg font-bold text-ink">
          {stats.player}, you found <span className="text-success">{stats.correct}</span> of {stats.answered} links.
        </p>
        <p className="mt-1 font-semibold text-muted">{rank.blurb}</p>
        {stats.endedEarly && (
          <p className="mt-2 text-sm font-bold text-muted">
            you played {stats.answered} of {stats.total} words.
          </p>
        )}
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="total xp" value={stats.xp} icon={ZapIcon} tone="primary" />
        <StatTile label="accuracy" value={`${stats.accuracy}%`} icon={Target02Icon} tone="success" />
        <StatTile label="total time" value={formatDuration(stats.totalTimeMs)} icon={Clock01Icon} tone="info" />
        <StatTile label="avg / word" value={formatDuration(stats.averageTimeMs)} icon={Timer02Icon} tone="info" />
        <StatTile label="fastest" value={stats.fastestMs === null ? "–" : formatDuration(stats.fastestMs)} icon={Rocket01Icon} tone="success" />
        <StatTile label="best streak" value={stats.bestStreak} icon={FireIcon} tone="primary" />
      </section>

      <Card className="mt-6">
        <h2 className="text-lg font-black text-ink">share your score</h2>
        <p className="mt-1 text-sm font-semibold text-muted">challenge your friends to beat it.</p>
        <ShareActions result={toSharedResult(stats)} className="mt-4" />
      </Card>

      <div className="mt-6 grid gap-6">
        {stats.byDifficulty.length > 0 && <DifficultyBreakdown rows={stats.byDifficulty} />}
        <AnswerReview answers={answers} />
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 grid grid-cols-[auto_1fr] gap-3 border-t-2 border-line bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:static sm:mx-0 sm:border-0 sm:px-0">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-5")} aria-label="home">
          <Icon icon={Home01Icon} />
          <span className="hidden sm:inline">home</span>
        </Link>
        <Button size="lg" onClick={onRestart}>
          <Icon icon={ReloadIcon} />
          play again
        </Button>
      </div>
    </div>
  );
}
