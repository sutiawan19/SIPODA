import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "neutral";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors",
        {
          "bg-white border-neutral-200 text-neutral-800": variant === "default",
          "bg-neutral-100 border-neutral-300 text-neutral-900": variant === "neutral",
          "bg-neutral-900 border-neutral-950 text-white": variant === "success", // Using dark tone for success in monochrome
          "bg-neutral-200 border-neutral-300 text-neutral-800": variant === "warning",
          "bg-white border-neutral-300 text-neutral-500": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}
