import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement } from "react";
import { ImageResponse } from "next/og";
import type { IconSvgElement } from "@hugeicons/react";
import { Brain02Icon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config/site";
import { getRank } from "@/lib/game";
import type { SharedResult } from "@/types/game";
import { formatDuration } from "@/utils/format";

export const SCORE_IMAGE_SIZE = { width: 1200, height: 630 };

const C = {
  primary: "#FF8A1F",
  primaryDark: "#E0700A",
  primarySoft: "#FFF1E3",
  success: "#22B573",
  info: "#1CB0F6",
  ink: "#3C3C3C",
  muted: "#8A8A8A",
  line: "#E5E5E5",
};

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 700 | 900; style: "normal" }[]> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all(
    ([700, 900] as const).map(async (weight) => ({
      name: "Nunito",
      data: await readFile(join(process.cwd(), "assets/fonts", `nunito-${weight}.ttf`)),
      weight,
      style: "normal" as const,
    })),
  );
  return fontsPromise;
}

/** satori can't render forwardRef components like HugeiconsIcon, so draw the raw paths */
function StaticIcon({ icon, size, color }: { icon: IconSvgElement; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {icon.map(([tag, { key, ...attrs }]) =>
        createElement(tag, { ...attrs, key, stroke: color, strokeWidth: 2.2 }),
      )}
    </svg>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 24,
        border: `4px solid ${color}`,
        overflow: "hidden",
        width: 200,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", background: color, color: "white", fontSize: 22, padding: "6px 0" }}>
        {label}
      </div>
      <div style={{ display: "flex", justifyContent: "center", color, fontSize: 44, fontWeight: 900, padding: "10px 0" }}>
        {value}
      </div>
    </div>
  );
}

export async function renderScoreImage(result: SharedResult) {
  const accuracy = result.answered ? Math.round((result.correct / result.answered) * 100) : 0;
  const rank = getRank(accuracy);

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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <div
              style={{
                display: "flex",
                background: C.primarySoft,
                color: C.primaryDark,
                borderRadius: 999,
                padding: "10px 28px",
                fontSize: 28,
                fontWeight: 900,
              }}
            >
              {rank.title}
            </div>
          </div>

          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 34, color: C.muted }}>{`${result.name.toLowerCase()} found`}</div>
              <div style={{ display: "flex", alignItems: "baseline", fontSize: 168, fontWeight: 900, color: C.ink, lineHeight: 1 }}>
                <span style={{ color: C.success }}>{result.correct}</span>
                <span style={{ color: C.line, margin: "0 12px" }}>/</span>
                <span>{result.answered}</span>
              </div>
              <div style={{ fontSize: 34, color: C.muted }}>hidden word links</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <Stat label="xp" value={String(result.xp)} color={C.primary} />
                <Stat label="accuracy" value={`${accuracy}%`} color={C.success} />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <Stat label="time" value={formatDuration(result.timeMs)} color={C.info} />
                <Stat label="best streak" value={String(result.streak)} color={C.primary} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
            <div style={{ color: C.muted }}>think you can beat it?</div>
            <div style={{ color: C.primary, fontWeight: 900 }}>{`play at ${siteConfig.displayUrl}`}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...SCORE_IMAGE_SIZE,
      fonts: await loadFonts(),
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
