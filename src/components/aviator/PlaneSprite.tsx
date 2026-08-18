/**
 * Aviator plane artwork drawn fully inline as SVG (no external image request),
 * so it renders instantly on any host. Includes a live spinning propeller.
 */
export function PlaneSprite({
  className = "",
  spinning = true,
}: {
  className?: string;
  spinning?: boolean;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "1024 / 640" }}>
      <svg
        viewBox="0 0 1024 640"
        role="img"
        aria-label="Aviator plane in flight"
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.55))" }}
      >
        <defs>
          <linearGradient id="bp-plane-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff5d5d" />
            <stop offset="45%" stopColor="#e0212a" />
            <stop offset="100%" stopColor="#8d0f16" />
          </linearGradient>
          <linearGradient id="bp-plane-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c8161f" />
            <stop offset="100%" stopColor="#7c0d13" />
          </linearGradient>
          <linearGradient id="bp-plane-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dff3ff" />
            <stop offset="100%" stopColor="#6ea8c9" />
          </linearGradient>
        </defs>

        {/* tail fin */}
        <path d="M132 300 L74 176 L152 196 L206 300 Z" fill="url(#bp-plane-wing)" />
        {/* tail plane */}
        <path d="M126 330 L60 380 L150 372 L214 336 Z" fill="#a3141c" />

        {/* far wing (behind fuselage) */}
        <path d="M470 300 L318 168 L400 168 L586 300 Z" fill="#9c1219" />

        {/* fuselage */}
        <path
          d="M120 330
             C 240 288, 430 262, 640 258
             C 760 256, 856 276, 912 306
             C 940 320, 940 340, 912 352
             C 852 380, 742 396, 620 398
             C 420 400, 232 372, 120 344 Z"
          fill="url(#bp-plane-body)"
        />
        {/* white belly stripe */}
        <path
          d="M150 352 C 320 386, 520 398, 690 388 C 780 382, 856 366, 900 348 L 902 356 C 852 380, 742 396, 620 398 C 420 400, 232 372, 140 348 Z"
          fill="#f6f7fb"
          opacity="0.85"
        />

        {/* cockpit windows */}
        <path d="M690 286 L784 288 L806 312 L690 310 Z" fill="url(#bp-plane-glass)" />
        <path d="M596 288 L664 286 L664 310 L592 310 Z" fill="url(#bp-plane-glass)" />

        {/* near wing */}
        <path d="M452 336 L300 470 L404 470 L610 344 Z" fill="url(#bp-plane-wing)" />

        {/* nose cone */}
        <path
          d="M900 300 C 934 308, 950 324, 950 330 C 950 338, 932 352, 898 358 Z"
          fill="#2b2f38"
        />
      </svg>

      {/* propeller disc */}
      <span
        className="absolute"
        style={{
          left: "93.5%",
          top: "51%",
          width: "2.6%",
          height: "42%",
          transform: "translate(-50%, -50%)",
          animation: spinning ? "propeller-spin 0.09s linear infinite" : "none",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(40,40,40,0.85), rgba(255,255,255,0.05))",
          borderRadius: "999px",
        }}
      />
    </div>
  );
}
