"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentProps<typeof Link> {
  active?: boolean;
}

export function NavLink({
  href,
  children,
  className,
  active,
  ...props
}: NavLinkProps) {
  return (
    <div className="group relative w-fit cursor-pointer">
      <Link
        href={href}
        className={cn(
          "flex rounded p-2 text-sm font-light transition-colors",
          "hover:bg-[var(--brand-coral-light)]",
          active && "font-semibold",
          className
        )}
        {...props}
      >
        {children}
      </Link>
      <span
        className={cn(
          "absolute left-0 bottom-0 h-px bg-black transition-all duration-300 ease-in-out",
          "group-hover:w-full",
          active ? "w-full" : "w-0"
        )}
        aria-hidden
      />
    </div>
  );
}
