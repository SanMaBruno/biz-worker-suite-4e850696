import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  hero: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ hero, children, className }: AuthLayoutProps) {
  return (
    <div className={cn("flex min-h-screen w-full", className)}>
      {/* Left hero — hidden on mobile, shown as top banner on tablets */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[52%] relative overflow-hidden">
        {hero}
      </div>

      {/* Right form area */}
      <div className="flex w-full lg:w-[45%] xl:w-[48%] flex-col">
        {/* Mobile/tablet hero */}
        <div className="lg:hidden relative h-48 sm:h-56 overflow-hidden">
          {hero}
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 md:px-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
