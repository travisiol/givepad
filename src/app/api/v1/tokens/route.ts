import { causeLabel } from "@/lib/causes";
import { feesToCause } from "@/lib/given";
import { json, preflight } from "@/lib/api";
import { site } from "@/lib/site";
import { seedTokens } from "@/lib/tokens";

export const dynamic = "force-static";

export function OPTIONS() {
  return preflight();
}

/**
 * Every token, newest first.
 *
 * The response says whether it is reading an indexer, and every field that
 * could be mistaken for money already given is named for what it is:
 * `wouldRouteUsd`, computed from volume, not a settlement.
 */
export function GET() {
  const tokens = [...seedTokens]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((t) => ({
      address: t.address,
      name: t.name,
      symbol: t.symbol,
      description: t.description,
      pair: t.pair,
      cause: { slug: t.cause, label: causeLabel(t.cause) },
      causeSharePct: t.causeSharePct,
      priceUsd: t.priceUsd,
      marketCapUsd: t.marketCapUsd,
      volumeUsd: t.volumeUsd,
      curvePct: t.curvePct,
      wouldRouteUsd: Number(feesToCause(t.volumeUsd).toFixed(2)),
      givenUsd: 0,
      createdAt: t.createdAt,
      creator: t.creator,
      url: `${site.url}/token/${t.address}`,
    }));

  return json({
    live: site.isLive,
    note: site.isLive
      ? undefined
      : "no indexer configured; these are the example rows the site renders. nothing is deployed and no money has moved.",
    missing: site.isLive ? undefined : "NEXT_PUBLIC_GIVEPAD_API",
    count: tokens.length,
    tokens,
  });
}
