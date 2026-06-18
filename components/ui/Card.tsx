import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "emphasized";
  hoverable?: boolean;
  children: ReactNode;
};

const TONE_CLASS: Record<NonNullable<CardProps["tone"]>, string> = {
  default: "border-neutral-200",
  emphasized: "border-brand-500",
};

export default function Card({
  tone = "default",
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  const hoverClass = hoverable
    ? "transition-shadow duration-200 ease-out hover:shadow-[0_6px_16px_rgba(15,28,48,0.12)]"
    : "";

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-[0_1px_3px_rgba(15,28,48,0.08)] md:p-6 ${TONE_CLASS[tone]} ${hoverClass} ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
