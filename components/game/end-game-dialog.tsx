"use client";

import { useEffect, useRef } from "react";
import { Flag02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type EndGameDialogProps = {
  open: boolean;
  answered: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function EndGameDialog({ open, answered, onCancel, onConfirm }: EndGameDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => e.target === ref.current && onCancel()}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border-2 border-b-4 border-line bg-white p-6 text-ink backdrop:bg-black/40 open:animate-pop"
      aria-labelledby="end-title"
    >
      <div className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon icon={Flag02Icon} size={32} />
        </span>
        <h2 id="end-title" className="mt-4 text-2xl font-black">
          end the game?
        </h2>
        <p className="mt-2 font-semibold text-muted">
          {answered > 0
            ? `you'll see your stats for the ${answered} word${answered === 1 ? "" : "s"} you've played.`
            : "you haven't answered any words yet, so you'll head back to the start."}
        </p>
        <div className="mt-6 grid w-full gap-3">
          <Button size="lg" block onClick={onCancel} autoFocus>
            keep playing
          </Button>
          <Button variant="ghost" block onClick={onConfirm} className="text-error hover:text-error-dark">
            {answered > 0 ? "end & see stats" : "quit"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
