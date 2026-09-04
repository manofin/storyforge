"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Side = "left" | "right";

type Props = {
  open: boolean;
  onClose: () => void;
  side: Side;
  children: ReactNode;
  /** ~2/3 viewport, capped */
  className?: string;
  labelledBy?: string;
};

export default function MobileDrawer({
  open,
  onClose,
  side,
  children,
  className,
  labelledBy,
}: Props) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          "absolute inset-y-0 flex w-[min(320px,75vw)] max-w-full flex-col bg-white shadow-card transition-transform duration-200 ease-out",
          side === "left" ? "left-0" : "right-0",
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
