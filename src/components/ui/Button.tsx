import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "edit";
  loading?: boolean;
  full?: boolean;
  icon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  full = false,
  icon,
  className,
  ...props
}: Props) {
  const base =
    "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:scale-102 transition disabled:opacity-60";

  const variants = {
    primary: "bg-rose-500 text-white hover:bg-rose-600",
    secondary: "bg-stone-100 text-stone-700 hover:bg-stone-200",
    outline: "border border-stone-300 text-stone-700 hover:bg-stone-50",
    ghost: "text-stone-600 hover:bg-stone-100",
    edit: "bg-yellow-100 hover:border hover:border-yellow-600 px-2 py-1 text-yellow-900",
  };

  return (
    <button
      className={clsx(base, variants[variant], full && "w-full", className!)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-md animate-spin"></span>
      ) : (
        icon
      )}

      {children}
    </button>
  );
}
