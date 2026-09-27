import type { Metadata } from "next";
import { GameShell } from "@/components/game/game-shell";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.meta.playTitle, description: dict.meta.playDescription };
}

export default function PlayPage() {
  return <GameShell />;
}
