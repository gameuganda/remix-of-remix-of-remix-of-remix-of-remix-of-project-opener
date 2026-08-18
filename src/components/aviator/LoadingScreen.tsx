import { useEffect, useState } from "react";

import splash from "@/assets/aviator/splash.jpg.asset.json";

/** Preload as early as the module is evaluated so the splash never flashes empty. */
if (typeof window !== "undefined") {
  const img = new Image();
  img.src = splash.url;
}

export function LoadingScreen({ label = "Loading live table…" }: { label?: string }) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((value) => (value >= 96 ? 96 : value + Math.max(1, (100 - value) * 0.12)));
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background">
      <img
        src={splash.url}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="sync"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 blur-sm"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 px-6">
        <img
          src={splash.url}
          alt="Aviator crash game"
          fetchPriority="high"
          decoding="sync"
          className="w-full rounded-2xl border border-border object-cover shadow-2xl"
        />

        <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
          {label}
        </p>

        <div className="w-full">
          <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 14px color-mix(in oklab, var(--primary) 70%, transparent)",
              }}
            />
          </div>
          <div className="mt-2 flex justify-between font-display text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Preparing round</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
