"use client";

import { useState } from "react";
import { Copy01Icon, Download04Icon, NewTwitterIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { SharedResult } from "@/types/game";
import { resultImagePath, resultPageUrl, shareText, xIntentUrl } from "@/utils/share";

type Status = "idle" | "busy" | "done" | "error";

export function ShareActions({ result, className }: { result: SharedResult; className?: string }) {
  const [copy, setCopy] = useState<Status>("idle");
  const [download, setDownload] = useState<Status>("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${shareText(result)}\n${resultPageUrl(result)}`);
      setCopy("done");
    } catch {
      setCopy("error");
    }
    setTimeout(() => setCopy("idle"), 2000);
  }

  async function handleDownload() {
    setDownload("busy");
    try {
      const res = await fetch(resultImagePath(result));
      if (!res.ok) throw new Error(`image request failed (${res.status})`);
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `creativia-${result.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "score"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownload("done");
    } catch {
      setDownload("error");
    }
    setTimeout(() => setDownload("idle"), 2000);
  }

  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      <Button variant="outline" onClick={handleCopy} aria-live="polite">
        <Icon icon={copy === "done" ? Tick02Icon : Copy01Icon} size={20} className={copy === "done" ? "text-success" : undefined} />
        {copy === "done" ? "copied!" : copy === "error" ? "copy failed" : "copy result"}
      </Button>
      <a
        href={xIntentUrl(result)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }), "text-ink")}
      >
        <Icon icon={NewTwitterIcon} size={20} />
        share on x
      </a>
      <Button variant="info" onClick={handleDownload} disabled={download === "busy"} aria-live="polite">
        <Icon icon={download === "done" ? Tick02Icon : Download04Icon} size={20} />
        {download === "busy" ? "saving…" : download === "done" ? "saved!" : download === "error" ? "try again" : "download image"}
      </Button>
    </div>
  );
}
