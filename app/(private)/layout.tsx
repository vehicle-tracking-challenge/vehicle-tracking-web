"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/shared/theme-toggle";

const tabs = [
  { label: "Veículos", href: "/veiculos" },
  { label: "Mapa", href: "/veiculos/mapa" },
];

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border bg-background shrink-0">
        <div className="flex items-center px-6 h-12">
          <span className="text-primary font-bold text-lg tracking-tight">
            RastroPop
          </span>
          <nav className="flex ml-8 h-full">
            {tabs.map((tab) => {
              const isActive =
                tab.href === "/veiculos"
                  ? pathname === "/veiculos"
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center h-full px-4 text-sm font-semibold border-b-2 transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
