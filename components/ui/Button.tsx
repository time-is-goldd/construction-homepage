import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "cta" | "secondary" | "ghost";
type Size = "lg" | "md" | "sm";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg " +
  "transition-colors duration-[180ms] ease-out focus-visible:outline " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent-600 disabled:cursor-not-allowed " +
  "disabled:bg-neutral-200 disabled:text-neutral-400 disabled:hover:bg-neutral-200";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-900",
  cta: "bg-accent-500 text-white hover:bg-accent-600",
  secondary:
    "bg-white text-brand-700 border-[1.5px] border-brand-700 hover:bg-neutral-50",
  ghost: "bg-transparent text-brand-700 hover:underline",
};

const SIZE_CLASS: Record<Size, string> = {
  lg: "h-[52px] px-7 text-base md:text-lg font-semibold",
  md: "h-11 px-5 text-[15px] md:text-base font-semibold",
  sm: "h-9 px-3.5 text-[13px] md:text-sm font-medium",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = `${BASE_CLASS} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ""}`;

  if (props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
