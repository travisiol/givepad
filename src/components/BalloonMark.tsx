/* eslint-disable @next/next/no-img-element */
import { brandArt, site } from "@/lib/site";

/**
 * The single-letter logo, in the nav, the footer and the welcome card.
 *
 * Kept apart from `<Balloon />` because this one is rendered inside client
 * components, so it can't do the filesystem check the hero does — point
 * `brandArt.mark` at a square PNG to swap it. `size` is the rendered box in
 * px; the glyph is sized to fill it.
 */
export function BalloonMark({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid place-items-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {brandArt.mark ? (
        <img
          src={brandArt.mark}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-contain [filter:drop-shadow(0_6px_10px_#18426040)]"
        />
      ) : (
        <span className="balloon balloon-mark" style={{ fontSize: size * 1.24 }}>
          {site.mark}
        </span>
      )}
    </span>
  );
}
