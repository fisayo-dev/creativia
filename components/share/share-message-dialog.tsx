"use client";

import { useState, type ReactNode } from "react";
import { Copy01Icon, MessageEdit01Icon, Tick02Icon, Undo02Icon } from "@hugeicons/core-free-icons";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Label, Textarea } from "@/components/ui/input";

type ShareMessageDialogProps = {
  /** the suggested message. edits start from here and "reset" returns to it */
  message: string;
  /** the button that opens the dialog */
  children: ReactNode;
};

type CopyStatus = "idle" | "done" | "error";

/** shows the share message so people can read it, tweak it, and copy it */
export function ShareMessageDialog({ message, children }: ShareMessageDialogProps) {
  const { dict } = useI18n();
  const copy = dict.share;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(message);
  const [status, setStatus] = useState<CopyStatus>("idle");

  function handleOpenChange(next: boolean) {
    // every time it opens, start from the suggested message again
    if (next) {
      setDraft(message);
      setStatus("idle");
    }
    setOpen(next);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("done");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent closeLabel={copy.close}>
        <DialogHeader>
          <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-info-soft text-info">
            <Icon icon={MessageEdit01Icon} size={26} />
          </span>
          <DialogTitle>{copy.dialogTitle}</DialogTitle>
          <DialogDescription>{copy.dialogBody}</DialogDescription>
        </DialogHeader>

        <Label htmlFor="share-message" className="sr-only">
          {copy.messageLabel}
        </Label>
        <Textarea
          id="share-message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
          className="mt-5 min-h-40 resize-y bg-white text-base leading-relaxed"
        />

        <DialogFooter className="sm:grid-cols-[auto_1fr]">
          <Button variant="outline" onClick={() => setDraft(message)} disabled={draft === message}>
            <Icon icon={Undo02Icon} size={20} />
            {copy.reset}
          </Button>
          <Button variant={status === "done" ? "success" : "info"} onClick={handleCopy} disabled={!draft.trim()} aria-live="polite">
            <Icon icon={status === "done" ? Tick02Icon : Copy01Icon} size={20} />
            {status === "done" ? copy.copied : status === "error" ? copy.copyFailed : copy.copy}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
