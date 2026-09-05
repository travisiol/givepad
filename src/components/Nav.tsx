"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { BalloonMark } from "./BalloonMark";
import { MenuIcon, XIcon } from "./icons";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // navigating closes the mobile menu — adjusted during render, not in an effect
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 border-b ${
        scrolled ? "nav-glass" : "border-transparent"
      }`}
    >
      <div className="relative mx-auto max-w-6xl h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2.5 shrink-0" aria-label={site.name}>
          <BalloonMark size={40} />
          <span className="hidden sm:inline text-[17px] font-extrabold tracking-[-0.03em] leading-none">
            {site.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[12px] font-bold uppercase tracking-kicker px-3 py-2 rounded-pill transition-colors ${
                isActive(item.href) ? "text-primary" : "text-muted hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <span className="badge badge-neutral">awaiting launch</span>
          <a
            className="icon-btn"
            href={site.xUrl}
            aria-label={`${site.name} on X`}
            target="_blank"
            rel="noreferrer"
          >
            <XIcon />
          </a>
          <Link className="btn-primary btn-sm" href="/launch">
            create
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            className="icon-btn"
            aria-label={menuOpen ? "close menu" : "open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full right-4 mt-2 w-56 card bg-elevated p-3 z-50">
            <nav className="flex flex-col">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[12px] font-bold uppercase tracking-kicker px-3 py-2.5 rounded-pill transition-colors ${
                    isActive(item.href) ? "text-primary bg-divider" : "text-muted hover:bg-divider"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link className="btn-primary btn-sm w-full mt-2" href="/launch">
              create
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
