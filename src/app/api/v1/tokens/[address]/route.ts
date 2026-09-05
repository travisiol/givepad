import { findCause } from "@/lib/causes";
import { feesToCause } from "@/lib/given";
import { json, preflight } from "@/lib/api";
import { site } from "@/lib/site";
import { findToken, priceSeries, seedTokens } from "@/lib/tokens";

export const dynamic = "force-static";

export function generateStaticParams() {
  return seedTokens.map((t) => ({ address: t.address }));
}

export function OPTIONS() {
  return preflight();
}

export async function GET(_req: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const token = findToken(address);
  if (!token) return json({ error: "not_found", message: `no token at ${address}` }, 404);

  const cause = findCause(token.cause);

  return json({
    live: site.isLive,
    note: site.isLive ? undefined : "example row; nothing is deployed and no money has moved.",
    token: {
      ...token,
      cause: {
        slug: token.cause,
        label: cause?.label ?? token.cause,
        recipient: cause?.orgs[0]?.name ?? null,
        recipientAddress: null,
      },
      wouldRouteUsd: Number(feesToCause(token.volumeUsd).toFixed(2)),
      givenUsd: 0,
      splitter: null,
      series: priceSeries(token, 96),
    },
  });
}
