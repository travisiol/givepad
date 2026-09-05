import { site } from "./site";

/**
 * The one number on this site that is never seeded.
 *
 * Everything else here can render an example — a chart shape, a market cap, a
 * curve that is 40% full — because those illustrate a mechanic. A running
 * total of money given to charity does not illustrate anything; it *is* the
 * claim. A fabricated one is a fabricated donation, and it is the figure that
 * ends up screenshotted.
 *
 * So this reads the indexer or it reads zero, and the UI says which.
 */
export type GivenTotal = {
  /** usd routed to causes and settled on chain */
  usd: number;
  /** number of settled payouts behind that figure */
  payouts: number;
  /** how many launches have ever happened */
  launches: number;
  /** false while nothing is deployed — the zeros above are then the truth */
  live: boolean;
};

export const givenTotal: GivenTotal = {
  usd: 0,
  payouts: 0,
  launches: 0,
  live: site.isLive,
};

/**
 * What the example rows in lib/tokens.ts would have routed, given their volume.
 * Arithmetic on made-up volume, presented as such — never added to `givenTotal`
 * and never rendered without the sample note next to it.
 */
export function feesToCause(volumeUsd: number): number {
  return (volumeUsd * site.swapFeePct * (site.causeSharePct / 100)) / 100;
}
