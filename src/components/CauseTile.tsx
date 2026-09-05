import { causes, findCause } from "@/lib/causes";
import { CauseGlyph } from "./CauseGlyph";

/**
 * A glossy 3D cause tile — the objects that float around the hero, and the
 * marker next to every token in the tables.
 *
 * Built as one SVG rather than a rendered image so a new cause costs a line in
 * lib/causes.ts instead of a trip through a 3D renderer: a rounded square lit
 * from the top left, a hard gloss across the upper third, a bevelled rim, and
 * the emblem sunk into it.
 *
 * The gradients live once in <CauseDefs />, in the layout — a tile that minted
 * its own would repeat ten gradients per row of a table, and duplicate every
 * id while doing it.
 */
export function CauseTile({ slug, size = 128 }: { slug: string; size?: number }) {
  const cause = findCause(slug);
  if (!cause) return null;
  const id = `cause-${cause.slug}`;

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={cause.label}>
      {/* body */}
      <rect x="4" y="4" width="112" height="112" rx="36" fill={`url(#${id}-body)`} />
      {/* the pool of shadow the body sits in */}
      <rect x="4" y="4" width="112" height="112" rx="36" fill={`url(#${id}-floor)`} />
      {/* bevelled rim */}
      <rect
        x="5.5"
        y="5.5"
        width="109"
        height="109"
        rx="34.5"
        fill="none"
        stroke="url(#cause-rim)"
        strokeWidth="3"
      />

      <g transform="translate(60 60) scale(0.6) translate(-50 -50)">
        {/* the emblem, dropped a hair and darkened, reads as an engraved edge */}
        <g transform="translate(0 2.5)" opacity="0.3">
          <CauseGlyph glyph={cause.glyph} color={shade(cause.color, -0.45)} />
        </g>
        <CauseGlyph glyph={cause.glyph} color="#ffffff" />
      </g>

      {/* gloss, last so it sits over the emblem like real plastic */}
      <path
        d="M20 8h80a20 20 0 0 1 16 32c-18 10-40 15-56 15S32 50 14 40A20 20 0 0 1 20 8Z"
        fill="url(#cause-gloss)"
      />
    </svg>
  );
}

/** the same object at chip size, for tables and lists */
export function CauseChip({ slug, size = 34 }: { slug: string; size?: number }) {
  return (
    <span className="inline-grid place-items-center shrink-0" style={{ width: size, height: size }}>
      <CauseTile slug={slug} size={size} />
    </span>
  );
}

/**
 * Every gradient the tiles use, emitted once per document. Rendered from the
 * root layout, next to <PuffFilter />.
 */
export function CauseDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="cause-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cause-rim" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.5" />
        </linearGradient>

        {causes.map((c) => {
          const dark = shade(c.color, -0.42);
          const light = shade(c.color, 0.32);
          return (
            <g key={c.slug}>
              <linearGradient id={`cause-${c.slug}-body`} x1="0" y1="0" x2="0.35" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="46%" stopColor={c.color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <radialGradient id={`cause-${c.slug}-floor`} cx="0.5" cy="1" r="0.75">
                <stop offset="0%" stopColor={dark} stopOpacity="0.55" />
                <stop offset="100%" stopColor={dark} stopOpacity="0" />
              </radialGradient>
            </g>
          );
        })}
      </defs>
    </svg>
  );
}

/** lighten (amount > 0) or darken (amount < 0) a hex colour */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const to = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  const mix = (c: number) => Math.round(c + (to - c) * t);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
