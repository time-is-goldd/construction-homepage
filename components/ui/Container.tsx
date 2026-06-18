import type { ElementType, HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

export default function Container({
  as: Tag = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[1280px] px-4 md:px-6 ${className ?? ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
