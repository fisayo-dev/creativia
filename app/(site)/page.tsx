import Link from "next/link";
import {
  ChampionIcon,
  FavouriteIcon,
  Idea01Icon,
  PlayIcon,
  Timer02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { ExamplePuzzle } from "@/components/home/example-puzzle";
import { LogoMark } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { DIFFICULTY_META, DIFFICULTY_ORDER } from "@/config/game";
import { WORDS } from "@/lib/words";
import { cn } from "@/lib/utils";

const steps = [
  { icon: ViewIcon, title: "see three words", body: "each round shows three words that seem unrelated.", color: "bg-info" },
  { icon: Idea01Icon, title: "find the link", body: "type the one word that connects all three.", color: "bg-primary" },
  { icon: ChampionIcon, title: "climb the levels", body: "words go from very easy to very hard. earn xp and streaks.", color: "bg-success" },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-2 md:pt-20">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <LogoMark className="animate-float mb-6 size-20 rounded-3xl shadow-[0_6px_0_var(--color-primary-dark)]" size={44} />
          <h1 className="text-4xl font-black leading-tight text-ink sm:text-5xl">
            how creative
            <br />
            is your <span className="text-primary">brain?</span>
          </h1>
          <p className="mt-4 max-w-md text-lg font-semibold text-muted">
            the remote associates test, turned into a game. find the hidden word that links three others.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/play" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              <Icon icon={PlayIcon} size={22} />
              play now
            </Link>
            <Link href="/donate" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
              <Icon icon={FavouriteIcon} size={22} className="text-error" />
              support
            </Link>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-muted">
            <Icon icon={Timer02Icon} size={18} />
            {WORDS.length} puzzles · no sign up · free
          </p>
        </div>
        <ExamplePuzzle />
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-black text-ink">how it works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.title} className="flex flex-row items-start gap-4 sm:flex-col">
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-white", step.color)}>
                  <Icon icon={step.icon} size={26} />
                </span>
                <div>
                  <h3 className="text-lg font-black text-ink">{step.title}</h3>
                  <p className="mt-1 font-semibold text-muted">{step.body}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {DIFFICULTY_ORDER.map((d) => (
              <span
                key={d}
                className="rounded-full px-4 py-1.5 text-sm font-extrabold"
                style={{ background: DIFFICULTY_META[d].soft, color: DIFFICULTY_META[d].color }}
              >
                {DIFFICULTY_META[d].label} · {WORDS.filter((w) => w.difficulty === d).length}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-black text-ink">ready to test your creativity?</h2>
        <p className="mt-3 font-semibold text-muted">a quick round takes about three minutes.</p>
        <Link href="/play" className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full max-w-xs")}>
          start playing
        </Link>
      </section>
    </>
  );
}
