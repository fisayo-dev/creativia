import { ImageResponse } from "next/og";
import { ArrowRight02Icon, Brain02Icon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config/site";
import { C, SCORE_IMAGE_SIZE, StaticIcon, loadFonts } from "@/lib/score-image";

export const alt = `${siteConfig.name} · ${siteConfig.tagline}`;
export const size = SCORE_IMAGE_SIZE;
export const contentType = "image/png";

const CLUES = ["cottage", "swiss", "cake"];
const ANSWER = "cheese";

function Tile({ word, color, filled }: { word: string; color: string; filled?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 30px",
        borderRadius: 24,
        border: `4px solid ${color}`,
        boxShadow: `0 6px 0 ${filled ? C.successDark : color}`,
        background: filled ? color : "white",
        color: filled ? "white" : C.ink,
        fontSize: 42,
        fontWeight: 900,
      }}
    >
      {word}
    </div>
  );
}

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.primary,
          padding: 36,
          fontFamily: "Nunito",
          fontWeight: 700,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: 48,
            borderBottom: `12px solid ${C.primaryDark}`,
            padding: "44px 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 20,
                background: C.primary,
              }}
            >
              <StaticIcon icon={Brain02Icon} size={40} color="white" />
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: C.primary }}>{siteConfig.name}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 900, color: C.ink, lineHeight: 1.05 }}>
              find the word that
            </div>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 900, color: C.primary, lineHeight: 1.05 }}>
              links them all.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {CLUES.map((word) => (
              <Tile key={word} word={word} color={C.line} />
            ))}
            <StaticIcon icon={ArrowRight02Icon} size={52} color={C.muted} />
            <Tile word={ANSWER} color={C.success} filled />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, marginTop: 32 }}>
            <div style={{ color: C.muted }}>a playful test of creative thinking</div>
            <div style={{ color: C.primary, fontWeight: 900 }}>{`play at ${siteConfig.displayUrl}`}</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
