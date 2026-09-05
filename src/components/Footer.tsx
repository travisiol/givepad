import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { BalloonMark } from "./BalloonMark";
import { XIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-20 pb-8">
      <div className="card px-6 py-6 sm:px-8 sm:py-7 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <BalloonMark size={36} />
            <span className="text-[18px] font-extrabold tracking-[-0.03em] text-primary leading-none">
              {site.name}
            </span>
          </Link>
          <span className="hidden sm:inline text-[12px] font-semibold text-muted lowercase ml-3">
            {site.venue.label} · {site.chain.name}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[12px] font-bold uppercase tracking-kicker text-muted hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            className="icon-btn"
            href={site.xUrl}
            aria-label={`${site.name} on X`}
            target="_blank"
            rel="noreferrer"
          >
            <XIcon />
          </a>
        </nav>
      </div>

      {/* the small print. it is small, but it is the part that has to be true. */}
      <p className="mt-6 px-2 text-[12px] leading-relaxed text-ink-40 max-w-3xl">
        {site.name} is a launch tool, not a charity, and it is not affiliated with any
        organisation named on this site. Causes listed in the registry are categories; an
        organisation appears only once {site.partner.name} has verified it and holds a payout
        address on {site.chain.name}. Nothing here is investment advice, tokens launched through
        this tool are not donations and are not tax deductible, and no figure on this site claims
        money has reached a cause until a settled payout is published on chain.
      </p>
    </footer>
  );
}
