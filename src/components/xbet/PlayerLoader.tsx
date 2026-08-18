/**
 * BET PLUS+ branded player loader.
 * Soft, milky macOS-style glass panel with a shimmering wordmark and a
 * breathing play badge — shown while a stream is buffering.
 */
export function PlayerLoader({ label = "Loading stream" }: { label?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      {/* milky drifting light */}
      <div
        className="absolute -inset-1/4 opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(38% 42% at 30% 35%, color-mix(in oklab, var(--xb-blue-light) 55%, transparent), transparent 70%), radial-gradient(34% 40% at 70% 65%, color-mix(in oklab, white 26%, transparent), transparent 72%)",
          animation: "bp-milky-drift 6s ease-in-out infinite",
        }}
      />

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-4">
        {/* play badge */}
        <span className="relative flex h-12 w-12 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full bg-white/25 blur-md"
            style={{ animation: "bp-breathe 2.2s ease-in-out infinite" }}
          />
          <span className="bp-glass-btn absolute inset-0" />
          <svg viewBox="0 0 24 24" className="relative h-4 w-4 fill-white/90" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>

        {/* wordmark */}
        <span className="flex items-baseline gap-1 text-lg font-extrabold tracking-[0.14em]">
          <span className="bp-wordmark-shimmer">BET PLUS</span>
          <span className="text-xb-blue-light">+</span>
        </span>

        {/* progress shimmer */}
        <span className="relative h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
          <span
            className="absolute inset-y-0 w-1/3 rounded-full bg-white/70"
            style={{ animation: "bp-shimmer 1.6s ease-in-out infinite" }}
          />
        </span>

        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/55">
          {label}
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-white/70"
                style={{ animation: `bp-dot 1.1s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}
