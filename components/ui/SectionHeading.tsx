import type { HTMLAttributes, ReactNode } from "react";

type SectionHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

export default function SectionHeading({
  className,
  children,
  ...props
}: SectionHeadingProps) {
  return (
    <h2
      className={`text-2xl leading-[1.35] font-bold tracking-[-0.01em] text-neutral-900 md:text-[32px] ${className ?? ""}`}
      {...props}
    >
      {children}
    </h2>
  );
}
