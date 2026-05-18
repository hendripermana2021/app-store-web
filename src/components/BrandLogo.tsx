type BrandLogoProps = {
  compact?: boolean;
  variant?: "default" | "dark" | "mono";
  textMode?: "desktop" | "always" | "hidden";
};

export default function BrandLogo({
  compact = false,
  variant = "default",
  textMode = "desktop",
}: BrandLogoProps) {
  const gradientId = `logoGradient-${variant}`;

  const palette = {
    default: {
      start: "#22D3EE",
      end: "#10B981",
      grid: "#05222F",
      roof: "#E6FFFB",
    },
    dark: {
      start: "#1E293B",
      end: "#0F172A",
      grid: "#93C5FD",
      roof: "#E2E8F0",
    },
    mono: {
      start: "#BFC8D2",
      end: "#7D8A98",
      grid: "#17212B",
      roof: "#F8FAFC",
    },
  }[variant];

  const textClassName =
    textMode === "hidden"
      ? "hidden"
      : textMode === "always"
        ? "leading-tight"
        : "hidden leading-tight sm:block";

  return (
    <div className="inline-flex items-center gap-3">
      <svg
        width={compact ? 38 : 44}
        height={compact ? 38 : 44}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="WebGratis Store logo"
      >
        <defs>
          <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor={palette.start} />
            <stop offset="1" stopColor={palette.end} />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="18" fill={`url(#${gradientId})`} />
        <path
          d="M18 22H30V30H18V22ZM34 22H46V30H34V22ZM18 34H30V42H18V34ZM34 34H46V42H34V34Z"
          fill={palette.grid}
          fillOpacity="0.82"
        />
        <path d="M16 18L32 10L48 18" stroke={palette.roof} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {!compact && (
        <div className={textClassName}>
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-200">WEBDIRECTORY</p>
          <p className="text-lg font-bold text-white sm:text-xl">WebGratis Store</p>
        </div>
      )}
    </div>
  );
}
