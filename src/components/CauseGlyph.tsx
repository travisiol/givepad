/**
 * The emblems that sit inside the cause tiles.
 *
 * Drawn rather than sourced: a cause is not a company, so there is no logo to
 * borrow, and a hand-cut path in a 100×100 box keeps the whole set on one
 * weight and one optical size. Everything is filled or stroked in a single
 * colour so <CauseTile /> can render each one twice — sunk and lit — to get
 * the engraved edge.
 */
export function CauseGlyph({ glyph, color = "#fff" }: { glyph: string; color?: string }) {
  const s = {
    fill: "none",
    stroke: color,
    strokeWidth: 12,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (glyph) {
    case "drop":
      return (
        <path
          d="M50 8C50 8 19 43 19 63a31 31 0 0 0 62 0C81 43 50 8 50 8Z"
          fill={color}
        />
      );

    case "ribbon":
      return (
        <g {...s} strokeWidth={14}>
          <path d="M60 94C46 74 31 56 40 39c6-12 22-11 25 3" />
          <path d="M40 94c14-20 29-38 20-55-6-12-22-11-25 3" />
        </g>
      );

    case "bowl":
      return (
        <g>
          <path d="M12 48h76a38 38 0 0 1-76 0Z" fill={color} />
          <path d="M6 44h88" {...s} strokeWidth={11} />
          <path d="M38 30c-6-6-6-12 0-18M56 30c-6-6-6-12 0-18" {...s} strokeWidth={9} />
        </g>
      );

    case "shelter":
      return (
        <path
          d="M50 12 92 88H8Zm0 34L69 80H31Z"
          fill={color}
          fillRule="evenodd"
        />
      );

    case "paw":
      return (
        <g fill={color}>
          <ellipse cx="27" cy="40" rx="12" ry="15" />
          <ellipse cx="50" cy="30" rx="12" ry="16" />
          <ellipse cx="73" cy="40" rx="12" ry="15" />
          <path d="M50 52c14 0 26 11 26 22 0 9-8 14-17 12l-9-2-9 2c-9 2-17-3-17-12 0-11 12-22 26-22Z" />
        </g>
      );

    case "tree":
      return (
        <g fill={color}>
          <path d="M50 8 78 52H22Z" />
          <path d="M50 34 82 82H18Z" />
          <rect x="43" y="76" width="14" height="18" rx="4" />
        </g>
      );

    case "book":
      return (
        <g>
          <path
            d="M50 30c-9-8-24-10-38-7v51c14-3 29-1 38 7 9-8 24-10 38-7V23c-14-3-29-1-38 7Z"
            fill={color}
          />
          <path d="M50 30v51" {...s} strokeWidth={7} stroke="#00000038" />
        </g>
      );

    case "house":
      return (
        <g fill={color}>
          <path d="M50 10 94 48l-8 9-36-31-36 31-8-9Z" />
          <path d="M24 52h52v38H60V68H40v22H24Z" />
        </g>
      );

    case "mind":
      return (
        <g>
          <path
            d="M50 88C30 74 18 63 18 49a17 17 0 0 1 32-8 17 17 0 0 1 32 8c0 14-12 25-32 39Z"
            fill={color}
          />
          <path d="M22 60h14l7-11 9 20 7-9h19" {...s} strokeWidth={8} stroke="#00000042" />
        </g>
      );

    case "brackets":
      return (
        <g {...s}>
          <path d="M34 26 12 50l22 24" />
          <path d="M66 26l22 24-22 24" />
          <path d="M58 20 42 80" strokeWidth={10} />
        </g>
      );

    default:
      return <circle cx="50" cy="50" r="30" fill={color} />;
  }
}
