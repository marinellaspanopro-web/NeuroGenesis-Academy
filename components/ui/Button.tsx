import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "gold" | "gold-outline" | "forest-outline" | "ghost-dark";
  size?: "md" | "lg";
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  download?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-sans font-medium " +
  "transition-all duration-300 ease-out-expo focus-visible:outline-offset-4 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // Pilule or pleine — CTA primaire sur fond sombre
  gold: "bg-gold text-forest hover:bg-gold-deep hover:-translate-y-0.5 shadow-[0_8px_24px_-8px_oklch(88.5%_0.066_93_/_0.5)]",
  // Contour or — CTA secondaire sur fond sombre
  "gold-outline": "border border-gold/70 text-gold hover:bg-gold/10 hover:border-gold",
  // Contour vert forêt — sur fond clair
  "forest-outline": "border border-forest/30 text-forest hover:bg-forest hover:text-cream",
  // Discret — liens de navigation ou CTA tertiaires
  "ghost-dark": "text-forest hover:text-gold-deep underline underline-offset-4 decoration-1",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "px-6 py-3 text-sm tracking-wide2",
  lg: "px-8 py-4 text-base tracking-wide2",
};

export default function Button({
  children,
  variant = "gold",
  size = "md",
  className = "",
  href,
  onClick,
  type = "button",
  download,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        className={classes}
        download={download}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
