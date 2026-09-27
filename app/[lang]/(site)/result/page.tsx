import type { Metadata } from "next";
import Link from "next/link";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { rich, t } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { SCORE_IMAGE_SIZE } from "@/lib/score-image";
import { parseSharedResult, resultImagePath } from "@/utils/share";

type ResultPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: ResultPageProps): Promise<Metadata> {
  const [result, dict] = await Promise.all([searchParams.then(parseSharedResult), getDictionary()]);
  const copy = dict.resultPage;
  const title = t(copy.title, { name: result.name, score: `${result.correct}/${result.answered}` });
  const image = { url: resultImagePath(result), ...SCORE_IMAGE_SIZE, alt: title };
  return {
    title,
    description: t(copy.description, { name: result.name, correct: result.correct, site: siteConfig.name }),
    openGraph: { title, images: [image] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const [result, dict] = await Promise.all([searchParams.then(parseSharedResult), getDictionary()]);
  const copy = dict.resultPage;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-16">
      <h1 className="text-3xl font-black text-ink sm:text-4xl">
        {rich(copy.title, {
          name: result.name,
          score: (
            <span className="text-primary">
              {result.correct}/{result.answered}
            </span>
          ),
        })}
      </h1>
      <p className="mt-3 text-lg font-semibold text-muted">{copy.prove}</p>

      {/* dynamic png from our own route; next/image can't whitelist arbitrary query strings */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resultImagePath(result)}
        alt={t(copy.imageAlt, { name: result.name })}
        {...SCORE_IMAGE_SIZE}
        className="mt-8 h-auto w-full rounded-3xl border-2 border-b-4 border-line"
      />

      <Link href="/play" className={cn(buttonVariants({ size: "lg" }), "mt-10 w-full max-w-xs")}>
        <Icon icon={PlayIcon} />
        {copy.cta}
      </Link>
    </div>
  );
}
