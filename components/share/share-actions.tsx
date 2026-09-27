"use client";

import { useState } from "react";
import { Download04Icon, MessageEdit01Icon, NewTwitterIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useI18n } from "@/components/i18n/i18n-provider";
import { ShareMessageDialog } from "@/components/share/share-message-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { SharedResult } from "@/types/game";
import { resultImagePath, shareMessage, xIntentUrl } from "@/utils/share";

type Status = "idle" | "busy" | "done" | "error";

export function ShareActions({ result, className }: { result: SharedResult; className?: string }) {
  const { dict } = useI18n();
  const copy = dict.share;
  const [download, setDownload] = useState<Status>("idle");

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
      <ShareMessageDialog message={shareMessage(result, copy)}>
        <Button variant="outline">
          <Icon icon={MessageEdit01Icon} size={20} />
          {copy.copyMessage}
        </Button>
      </ShareMessageDialog>
      <a
        href={xIntentUrl(result, copy)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }), "text-ink")}
      >
        <Icon icon={NewTwitterIcon} size={20} />
        {copy.shareX}
      </a>
      <Button variant="info" onClick={handleDownload} disabled={download === "busy"} aria-live="polite">
        <Icon icon={download === "done" ? Tick02Icon : Download04Icon} size={20} />
        {download === "busy"
          ? copy.saving
          : download === "done"
            ? copy.saved
            : download === "error"
              ? copy.tryAgain
              : copy.download}
      </Button>
    </div>
  );
}
