/* eslint-disable @next/next/no-img-element */
import fs from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";
import { BalloonCanvas } from "./BalloonCanvas";

/**
 * A rendered wordmark wins if there is one.
 *
 * Checked by presence rather than configuration: drop the file in
 * public/brand/ and it is used, delete it and the drawn balloon comes back.
 * This is a server component, so the check costs a stat at render time — in
 * dev that means the moment the file lands, and at build time in production.
 */
const CANDIDATES = ["brand/hero.png", "brand/hero.webp", "brand/hero.svg"];

function renderedWordmark(): string | null {
  for (const rel of CANDIDATES) {
    try {
      if (fs.existsSync(path.join(process.cwd(), "public", rel))) return `/${rel}`;
    } catch {
      // unreadable public dir — fall through to the drawn version
    }
  }
  return null;
}

/**
 * The hero wordmark. Drawn by default — the name is a string, so renaming the
 * site renames the balloon — and replaced by public/brand/hero.png the moment
 * that file exists. Anything that isn't the wordmark itself (the 404, for one)
 * always uses the drawn version.
 */
export function Balloon({ text = site.wordmark }: { text?: string }) {
  const rendered = text === site.wordmark ? renderedWordmark() : null;

  if (rendered) {
    return (
      <img
        src={rendered}
        alt={site.wordmark}
        className="w-full max-w-[720px] h-auto select-none [filter:drop-shadow(0_28px_40px_#18426040)]"
      />
    );
  }

  return <BalloonCanvas text={text} />;
}
