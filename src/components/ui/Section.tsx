import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
}

export function Section({
  as: Comp = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn("w-full py-8 md:py-12 lg:py-16", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
