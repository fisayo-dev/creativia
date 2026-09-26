import { cn } from "@/lib/utils";

type WordTilesProps = {
  words: string[];
  /** changing this key replays the pop-in animation */
  animationKey?: string | number;
  size?: "md" | "lg";
  className?: string;
};

export function WordTiles({ words, animationKey, size = "lg", className }: WordTilesProps) {
  return (
    <ul key={animationKey} className={cn("grid grid-cols-3 gap-2 sm:gap-4", className)} aria-label="clue words">
      {words.map((word, i) => (
        <li
          key={word}
          className={cn(
            "animate-pop flex items-center justify-center rounded-2xl border-2 border-b-4 border-line bg-white px-1 text-center font-black text-ink",
            size === "lg" ? "min-h-20 text-lg sm:min-h-28 sm:text-3xl" : "min-h-14 text-base sm:text-xl",
          )}
          style={{ animationDelay: `${i * 70}ms`, animationFillMode: "both" }}
        >
          <span className="break-words">{word}</span>
        </li>
      ))}
    </ul>
  );
}
