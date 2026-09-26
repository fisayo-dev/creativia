import type { Metadata } from "next";
import { GameShell } from "@/components/game/game-shell";

export const metadata: Metadata = {
  title: "play",
  description: "three words, one hidden link. how many can you find?",
};

export default function PlayPage() {
  return <GameShell />;
}
