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
import { useI18n } from "@/components/i18n/i18n-provider";
import { ShareActions } from "@/components/share/share-actions";
import { AnswerReview } from "@/components/stats/answer-review";
import { DifficultyBreakdown } from "@/components/stats/difficulty-breakdown";
import { StatTile } from "@/components/stats/stat-tile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { rich, t } from "@/i18n/format";
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
  const { dict } = useI18n();
  const copy = dict.results;
  const rank = dict.ranks[getRank(stats.accuracy)];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-6 sm:pt-10">
      <section className="animate-rise flex flex-col items-center text-center">
        <span className="animate-float grid size-24 place-items-center rounded-full bg-primary text-white shadow-[0_6px_0_var(--color-primary-dark)]">
          <Icon icon={ChampionIcon} size={52} />
        </span>
        {isNewBest && (
          <span className="animate-pop mt-5 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-4 py-1.5 text-sm font-black text-success-dark">
            <Icon icon={SparklesIcon} size={16} />
            {copy.newBest}
          </span>
        )}
        <p className="mt-4 text-sm font-extrabold tracking-wide text-muted">
          {stats.endedEarly ? copy.ended : copy.complete}
        </p>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">{rank.title}</h1>
        <p className="mt-3 text-lg font-bold text-ink">
          {rich(copy.found, {
            name: stats.player,
            correct: <span className="text-success">{stats.correct}</span>,
            answered: stats.answered,
          })}
        </p>
        <p className="mt-1 font-semibold text-muted">{rank.blurb}</p>
        {stats.endedEarly && (
          <p className="mt-2 text-sm font-bold text-muted">
            {t(copy.playedOf, { answered: stats.answered, total: stats.total })}
          </p>
        )}
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label={copy.totalXp} value={stats.xp} icon={ZapIcon} tone="primary" />
        <StatTile label={copy.accuracy} value={`${stats.accuracy}%`} icon={Target02Icon} tone="success" />
        <StatTile label={copy.totalTime} value={formatDuration(stats.totalTimeMs)} icon={Clock01Icon} tone="info" />
        <StatTile label={copy.avgPerWord} value={formatDuration(stats.averageTimeMs)} icon={Timer02Icon} tone="info" />
        <StatTile label={copy.fastest} value={stats.fastestMs === null ? "–" : formatDuration(stats.fastestMs)} icon={Rocket01Icon} tone="success" />
        <StatTile label={copy.bestStreak} value={stats.bestStreak} icon={FireIcon} tone="primary" />
      </section>

      <Card className="mt-6">
        <h2 className="text-lg font-black text-ink">{copy.shareTitle}</h2>
        <p className="mt-1 text-sm font-semibold text-muted">{copy.shareBody}</p>
        <ShareActions result={toSharedResult(stats)} className="mt-4" />
      </Card>

      <div className="mt-6 grid gap-6">
        {stats.byDifficulty.length > 0 && <DifficultyBreakdown rows={stats.byDifficulty} />}
        <AnswerReview answers={answers} />
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 grid grid-cols-[auto_1fr] gap-3 border-t-2 border-line bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:static sm:mx-0 sm:border-0 sm:px-0">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-5")} aria-label={copy.home}>
          <Icon icon={Home01Icon} />
          <span className="hidden sm:inline">{copy.home}</span>
        </Link>
        <Button size="lg" onClick={onRestart}>
          <Icon icon={ReloadIcon} />
          {copy.playAgain}
        </Button>
      </div>
    </div>
  );
}
