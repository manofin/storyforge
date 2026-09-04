import { cn } from "@/lib/utils";

export default function AvatarBadge({
  emoji,
  color,
  size = "md",
  className,
}: {
  emoji: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-2xl",
    xl: "h-20 w-20 text-3xl",
  };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-white shadow-soft",
        sizes[size],
        className
      )}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      <span aria-hidden>{emoji}</span>
    </div>
  );
}
