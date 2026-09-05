"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sections lift into place the first time they come into view. Once shown they
 * stay shown — this is punctuation, not a toy.
 *
 * The reveal is written straight to the node rather than held in state: it is a
 * one-way handoff to the DOM, and keeping it out of React means no re-render
 * and no server/client divergence over what has scrolled past.
 */
export function Reveal({
  children,
  className = "",
  id,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    };

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(18px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </section>
  );
}
