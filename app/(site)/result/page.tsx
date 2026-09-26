import type { Metadata } from "next";
import Link from "next/link";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { SCORE_IMAGE_SIZE } from "@/lib/score-image";
import { parseSharedResult, resultImagePath } from "@/utils/share";

type ResultPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: ResultPageProps): Promise<Metadata> {
  const result = parseSharedResult(await searchParams);
  const title = `${result.name} scored ${result.correct}/${result.answered}`;
  const image = { url: resultImagePath(result), ...SCORE_IMAGE_SIZE, alt: title };
  return {
    title,
    description: `${result.name} found ${result.correct} hidden word links on ${siteConfig.name}. can you beat it?`,
    openGraph: { title, images: [image] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const result = parseSharedResult(await searchParams);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-16">
      <h1 className="text-3xl font-black text-ink sm:text-4xl">
        {result.name} scored <span className="text-primary">{result.correct}/{result.answered}</span>
      </h1>
      <p className="mt-3 text-lg font-semibold text-muted">think you&apos;re more creative? prove it.</p>

      {/* dynamic png from our own route; next/image can't whitelist arbitrary query strings */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resultImagePath(result)}
        alt={`${result.name}'s creativia score card`}
        {...SCORE_IMAGE_SIZE}
        className="mt-8 h-auto w-full rounded-3xl border-2 border-b-4 border-line"
      />

      <Link href="/play" className={cn(buttonVariants({ size: "lg" }), "mt-10 w-full max-w-xs")}>
        <Icon icon={PlayIcon} />
        take the challenge
      </Link>
    </div>
  );
}
