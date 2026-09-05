"use client";

import { useEffect, useRef } from "react";
import { drawBalloonWord } from "@/lib/balloon";
import { site } from "@/lib/site";

/** bump when the renderer's output changes, or browsers keep serving the old look */
const CACHE_KEY = `givepad:balloon:1:${site.wordmark}`;

/**
 * The wordmark, inflated for real — see lib/balloon.ts for the how.
 *
 * The shading is a few hundred milliseconds of arithmetic for an image that
 * never changes, so the result is kept as a data URL in localStorage: the
 * first visit renders it a letter at a time (yielding between each, with the
 * CSS balloon showing meanwhile), every visit after that decodes it and is
 * done. Falling back to the drawn balloon costs nothing if storage is blocked.
 */
export function BalloonCanvas({ text = site.wordmark }: { text?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const fallbackRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    let cancelled = false;
    const cacheable = text === site.wordmark;

    // `load` rather than `decode()`: decode rejects often enough on a data URL
    // assigned before first paint, and a rejection there left the fallback up
    const reveal = (src: string) =>
      new Promise<void>((resolve) => {
        const show = () => {
          if (!cancelled) {
            img.style.opacity = "1";
            if (fallbackRef.current) fallbackRef.current.style.display = "none";
          }
          resolve();
        };
        img.onload = show;
        img.onerror = () => resolve();
        img.src = src;
        if (img.complete && img.naturalWidth > 0) show();
      });

    (async () => {
      if (cacheable) {
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            await reveal(cached);
            return;
          }
        } catch {
          // private mode or storage disabled — just render it
        }
      }

      const declared = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-balloon")
        .trim();
      const family = [declared, '"Baloo 2"', '"Arial Rounded MT Bold"', "sans-serif"]
        .filter(Boolean)
        .join(", ");

      try {
        // measuring before the webfont lands would inflate the fallback face.
        // only this face — `fonts.ready` would also wait on every Montserrat
        // subset, which has nothing to do with the wordmark
        await document.fonts.load(`800 320px ${family}`);
      } catch {
        // no font loading api, or the load failed — draw with whatever we have
      }
      if (cancelled) return;

      const canvas = document.createElement("canvas");
      if (!(await drawBalloonWord(canvas, text, { fontFamily: family })) || cancelled) return;

      const url = canvas.toDataURL("image/webp", 0.92);
      await reveal(url);

      if (cacheable) {
        try {
          localStorage.setItem(CACHE_KEY, url);
        } catch {
          // over quota — the wordmark still shows, it just re-renders next time
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <span className="grid justify-items-center w-full max-w-[660px] [&>*]:col-start-1 [&>*]:row-start-1">
      <span ref={fallbackRef} className="balloon">
        {text}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        alt={text}
        className="w-full h-auto select-none opacity-0 transition-opacity duration-300"
        style={{ filter: "drop-shadow(0 26px 32px #18426052)" }}
      />
    </span>
  );
}
