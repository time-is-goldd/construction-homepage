import type { HTMLAttributes, ReactNode } from "react";
import Container from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: "white" | "muted";
  container?: boolean;
  children: ReactNode;
};

const TONE_CLASS: Record<NonNullable<SectionProps["tone"]>, string> = {
  white: "bg-white",
  muted: "bg-neutral-50",
};

export default function Section({
  tone = "white",
  container = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={`py-12 md:py-20 ${TONE_CLASS[tone]} ${className ?? ""}`}
      {...props}
    >
      {container ? <Container>{children}</Container> : children}
    </section>
  );
}
