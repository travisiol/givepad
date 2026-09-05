import { givenTotal } from "@/lib/given";
import { usdWhole } from "@/lib/format";
import { site } from "@/lib/site";

/**
 * The site total. It reads the indexer or it reads zero — see lib/given.ts for
 * why this is the one figure with no example mode.
 *
 * At zero it is set in ink, not rose. Rose marks the giving side of the
 * product everywhere else on the site, but there is nothing here to mark yet,
 * and a big rose zero reads as a design flourish rather than as a fact.
 */
export function GivenCounter({ className = "" }: { className?: string }) {
  const live = givenTotal.live && givenTotal.usd > 0;

  return (
    <div className={`card card-sm px-6 py-5 sm:px-8 sm:py-6 text-center ${className}`}>
      <span className="kicker">given to causes, all time</span>
      <p
        className={`mt-2 font-balloon font-extrabold leading-none tracking-[-0.03em] [font-size:clamp(44px,7vw,76px)] ${
          live ? "text-rose-deep" : "text-primary"
        }`}
      >
        {usdWhole(givenTotal.usd)}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-muted mx-auto max-w-md">
        {live ? (
          <>
            across {givenTotal.payouts} settled payouts from {givenTotal.launches} launches, each
            one a transaction you can open on {site.chain.name}.
          </>
        ) : (
          <>
            nothing has launched yet, so this is a real zero. it moves when a payout settles on
            chain — never on a projection, and never on the example rows below.
          </>
        )}
      </p>
    </div>
  );
}

/**
 * The line that has to sit above any table of example numbers. One sentence,
 * in the flow of the page rather than in a tooltip, because a reader who
 * screenshots the table should catch it in the same frame.
 */
export function SampleNote({ what = "rows" }: { what?: string }) {
  if (site.isLive) return null;
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-muted">
      <span className="badge badge-neutral">example</span>
      these {what} are a worked example of the mechanic. no token has launched, no money has moved,
      and the &ldquo;to cause&rdquo; column is arithmetic on made-up volume — not a donation.
    </p>
  );
}
