import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, label, description, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "group rounded-xl border border-primary-foreground/10 bg-primary-foreground/[0.06] p-4 transition-all duration-200 hover:bg-primary-foreground/[0.1] hover:border-primary-foreground/20",
      className,
    )}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">{label}</p>
          <p className="text-xs opacity-60 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
