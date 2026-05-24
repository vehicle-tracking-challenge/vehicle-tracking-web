export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-primary font-bold text-lg tracking-tight">
            RastroPop
          </span>
          <span className="text-muted-foreground text-sm">/ Veículos</span>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
